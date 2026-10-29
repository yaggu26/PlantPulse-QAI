export type View = 'home' | 'analyzer' | 'comparison' | 'quantum' | 'research';

export type InputMethod = 'image' | 'text' | 'voice' | 'video';

export type AnalysisStatus = 'idle' | 'uploading' | 'analyzing' | 'done' | 'error';

export interface DiseaseResult {
  disease: string;
  scientificName: string;
  confidence: number;
  severity: 'Healthy' | 'Mild' | 'Moderate' | 'Severe';
  healthStatus: string;
  description: string;
  symptoms: string[];
  treatments: string[];
  prevention: string[];
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  executionTime: number;
}

export interface ComparisonRow {
  model: string;
  category: 'Quantum' | 'Classical' | 'Hybrid';
  metrics: ModelMetrics;
  description: string;
}

export interface CircuitGate {
  id: string;
  label: string;
  qubit: number;
  type: 'H' | 'RY' | 'CNOT' | 'M' | 'I';
  description: string;
}
