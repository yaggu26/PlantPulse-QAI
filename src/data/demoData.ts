import type { ComparisonRow, DiseaseResult, CircuitGate, InputMethod } from '@/types';

// All values below are illustrative sample data for UI demonstration only.
// They do NOT represent results from a trained model.

export const DEMO_DISEASE_RESULT: DiseaseResult = {
  disease: 'Early Blight',
  scientificName: 'Alternaria solani',
  confidence: 94.2,
  severity: 'Moderate',
  healthStatus: 'Affected — treatment recommended',
  description:
    'Early blight is a common fungal disease of solanaceous crops caused by Alternaria solani. It manifests as concentric ring lesions on lower leaves and can reduce yield significantly if left untreated.',
  symptoms: [
    'Dark brown concentric ring lesions on older leaves',
    'Yellow halos surrounding target-like spots',
    'Premature leaf drop and progressive defoliation',
    'Stem lesions near the soil line in advanced stages',
  ],
  treatments: [
    'Apply chlorothalonil or copper-based fungicide every 7–10 days',
    'Remove and destroy infected lower foliage to reduce inoculum',
    'Improve airflow through stake pruning and wider plant spacing',
    'Avoid overhead irrigation to keep leaf surfaces dry',
  ],
  prevention: [
    'Rotate solanaceous crops on a 2–3 year cycle',
    'Use disease-resistant cultivars where available',
    'Maintain balanced fertilization; avoid excess nitrogen',
    'Sanitize tools and stakes between plantings',
  ],
};

export const HEALTHY_RESULT: DiseaseResult = {
  disease: 'Healthy',
  scientificName: 'No pathogen detected',
  confidence: 98.6,
  severity: 'Healthy',
  healthStatus: 'Healthy — no action required',
  description:
    'No disease signature detected in the submitted leaf sample. Tissue coloration, texture, and venation patterns are consistent with a healthy plant specimen.',
  symptoms: [],
  treatments: [],
  prevention: [
    'Continue routine watering and nutrient management',
    'Maintain regular monitoring for early symptom onset',
    'Keep the canopy pruned for airflow',
  ],
};

// Text/symptom-description demo results keyed by keyword matches.
export const SYMPTOM_RESULTS: { keywords: string[]; result: DiseaseResult }[] = [
  {
    keywords: ['yellow', 'spot', 'mosaic', 'mottle', 'curl', 'stunt', 'virus', 'leaf curl'],
    result: {
      disease: 'Tomato Yellow Leaf Curl',
      scientificName: 'Tomato yellow leaf curl virus (TYLCV)',
      confidence: 90.8,
      severity: 'Severe',
      healthStatus: 'Affected — urgent treatment required',
      description:
        'Tomato yellow leaf curl is a begomovirus disease transmitted by whiteflies. It causes severe stunting, leaf curling, and yellowing, and can devastate entire crops if vectors are not controlled.',
      symptoms: [
        'Upward cupping and curling of leaf margins',
        'Yellowing of leaf tissue with green veins',
        'Stunted growth and reduced internode length',
        'Flower drop and failure to set fruit',
      ],
      treatments: [
        'Remove and destroy infected plants to limit spread',
        'Apply insecticidal soap or neem oil to suppress whiteflies',
        'Install reflective mulch to repel whitefly vectors',
        'Use virus-resistant tomato varieties in subsequent plantings',
      ],
      prevention: [
        'Control whitefly populations with yellow sticky traps',
        'Implement a whitefly-free period between crop cycles',
        'Rotate crops and remove solanaceous weeds',
        'Inspect transplants before field introduction',
      ],
    },
  },
  {
    keywords: ['powder', 'white', 'mildew', 'fuzzy', 'dusty'],
    result: {
      disease: 'Powdery Mildew',
      scientificName: 'Erysiphe cichoracearum / Leveillula taurica',
      confidence: 88.4,
      severity: 'Moderate',
      healthStatus: 'Affected — treatment recommended',
      description:
        'Powdery mildew is a fungal disease appearing as white to grey powdery patches on leaf surfaces. It thrives in humid, low-light conditions and reduces photosynthetic capacity.',
      symptoms: [
        'White powdery patches on upper leaf surfaces',
        'Yellowing and browning of infected tissue',
        'Leaf distortion and premature senescence',
        'Reduced fruit size and quality',
      ],
      treatments: [
        'Apply sulfur-based or potassium bicarbonate fungicides',
        'Improve ventilation and reduce canopy humidity',
        'Remove heavily infected lower leaves',
        'Avoid overhead irrigation and water early in the day',
      ],
      prevention: [
        'Space plants to ensure airflow',
        'Use resistant cultivars where available',
        'Avoid excessive nitrogen fertilization',
        'Monitor humidity levels in greenhouse environments',
      ],
    },
  },
  {
    keywords: ['rust', 'orange', 'pustule', 'reddish', 'brown pustule'],
    result: {
      disease: 'Leaf Rust',
      scientificName: 'Puccinia spp.',
      confidence: 86.9,
      severity: 'Moderate',
      healthStatus: 'Affected — treatment recommended',
      description:
        'Leaf rust is a fungal disease producing characteristic orange to reddish-brown pustules on leaves. It spreads rapidly in cool, moist conditions and can defoliate plants quickly.',
      symptoms: [
        'Small orange to rust-brown pustules on leaf surfaces',
        'Raised powdery spore masses that rub off',
        'Yellow halos around pustules',
        'Premature leaf drop in heavy infections',
      ],
      treatments: [
        'Apply triazole or strobilurin fungicides at first sign',
        'Remove and destroy infected leaves',
        'Avoid working with wet plants to reduce spore spread',
        'Improve spacing for faster leaf drying',
      ],
      prevention: [
        'Plant rust-resistant cultivars',
        'Rotate crops to break the rust life cycle',
        'Eliminate alternate hosts near the field',
        'Monitor and treat early before widespread sporulation',
      ],
    },
  },
  {
    keywords: ['blight', 'lesion', 'concentric', 'brown', 'target', 'dark brown'],
    result: DEMO_DISEASE_RESULT,
  },
  {
    keywords: ['healthy', 'normal', 'green', 'no disease', 'fine', 'good'],
    result: HEALTHY_RESULT,
  },
];

export function matchSymptoms(text: string): DiseaseResult {
  const lower = text.toLowerCase();
  for (const entry of SYMPTOM_RESULTS) {
    if (entry.keywords.some((k) => lower.includes(k))) {
      return entry.result;
    }
  }
  return DEMO_DISEASE_RESULT;
}

export const INPUT_METHODS: { id: InputMethod; label: string; icon: string }[] = [
  { id: 'image', label: 'Image Upload', icon: 'ImagePlus' },
  { id: 'text', label: 'Text / Symptoms', icon: 'Type' },
  { id: 'voice', label: 'Voice Input', icon: 'Mic' },
  { id: 'video', label: 'Live Video', icon: 'Video' },
];

export const COMPARISON_DATA: ComparisonRow[] = [
  {
    model: 'Hybrid Quantum-Classical',
    category: 'Hybrid',
    metrics: {
      accuracy: 94.2,
      precision: 93.8,
      recall: 94.5,
      f1Score: 94.1,
      executionTime: 1.84,
    },
    description:
      'Variational quantum circuit extracts non-linear feature embeddings, fed into a classical dense classifier.',
  },
  {
    model: 'Classical CNN (ResNet-18)',
    category: 'Classical',
    metrics: {
      accuracy: 91.4,
      precision: 90.9,
      recall: 91.2,
      f1Score: 91.0,
      executionTime: 0.42,
    },
    description:
      'Pretrained convolutional backbone with transfer learning on the plant disease dataset.',
  },
  {
    model: 'Classical SVM (RBF)',
    category: 'Classical',
    metrics: {
      accuracy: 86.7,
      precision: 85.9,
      recall: 86.3,
      f1Score: 86.1,
      executionTime: 0.18,
    },
    description: 'Support vector machine with radial basis function kernel on HOG features.',
  },
  {
    model: 'Quantum Kernel SVM',
    category: 'Quantum',
    metrics: {
      accuracy: 92.1,
      precision: 91.7,
      recall: 92.4,
      f1Score: 92.0,
      executionTime: 3.96,
    },
    description:
      'Quantum kernel estimated via interference on a PennyLane circuit, evaluated by a classical SVM.',
  },
];

export const CIRCUIT_GATES: CircuitGate[] = [
  {
    id: 'g1',
    label: 'H',
    qubit: 0,
    type: 'H',
    description: 'Hadamard gate creates uniform superposition of basis states.',
  },
  {
    id: 'g2',
    label: 'Ry(θ₁)',
    qubit: 1,
    type: 'RY',
    description: 'Parameterized rotation encodes a pixel-feature value into the quantum state.',
  },
  {
    id: 'g3',
    label: 'Ry(θ₂)',
    qubit: 2,
    type: 'RY',
    description: 'Second feature angle mapped from a second image embedding dimension.',
  },
  {
    id: 'g4',
    label: 'CNOT',
    qubit: 0,
    type: 'CNOT',
    description: 'Controlled-NOT entangles qubits 0 and 1, building quantum correlations.',
  },
  {
    id: 'g5',
    label: 'CNOT',
    qubit: 1,
    type: 'CNOT',
    description: 'Entangles qubits 1 and 2 to expand the entangled feature manifold.',
  },
  {
    id: 'g6',
    label: 'Ry(θ₃)',
    qubit: 0,
    type: 'RY',
    description: 'Trainable variational parameter tuned by the classical optimizer.',
  },
  {
    id: 'g7',
    label: 'M',
    qubit: 0,
    type: 'M',
    description: 'Measurement projects the state into classical bit probabilities.',
  },
  {
    id: 'g8',
    label: 'M',
    qubit: 1,
    type: 'M',
    description: 'Measurement yields expectation values fed to the classical classifier.',
  },
];

export const RESEARCH_OBJECTIVES = [
  {
    icon: 'Target',
    title: 'Hybrid Pipeline Design',
    body: 'Engineer a variational quantum circuit (VQC) that re-encodes classical leaf-image features and feeds a classical dense layer for disease classification.',
  },
  {
    icon: 'FlaskConical',
    title: 'Comparative Benchmarking',
    body: 'Benchmark the hybrid model against a classical CNN and an SVM across accuracy, precision, recall, F1-score, and inference latency.',
  },
  {
    icon: 'Atom',
    title: 'Quantum Advantage Analysis',
    body: 'Investigate whether quantum feature maps capture non-linear patterns that improve separability in low-data plant disease regimes.',
  },
  {
    icon: 'Sprout',
    title: 'Field-Ready Demo',
    body: 'Deliver an accessible web interface usable by agronomists and farmers for rapid, image-based disease screening in the field.',
  },
];

export const METHODOLOGY_STEPS = [
  {
    step: '01',
    title: 'Data Acquisition',
    body: 'Curated leaf-image dataset covering healthy and diseased crops with expert-annotated labels and balanced class distribution.',
  },
  {
    step: '02',
    title: 'Preprocessing',
    body: 'Resizing, normalization, augmentation (flip, rotate, brightness), and feature extraction into compact embedding vectors.',
  },
  {
    step: '03',
    title: 'Quantum Feature Map',
    body: 'Classical embeddings encoded as rotation angles on qubits via PennyLane angle embedding.',
  },
  {
    step: '04',
    title: 'Variational Circuit',
    body: 'Trainable parameterized gates optimize a quantum cost function through a classical optimizer loop.',
  },
  {
    step: '05',
    title: 'Hybrid Inference',
    body: 'Measured expectation values pass to a classical dense classifier producing the final disease prediction.',
  },
  {
    step: '06',
    title: 'Evaluation',
    body: 'Models scored on a held-out test set using accuracy, precision, recall, F1, and execution time.',
  },
];

export const ARCHITECTURE_LAYERS = [
  {
    layer: 'Input Layer',
    detail: 'Leaf image upload (drag-and-drop). Image validation and on-device preview.',
    tag: 'Frontend',
  },
  {
    layer: 'Preprocessing API',
    detail: 'Flask endpoint resizes, normalizes, and extracts a 16-dim feature embedding via a frozen encoder.',
    tag: 'Python / Flask',
  },
  {
    layer: 'Quantum Feature Map',
    detail: 'PennyLane circuit encodes 8 features as Ry rotations across 4 qubits with Hadamard superposition.',
    tag: 'PennyLane',
  },
  {
    layer: 'Variational Ansatz',
    detail: 'Two entangling layers of CNOT + trainable Ry gates; parameters updated by classical Adam optimizer.',
    tag: 'PennyLane',
  },
  {
    layer: 'Classical Dense Head',
    detail: 'Measured expectation values flow into a dense softmax classifier producing disease probabilities.',
    tag: 'PyTorch',
  },
  {
    layer: 'Response Layer',
    detail: 'JSON response returns prediction, confidence, and recommendation payload to the dashboard.',
    tag: 'API',
  },
];
