import { useState } from 'react';
import { Cpu, Atom, Clock, Target, Info } from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';

type ModelCategory = 'Classical' | 'Quantum';
type ModelResult = {
  model: string;
  category: ModelCategory;
  accuracy: number;
  description: string;
  note: string;
};

// These are the recorded held-out test accuracies from this project's training run.
// Do not add precision/recall/F1 unless those metrics are calculated from test predictions.
const MODEL_RESULTS: ModelResult[] = [
  {
    model: 'Classical SVM',
    category: 'Classical',
    accuracy: 84.0,
    description:
      'A classical Support Vector Machine trained on eight simple colour-statistics features extracted from Apple leaf images.',
    note: 'Recorded test accuracy: 84.00%.',
  },
  {
    model: 'Quantum-feature SVM',
    category: 'Quantum',
    accuracy: 46.67,
    description:
      'A PennyLane quantum circuit transforms four image features into expectation values. A classical SVM then classifies those quantum-derived features.',
    note: 'Recorded test accuracy: 46.67%. This is a quantum-feature pipeline, not a variationally trained quantum neural network.',
  },
];

const CATEGORY_STYLES: Record<ModelCategory, { chip: string; icon: typeof Cpu; bar: string }> = {
  Classical: {
    chip: 'bg-amber-100 text-amber-700',
    icon: Cpu,
    bar: 'from-amber-400 to-amber-600',
  },
  Quantum: {
    chip: 'bg-navy-100 text-navy-700',
    icon: Atom,
    bar: 'from-navy-500 to-navy-800',
  },
};

export function Comparison() {
  const [selected, setSelected] = useState<ModelCategory | 'all'>('all');
  const rows = MODEL_RESULTS.filter((row) => selected === 'all' || row.category === selected);
  const best = MODEL_RESULTS.reduce((a, b) => (a.accuracy >= b.accuracy ? a : b));

  return (
    <div className="animate-fade-in">
      <section className="container-page pt-12 pb-6">
        <SectionHeading
          eyebrow="Experimental Benchmark"
          title="Quantum vs Classical model comparison"
          subtitle="A transparent comparison of the two models actually trained in the PlantPulse QAI prototype."
        />
        <p className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
          <Info className="h-3.5 w-3.5" />
          Actual recorded test accuracies — experimental results on four Apple leaf classes.
        </p>
      </section>

      <section className="container-page pb-6">
        <div className="flex flex-wrap gap-2">
          {(['all', 'Classical', 'Quantum'] as const).map((category) => (
            <button
              key={category}
              onClick={() => setSelected(category)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                selected === category
                  ? 'bg-navy-950 text-white'
                  : 'border border-navy-100 bg-white text-navy-600 hover:border-brand-300'
              }`}
            >
              {category === 'all' ? 'Both models' : `${category} only`}
            </button>
          ))}
        </div>
      </section>

      <section className="container-page pb-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {rows.map((row) => {
            const style = CATEGORY_STYLES[row.category];
            const Icon = style.icon;
            return (
              <article key={row.model} className="card p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className={`chip ${style.chip}`}>
                    <Icon className="h-3.5 w-3.5" />
                    {row.category}
                  </span>
                  {row.model === best.model && (
                    <span className="chip bg-brand-600 text-white">Higher test accuracy</span>
                  )}
                </div>
                <h3 className="mt-3 font-display text-base font-semibold text-navy-900">
                  {row.model}
                </h3>
                <p className="mt-2 font-display text-3xl font-bold text-navy-950">
                  {row.accuracy.toFixed(2)}%
                </p>
                <p className="text-xs text-navy-500">held-out test accuracy</p>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-navy-100">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${style.bar}`}
                    style={{ width: `${row.accuracy}%` }}
                  />
                </div>
                <p className="mt-4 text-sm leading-relaxed text-navy-600">{row.description}</p>
                <p className="mt-3 text-xs leading-relaxed text-navy-500">{row.note}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="container-page pb-16">
        <div className="card p-6">
          <h3 className="font-display text-lg font-semibold text-navy-900">Evaluation notes</h3>
          <div className="mt-3 space-y-2 text-sm leading-relaxed text-navy-600">
            <p className="flex items-start gap-2">
              <Target className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
              The recorded training run used a held-out test split of 150 images across four Apple classes: Apple scab, Black rot, Cedar apple rust, and healthy.
            </p>
            <p className="flex items-start gap-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
              Inference time varies by image and machine; it is not presented here as a benchmark average.
            </p>
            <p>
              Precision, recall, and F1-score are omitted because verified values for those metrics were not recorded in the available training output. The quantum-feature model scored lower in this experiment, so these results do not demonstrate a quantum advantage.
            </p>
            <p className="text-xs text-navy-500">
              This prototype uses simple colour features and is limited to the four Apple classes listed above. Predictions can be incorrect and should be confirmed by an agricultural expert.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
