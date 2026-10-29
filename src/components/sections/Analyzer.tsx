import { useCallback, useState } from 'react';
import {
  ImagePlus,
  Type,
  Mic,
  Video,
  Loader2,
  AlertCircle,
  Scan,
  CheckCircle2,
} from 'lucide-react';

import { SectionHeading } from '@/components/SectionHeading';
import { ResultsPanel } from '@/components/ResultsPanel';
import { ImageInput } from '@/components/inputs/ImageInput';
import { TextInput } from '@/components/inputs/TextInput';
import { VoiceInput } from '@/components/inputs/VoiceInput';
import { VideoInput } from '@/components/inputs/VideoInput';

import {
  HEALTHY_RESULT,
  matchSymptoms,
} from '@/data/demoData';

import type {
  AnalysisStatus,
  DiseaseResult,
  InputMethod,
} from '@/types';

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 8 * 1024 * 1024;

const API_URL = 'https://plantpulse-qai.onrender.com/api/analyze';

const TABS: {
  id: InputMethod;
  label: string;
  icon: typeof ImagePlus;
}[] = [
  { id: 'image', label: 'Image', icon: ImagePlus },
  { id: 'text', label: 'Text', icon: Type },
  { id: 'voice', label: 'Voice', icon: Mic },
  { id: 'video', label: 'Live Video', icon: Video },
];

interface ModelPrediction {
  prediction: string;
  execution_time_ms: number;
}

interface APIResult {
  project: string;
  results: {
    classical: ModelPrediction;
    quantum: ModelPrediction;
    agreement: boolean;
    disease_info: {
      symptoms: string[];
      treatments: string[];
      precautions: string[];
      prevention: string[];
    };
  };
  test_accuracy: {
    classical: number;
    quantum: number;
  };
  warning: string;
}

function formatDisease(name: string) {
  return name
    .replace(/___/g, ' — ')
    .replace(/_/g, ' ')
    .trim();
}

function accuracyPercent(value: number) {
  return `${(value * 100).toFixed(2)}%`;
}

export function Analyzer() {
  const [method, setMethod] = useState<InputMethod>('image');

  const [status, setStatus] =
    useState<AnalysisStatus>('idle');

  const [preview, setPreview] =
    useState<string | null>(null);

  const [fileName, setFileName] = useState('');

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [error, setError] = useState('');

  const [result, setResult] =
    useState<DiseaseResult | null>(null);

  const [apiResult, setApiResult] =
    useState<APIResult | null>(null);

  const [dragging, setDragging] = useState(false);

  const [textValue, setTextValue] = useState('');

  const [voiceText, setVoiceText] = useState('');

  const reset = () => {
    setPreview(null);
    setFileName('');
    setSelectedFile(null);
    setError('');
    setResult(null);
    setApiResult(null);
    setStatus('idle');
  };

  const switchMethod = (m: InputMethod) => {
    setMethod(m);
    setError('');
    setResult(null);
    setApiResult(null);
    setStatus('idle');
  };

  const handleFile = useCallback((file: File) => {
    setError('');
    setResult(null);
    setApiResult(null);
    setSelectedFile(null);

    if (!ACCEPTED.includes(file.type)) {
      setError(
        'Unsupported file type. Please upload a JPG, PNG, or WebP image.',
      );
      return;
    }

    if (file.size > MAX_SIZE) {
      setError('Image exceeds the 8MB size limit.');
      return;
    }

    setSelectedFile(file);
    setFileName(file.name);

    setPreview(URL.createObjectURL(file));
    setStatus('idle');
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);

      const file = e.dataTransfer.files?.[0];

      if (file) {
        handleFile(file);
      }
    },
    [handleFile],
  );

  const canAnalyze = (): boolean => {
    if (status === 'analyzing') return false;

    if (method === 'image' || method === 'video') {
      return !!selectedFile;
    }

    if (method === 'text') {
      return textValue.trim().length > 3;
    }

    if (method === 'voice') {
      return voiceText.trim().length > 3;
    }

    return false;
  };

  const onAnalyze = async () => {
    if (!canAnalyze()) return;

    setStatus('analyzing');
    setError('');
    setResult(null);
    setApiResult(null);

    try {
      if (method === 'image' || method === 'video') {
        if (!selectedFile) {
          throw new Error(
            'Please select a plant leaf image first.',
          );
        }

        const formData = new FormData();

        formData.append('image', selectedFile);

        const response = await fetch(API_URL, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || 'Plant analysis failed.',
          );
        }

        if (
          !data.results?.classical ||
          !data.results?.quantum ||
          !data.test_accuracy
        ) {
          throw new Error(
            'Unexpected response received from the backend.',
          );
        }

        setApiResult(data as APIResult);
        setStatus('done');

        return;
      }

      // Text and voice currently use the existing
      // symptom-matching functionality.
      const symptoms =
        method === 'text' ? textValue : voiceText;

      const textResult = matchSymptoms(symptoms);

      setResult(textResult);
      setStatus('done');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Analysis failed. Please try again.',
      );

      setStatus('error');
    }
  };

  const onQuickHealthy = () => {
    setApiResult(null);
    setStatus('done');
    setResult(HEALTHY_RESULT);
  };

  return (
    <div className="animate-fade-in">
      <section className="container-page pt-12 pb-6">
        <SectionHeading
          eyebrow="Plant Disease Analyzer"
          title="Diagnose a plant in four ways"
          subtitle="Upload a leaf photo, describe symptoms in text, speak your observations aloud, or capture a frame from live video."
        />

        <p className="mt-4 text-xs font-medium text-brand-700 bg-brand-50 inline-flex items-center gap-1.5 rounded-full px-3 py-1 border border-brand-100">
          <AlertCircle className="h-3.5 w-3.5" />

          Image analysis uses the locally trained experimental
          classical and quantum-feature models. Text and voice
          use symptom matching.
        </p>
      </section>

      {/* Input method tabs */}
      <section className="container-page pb-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const activeTab = method === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => switchMethod(tab.id)}
                className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                  activeTab
                    ? 'bg-navy-950 text-white shadow-card'
                    : 'bg-white border border-navy-100 text-navy-600 hover:border-brand-300 hover:text-brand-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="container-page pb-16">
        <div className="grid gap-6 lg:grid-cols-2">

          {/* Input card */}
          <div className="card p-6 sm:p-7">
            {method === 'image' && (
              <ImageInput
                preview={preview}
                fileName={fileName}
                error={error}
                dragging={dragging}
                setDragging={setDragging}
                onFile={handleFile}
                onReset={reset}
              />
            )}

            {method === 'text' && (
              <TextInput
                value={textValue}
                onChange={(value) => {
                  setTextValue(value);
                  setResult(null);
                  setApiResult(null);
                  setStatus('idle');
                }}
                onSubmit={onAnalyze}
              />
            )}

            {method === 'voice' && (
              <VoiceInput
                onTranscript={(transcript) => {
                  setVoiceText(transcript);
                  setResult(null);
                  setApiResult(null);
                  setStatus('idle');
                }}
                onError={(message) => setError(message)}
              />
            )}

            {method === 'video' && (
              <VideoInput
                onCapture={handleFile}
                preview={preview}
                onError={reset}
              />
            )}

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={onAnalyze}
                disabled={!canAnalyze()}
                className="btn-primary flex-1 min-w-[180px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'analyzing' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing…
                  </>
                ) : (
                  <>
                    <Scan className="h-4 w-4" />
                    Analyze Plant
                  </>
                )}
              </button>

              <button
                onClick={onQuickHealthy}
                className="btn-ghost"
              >
                <CheckCircle2 className="h-4 w-4" />
                Show healthy sample
              </button>

              {(preview || textValue || voiceText) && (
                <button
                  onClick={() => {
                    reset();
                    setTextValue('');
                    setVoiceText('');
                  }}
                  className="btn-ghost"
                >
                  Reset
                </button>
              )}
            </div>

            <p className="mt-4 text-[11px] text-navy-400">
              Image predictions use a locally running Flask API
              with classical SVM and PennyLane quantum-feature
              processing.
            </p>
          </div>

          {/* Results card */}
          <div className="card p-6 sm:p-7 min-h-[420px]">

            {status === 'idle' && !result && !apiResult && (
              <div className="grid h-full place-items-center text-center py-12">
                <div>
                  <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-navy-50 text-navy-300">
                    <Scan className="h-7 w-7" />
                  </span>

                  <p className="mt-4 font-display text-lg font-semibold text-navy-800">
                    Results will appear here
                  </p>

                  <p className="mt-1 text-sm text-navy-500 max-w-xs mx-auto">
                    Upload an Apple leaf image to compare
                    classical and quantum-feature predictions.
                  </p>
                </div>
              </div>
            )}

            {status === 'analyzing' && (
              <div className="grid h-full place-items-center text-center py-12">
                <div>
                  <div className="relative mx-auto h-20 w-20">
                    <span className="absolute inset-0 rounded-full bg-brand-200 animate-pulse-ring" />

                    <span
                      className="absolute inset-0 rounded-full bg-brand-200 animate-pulse-ring"
                      style={{ animationDelay: '0.8s' }}
                    />

                    <span className="relative grid h-20 w-20 place-items-center rounded-full bg-brand-600 text-white">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </span>
                  </div>

                  <p className="mt-5 font-display text-lg font-semibold text-navy-800">
                    Running model inference
                  </p>

                  <p className="mt-1 text-sm text-navy-500">
                    Processing image features and executing
                    the quantum circuit.
                  </p>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="grid h-full place-items-center text-center py-12">
                <div className="max-w-xs">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-500">
                    <AlertCircle className="h-6 w-6" />
                  </span>

                  <p className="mt-4 font-semibold text-red-700">
                    Analysis failed
                  </p>

                  <p className="mt-1 text-sm text-navy-500">
                    {error || 'Please try again.'}
                  </p>
                </div>
              </div>
            )}

            {/* Actual backend prediction results */}
            {status === 'done' && apiResult && (
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
                    PlantPulse QAI
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-navy-900">
                    Model Comparison Results
                  </h2>

                  <p className="mt-1 text-xs text-navy-500">
                    Experimental predictions from the trained
                    four-class Apple leaf models.
                  </p>
                </div>

                {/* Classical prediction */}
                <div className="rounded-xl border border-navy-100 bg-navy-50/50 p-4">
                  <p className="text-sm font-semibold text-navy-700">
                    Classical ML — SVM
                  </p>

                  <p className="mt-2 text-lg font-bold text-navy-950">
                    {formatDisease(
                      apiResult.results.classical.prediction,
                    )}
                  </p>

                  <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-navy-500">
                    <span>
                      Test accuracy:{' '}
                      {accuracyPercent(
                        apiResult.test_accuracy.classical,
                      )}
                    </span>

                    <span>
                      Inference:{' '}
                      {apiResult.results.classical.execution_time_ms}
                      {' '}ms
                    </span>
                  </div>
                </div>

                {/* Quantum prediction */}
                <div className="rounded-xl border border-brand-200 bg-brand-50/40 p-4">
                  <p className="text-sm font-semibold text-brand-800">
                    Quantum-Feature ML — PennyLane + SVM
                  </p>

                  <p className="mt-2 text-lg font-bold text-navy-950">
                    {formatDisease(
                      apiResult.results.quantum.prediction,
                    )}
                  </p>

                  <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-navy-500">
                    <span>
                      Test accuracy:{' '}
                      {accuracyPercent(
                        apiResult.test_accuracy.quantum,
                      )}
                    </span>

                    <span>
                      Inference:{' '}
                      {apiResult.results.quantum.execution_time_ms}
                      {' '}ms
                    </span>
                  </div>
                </div>

                {/* Disease guidance from the backend */}
                <div className="space-y-4">
                  {[
                    { title: 'Observed symptoms', items: apiResult.results.disease_info?.symptoms ?? [] },
                    { title: 'Treatment recommendations', items: apiResult.results.disease_info?.treatments ?? [] },
                    { title: 'Precautions', items: apiResult.results.disease_info?.precautions ?? [] },
                    { title: 'Prevention tips', items: apiResult.results.disease_info?.prevention ?? [] },
                  ].map((section) => (
                    <div key={section.title} className="rounded-xl border border-navy-100 bg-white p-4">
                      <h3 className="text-sm font-semibold text-navy-800">{section.title}</h3>
                      {section.items.length > 0 ? (
                        <ul className="mt-2 space-y-2">
                          {section.items.map((item, index) => (
                            <li key={`${section.title}-${index}`} className="flex gap-2 text-sm leading-relaxed text-navy-600">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-2 text-sm text-navy-500">No information available.</p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Agreement */}
                <div className="rounded-xl border border-navy-100 p-4">
                  <p className="text-sm font-semibold text-navy-800">
                    Prediction agreement
                  </p>

                  <p className="mt-1 text-sm text-navy-600">
                    {apiResult.results.agreement
                      ? 'Both models predicted the same class.'
                      : 'The models predicted different classes.'}
                  </p>
                </div>

                <p className="text-xs leading-relaxed text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  {apiResult.warning}
                </p>
              </div>
            )}

            {/* Existing sample results for text, voice and
                the healthy-sample button */}
            {status === 'done' && result && !apiResult && (
              <ResultsPanel result={result} />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}