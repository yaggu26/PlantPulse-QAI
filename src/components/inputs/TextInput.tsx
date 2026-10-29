import { AlertCircle } from 'lucide-react';

interface TextInputProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
}

const SYMPTOM_PROMPTS = [
  'Yellow leaves with curling edges',
  'White powdery patches on leaves',
  'Brown concentric rings on lower leaves',
  'Orange pustules on leaf surface',
  'Leaves look green and healthy',
];

export function TextInput({ value, onChange, onSubmit }: TextInputProps) {
  return (
    <div>
      <div className="rounded-2xl border border-navy-200 bg-navy-50/40 p-4">
        <label htmlFor="symptom-text" className="text-sm font-medium text-navy-700">
          Describe the plant symptoms you observe
        </label>
        <textarea
          id="symptom-text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={5}
          placeholder="e.g. The lower leaves have dark brown spots with concentric rings and yellow halos…"
          className="mt-2 w-full resize-none rounded-xl border border-navy-200 bg-white px-4 py-3 text-sm text-navy-800 placeholder:text-navy-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
        <div className="mt-3">
          <p className="text-xs font-medium text-navy-500 mb-2">Try an example:</p>
          <div className="flex flex-wrap gap-2">
            {SYMPTOM_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => onChange(p)}
                className="rounded-full border border-navy-200 bg-white px-3 py-1 text-xs text-navy-600 hover:border-brand-300 hover:text-brand-700 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-3 flex items-start gap-1.5 text-[11px] text-navy-400">
        <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
        In production, the symptom text is sent to the Flask backend where the NLP classifier matches
        it against known disease patterns. This demo returns sample data.
      </p>
    </div>
  );
}
