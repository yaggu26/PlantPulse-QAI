import os
import random
import time
import joblib
import numpy as np
import pennylane as qml

from PIL import Image
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, classification_report

# -------------------------------
# 1. Configuration
# -------------------------------

random.seed(42)
np.random.seed(42)

DATASET = (
    Path.home()
    / "Downloads"
    / "PlantVillage-Dataset-master"
    / "PlantVillage-Dataset-master"
    / "raw"
    / "color"
)

CLASSES = [
    "Apple___Apple_scab",
    "Apple___Black_rot",
    "Apple___Cedar_apple_rust",
    "Apple___healthy",
]

MAX_IMAGES_PER_CLASS = 150
IMAGE_SIZE = (64, 64)

BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "models"
MODEL_DIR.mkdir(exist_ok=True)

# -------------------------------
# 2. Image feature extraction
# -------------------------------

def extract_features(image_path):
    image = Image.open(image_path).convert("RGB")
    image = image.resize(IMAGE_SIZE)

    pixels = np.asarray(image, dtype=np.float32) / 255.0

    red = pixels[:, :, 0]
    green = pixels[:, :, 1]
    blue = pixels[:, :, 2]

    features = [
        red.mean(),
        green.mean(),
        blue.mean(),
        red.std(),
        green.std(),
        blue.std(),
        (green > red).mean(),
        (red > green).mean(),
    ]

    return np.asarray(features, dtype=np.float32)


# -------------------------------
# 3. Load dataset
# -------------------------------

def load_dataset():
    X = []
    y = []

    if not DATASET.exists():
        raise FileNotFoundError(
            f"Dataset not found: {DATASET}"
        )

    for label, class_name in enumerate(CLASSES):
        folder = DATASET / class_name

        if not folder.exists():
            raise FileNotFoundError(
                f"Class folder missing: {folder}"
            )

        files = [
            p for p in folder.iterdir()
            if p.suffix.lower() in
            [".jpg", ".jpeg", ".png", ".bmp"]
        ]

        random.shuffle(files)
        files = files[:MAX_IMAGES_PER_CLASS]

        print(f"Loading {class_name}: {len(files)} images")

        for index, file_path in enumerate(files):
            try:
                X.append(extract_features(file_path))
                y.append(label)
            except Exception as error:
                print(f"Skipping {file_path.name}: {error}")

    if len(X) == 0:
        raise RuntimeError("No images were loaded.")

    return np.asarray(X), np.asarray(y)


# -------------------------------
# 4. Quantum feature circuit
# -------------------------------

N_QUBITS = 4
DEVICE = qml.device("default.qubit", wires=N_QUBITS)


@qml.qnode(DEVICE)
def quantum_circuit(inputs):
    # Encode four image features into four qubits
    for wire in range(N_QUBITS):
        qml.RY(inputs[wire], wires=wire)
        qml.RZ(inputs[wire] * 0.5, wires=wire)

    # Entangle neighbouring qubits
    for wire in range(N_QUBITS - 1):
        qml.CNOT(wires=[wire, wire + 1])

    # Quantum measurements
    return tuple(
        qml.expval(qml.PauliZ(wire))
        for wire in range(N_QUBITS)
    )


def quantum_features(X):
    results = []

    for index, row in enumerate(X):
        # Convert first four image features into angles
        angles = np.clip(row[:4], 0, 1) * np.pi

        result = quantum_circuit(angles)
        results.append(np.asarray(result, dtype=float))

        if (index + 1) % 50 == 0:
            print(
                f"Quantum processing: {index + 1}/{len(X)}"
            )

    return np.asarray(results)


# -------------------------------
# 5. Train and compare models
# -------------------------------

def main():
    start = time.time()

    print("\nPlantPulse QAI Model Training")
    print("=" * 40)

    X, y = load_dataset()

    print(f"\nLoaded images: {len(X)}")
    print(f"Feature count: {X.shape[1]}")

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.25,
        random_state=42,
        stratify=y,
    )

    # Classical ML model
    print("\nTraining classical SVM...")

    classical_model = Pipeline([
        ("scaler", StandardScaler()),
        ("classifier", SVC(
            kernel="rbf",
            class_weight="balanced",
        )),
    ])

    classical_model.fit(X_train, y_train)
    classical_predictions = classical_model.predict(X_test)

    classical_accuracy = accuracy_score(
        y_test, classical_predictions
    )

    print(
        f"Classical test accuracy: "
        f"{classical_accuracy:.4f}"
    )

    print("\nClassical classification report:")
    print(classification_report(
        y_test,
        classical_predictions,
        labels=np.arange(len(CLASSES)),
        target_names=CLASSES,
        zero_division=0,
    ))

    # Hybrid quantum-classical model
    print("\nGenerating quantum features...")

    X_quantum = quantum_features(X)

    Xq_train, Xq_test, yq_train, yq_test = (
        train_test_split(
            X_quantum,
            y,
            test_size=0.25,
            random_state=42,
            stratify=y,
        )
    )

    print("\nTraining quantum-feature SVM...")

    quantum_model = Pipeline([
        ("scaler", StandardScaler()),
        ("classifier", SVC(
            kernel="rbf",
            class_weight="balanced",
        )),
    ])

    quantum_model.fit(Xq_train, yq_train)
    quantum_predictions = quantum_model.predict(Xq_test)

    quantum_accuracy = accuracy_score(
        yq_test, quantum_predictions
    )

    print(
        f"Hybrid quantum test accuracy: "
        f"{quantum_accuracy:.4f}"
    )

    print("\nQuantum classification report:")
    print(classification_report(
        yq_test,
        quantum_predictions,
        labels=np.arange(len(CLASSES)),
        target_names=CLASSES,
        zero_division=0,
    ))

    # Save models and metadata
    joblib.dump(
        classical_model,
        MODEL_DIR / "classical_model.joblib",
    )

    joblib.dump(
        quantum_model,
        MODEL_DIR / "quantum_model.joblib",
    )

    joblib.dump(
        {
            "classes": CLASSES,
            "image_size": IMAGE_SIZE,
            "feature_count": 8,
            "max_images_per_class": MAX_IMAGES_PER_CLASS,
            "test_size": 0.25,
            "random_state": 42,
            "classical_accuracy": float(classical_accuracy),
            "quantum_accuracy": float(quantum_accuracy),
        },
        MODEL_DIR / "metadata.joblib",
    )

    print("\n" + "=" * 40)
    print("TRAINING COMPLETE")
    print(f"Classical accuracy: {classical_accuracy:.4f}")
    print(f"Quantum accuracy:   {quantum_accuracy:.4f}")
    print(f"Time taken: {time.time() - start:.1f} seconds")
    print(f"Models saved in: {MODEL_DIR}")


if __name__ == "__main__":
    main()

