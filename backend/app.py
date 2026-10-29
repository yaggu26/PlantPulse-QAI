from flask import Flask, request, jsonify
from flask_cors import CORS
from pathlib import Path
from PIL import Image
import pennylane as qml
import numpy as np
import joblib
import io
import time

app = Flask(__name__)
CORS(app)

BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "models"

# Load trained models
classical_model = joblib.load(MODEL_DIR / "classical_model.joblib")
quantum_model = joblib.load(MODEL_DIR / "quantum_model.joblib")
metadata = joblib.load(MODEL_DIR / "metadata.joblib")

CLASSES = metadata["classes"]
IMAGE_SIZE = tuple(metadata["image_size"])

# PennyLane quantum circuit
N_QUBITS = 4
device = qml.device("default.qubit", wires=N_QUBITS)


@qml.qnode(device)
def quantum_circuit(inputs):
    for wire in range(N_QUBITS):
        qml.RY(inputs[wire], wires=wire)
        qml.RZ(inputs[wire] * 0.5, wires=wire)

    for wire in range(N_QUBITS - 1):
        qml.CNOT(wires=[wire, wire + 1])

    return tuple(
        qml.expval(qml.PauliZ(wire))
        for wire in range(N_QUBITS)
    )


def extract_features(image):
    image = image.convert("RGB").resize(IMAGE_SIZE)
    pixels = np.asarray(image, dtype=np.float32) / 255.0

    red = pixels[:, :, 0]
    green = pixels[:, :, 1]
    blue = pixels[:, :, 2]

    return np.asarray([
        red.mean(),
        green.mean(),
        blue.mean(),
        red.std(),
        green.std(),
        blue.std(),
        (green > red).mean(),
        (red > green).mean(),
    ], dtype=np.float32)


# Information for the four Apple classes used by this model.
DISEASE_INFO = {
    "Apple___Apple_scab": {
        "symptoms": [
            "Olive-green or dark scabby spots on leaves",
            "Dark lesions that may become cracked",
            "Premature leaf drop in severe cases",
        ],
        "treatments": [
            "Remove infected fallen leaves where practical",
            "Consult an agricultural expert about suitable fungicides",
            "Follow local agricultural recommendations and product labels",
        ],
        "precautions": [
            "Avoid overhead watering where practical",
            "Manage infected plant debris appropriately",
        ],
        "prevention": [
            "Choose resistant varieties when available",
            "Improve airflow through appropriate pruning",
            "Maintain good orchard sanitation",
        ],
    },
    "Apple___Black_rot": {
        "symptoms": [
            "Brown leaf spots with darker margins",
            "Expanding areas of dead tissue",
            "Possible fruit or branch symptoms",
        ],
        "treatments": [
            "Remove infected plant material where practical",
            "Inspect nearby branches and fruit",
            "Consult an agricultural expert about disease management",
        ],
        "precautions": [
            "Clean pruning tools between affected plants",
            "Avoid leaving infected plant debris nearby",
        ],
        "prevention": [
            "Maintain orchard sanitation",
            "Prune dead or diseased branches appropriately",
            "Monitor plants regularly",
        ],
    },
    "Apple___Cedar_apple_rust": {
        "symptoms": [
            "Yellow-orange spots on leaves",
            "Orange or rusty lesions that may enlarge",
            "Tube-like structures may develop under leaves",
        ],
        "treatments": [
            "Confirm the disease before choosing treatment",
            "Consult an agricultural expert about suitable fungicides",
            "Follow local guidance on managing cedar or juniper hosts",
        ],
        "precautions": [
            "Do not diagnose the disease from color alone",
            "Inspect additional leaves and the whole plant",
        ],
        "prevention": [
            "Choose resistant varieties when available",
            "Monitor susceptible plants regularly",
            "Follow local disease-management guidance",
        ],
    },
    "Apple___healthy": {
        "symptoms": [
            "The model predicts the healthy Apple class",
            "This prediction does not guarantee that the plant is disease-free",
        ],
        "treatments": [
            "No disease-specific treatment is indicated by this prediction",
            "Continue appropriate routine plant care",
        ],
        "precautions": [
            "Check both sides of leaves for unusual spots",
            "Seek expert advice if the plant looks unhealthy",
        ],
        "prevention": [
            "Maintain suitable watering and nutrition",
            "Ensure appropriate sunlight and airflow",
            "Inspect leaves regularly",
        ],
    },
}


def get_disease_info(prediction):
    return DISEASE_INFO.get(
        prediction,
        {
            "symptoms": ["Further inspection is needed."],
            "treatments": [
                "Confirm the diagnosis with an agricultural expert."
            ],
            "precautions": [
                "Do not apply disease-specific chemicals based only on this prediction."
            ],
            "prevention": [
                "Monitor the plant and follow local agricultural guidance."
            ],
        },
    )


def predict_image(image):
    features = extract_features(image).reshape(1, -1)

    # Classical SVM prediction
    classical_start = time.perf_counter()
    classical_id = int(classical_model.predict(features)[0])
    classical_time = (time.perf_counter() - classical_start) * 1000

    # Quantum feature transformation followed by SVM prediction
    quantum_start = time.perf_counter()
    angles = np.clip(features[0, :4], 0, 1) * np.pi
    quantum_values = quantum_circuit(angles)
    quantum_features = np.asarray(
        quantum_values, dtype=float
    ).reshape(1, -1)
    quantum_id = int(quantum_model.predict(quantum_features)[0])
    quantum_time = (time.perf_counter() - quantum_start) * 1000

    classical_prediction = CLASSES[classical_id]
    quantum_prediction = CLASSES[quantum_id]

    return {
        "classical": {
            "prediction": classical_prediction,
            "execution_time_ms": round(classical_time, 2),
        },
        "quantum": {
            "prediction": quantum_prediction,
            "execution_time_ms": round(quantum_time, 2),
        },
        "agreement": classical_id == quantum_id,
        # Disease guidance is based on the classical model's prediction.
        "disease_info": get_disease_info(classical_prediction),
    }


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "running",
        "project": "PlantPulse QAI",
        "quantum_simulator": "PennyLane",
        "models_loaded": True,
    })


@app.route("/api/analyze", methods=["POST"])
def analyze():
    if "image" not in request.files:
        return jsonify({
            "error": "Upload an image using the 'image' field."
        }), 400

    try:
        file = request.files["image"]
        with Image.open(io.BytesIO(file.read())) as image:
            image.load()
            results = predict_image(image)

        return jsonify({
            "project": "PlantPulse QAI",
            "results": results,
            "test_accuracy": {
                "classical": metadata["classical_accuracy"],
                "quantum": metadata["quantum_accuracy"],
            },
            "warning": (
                "Experimental prediction: the models were trained on four "
                "Apple leaf classes using simple color features. Predictions "
                "may be incorrect. Confirm the diagnosis before treatment."
            ),
        })

    except Exception:
        app.logger.exception("Image analysis failed")
        return jsonify({
            "error": "Image analysis failed. Check the backend terminal."
        }), 400


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False)
