import {
  Microscope,
  HeartPulse,
  ShieldAlert,
  CheckCircle2,
  Activity,
  Leaf,
  FlaskConical,
  ShieldCheck,
} from 'lucide-react';
import type { DiseaseResult } from '@/types';

interface ResultsPanelProps {
  result: DiseaseResult;
}

const SEVERITY_STYLES: Record<DiseaseResult['severity'], { bg: string; text: string; label: string }> = {
  Healthy: { bg: 'bg-brand-100', text: 'text-brand-700', label: 'Healthy' },
  Mild: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Mild' },
  Moderate: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Moderate' },
  Severe: { bg: 'bg-red-100', text: 'text-red-700', label: 'Severe' },
};

export function ResultsPanel({ result }: ResultsPanelProps) {
  const isHealthy = result.severity === 'Healthy';
  const sev = SEVERITY_STYLES[result.severity];

  return (
    <div className="animate-fade-up space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            Prediction result
          </p>
          <h3 className="font-display text-2xl font-bold text-navy-950 mt-1">
            {result.disease}
          </h3>
          <p className="text-sm italic text-navy-500 mt-0.5">{result.scientificName}</p>
        </div>
        <span className={`chip ${sev.bg} ${sev.text}`}>
          <ShieldAlert className="h-3.5 w-3.5" />
          {sev.label}
        </span>
      </div>

      {/* Confidence bar */}
      <div>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-navy-600 flex items-center gap-1.5">
            <Activity className="h-4 w-4 text-brand-600" />
            Confidence score
          </span>
          <span className="font-mono font-semibold text-navy-900">
            {result.confidence.toFixed(1)}%
          </span>
        </div>
        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-navy-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all duration-700"
            style={{ width: `${result.confidence}%` }}
          />
        </div>
      </div>

      {/* Health status */}
      <div className="flex items-center gap-3 rounded-xl bg-navy-50 border border-navy-100 px-4 py-3">
        <span className={`grid h-9 w-9 place-items-center rounded-lg ${isHealthy ? 'bg-brand-100 text-brand-700' : 'bg-orange-100 text-orange-700'}`}>
          {isHealthy ? <HeartPulse className="h-5 w-5" /> : <Microscope className="h-5 w-5" />}
        </span>
        <div>
          <p className="text-xs font-medium text-navy-500">Plant health status</p>
          <p className="text-sm font-semibold text-navy-900">{result.healthStatus}</p>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-navy-600">{result.description}</p>

      {/* Symptoms */}
      {result.symptoms.length > 0 && (
        <div>
          <p className="flex items-center gap-1.5 text-sm font-semibold text-navy-800">
            <FlaskConical className="h-4 w-4 text-brand-600" />
            Observed symptoms
          </p>
          <ul className="mt-2 space-y-1.5">
            {result.symptoms.map((s) => (
              <li key={s} className="flex gap-2 text-sm text-navy-600">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-500 shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Treatments */}
      {result.treatments.length > 0 && (
        <div className="rounded-xl border border-orange-100 bg-orange-50/50 p-4">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-orange-700">
            <ShieldCheck className="h-4 w-4" />
            Treatment recommendations
          </p>
          <ul className="mt-2 space-y-2">
            {result.treatments.map((t) => (
              <li key={t} className="flex gap-2 text-sm text-navy-700">
                <CheckCircle2 className="h-4 w-4 mt-0.5 text-orange-500 shrink-0" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Prevention */}
      <div>
        <p className="flex items-center gap-1.5 text-sm font-semibold text-navy-800">
          <Leaf className="h-4 w-4 text-brand-600" />
          Prevention tips
        </p>
        <ul className="mt-2 space-y-1.5">
          {result.prevention.map((p) => (
            <li key={p} className="flex gap-2 text-sm text-navy-600">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-navy-400 shrink-0" />
              {p}
            </li>
          ))}
        </ul>
      </div>

      <p className="pt-2 border-t border-navy-100 text-[11px] text-navy-400">
        Sample data for demonstration. Connect a Flask + PennyLane backend for live predictions.
      </p>
    </div>
  );
}
