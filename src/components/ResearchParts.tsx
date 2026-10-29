import {
  Target,
  FlaskConical,
  Atom,
  Sprout,
  Layers,
  Cpu,
  Database,
  GitBranch,
  Network,
  Server,
  Boxes,
  ArrowRight,
} from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { RESEARCH_OBJECTIVES, METHODOLOGY_STEPS, ARCHITECTURE_LAYERS } from '@/data/demoData';

const OBJ_ICONS: Record<string, typeof Target> = {
  Target,
  FlaskConical,
  Atom,
  Sprout,
};

export function Objectives() {
  return (
    <section className="container-page">
      <SectionHeading eyebrow="Research objectives" title="Four goals of the study" />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {RESEARCH_OBJECTIVES.map((o) => {
          const Icon = OBJ_ICONS[o.icon] ?? Atom;
          return (
            <div key={o.title} className="card p-5 h-full hover:-translate-y-1 transition-transform">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy-950 text-brand-400">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display font-semibold text-navy-900">{o.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-600">{o.body}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function Methodology() {
  return (
    <section className="bg-white border-y border-navy-100 py-16">
      <div className="container-page">
        <SectionHeading
          eyebrow="Methodology"
          title="End-to-end experimental pipeline"
          subtitle="Six stages from raw leaf imagery to evaluated hybrid model."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {METHODOLOGY_STEPS.map((s, i) => (
            <div key={s.step} className="relative card p-6">
              <div className="flex items-center justify-between">
                <span className="font-display text-3xl font-bold text-brand-200">{s.step}</span>
                {i < METHODOLOGY_STEPS.length - 1 && (
                  <ArrowRight className="h-5 w-5 text-navy-300 hidden lg:block" />
                )}
              </div>
              <h3 className="mt-2 font-display font-semibold text-navy-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-600">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const LAYER_ICONS = [Layers, Cpu, Atom, GitBranch, Network, Server];

export function Architecture() {
  return (
    <section className="container-page">
      <SectionHeading
        eyebrow="Model Architecture"
        title="Hybrid quantum-classical stack"
        subtitle="Data flows from the browser through a Flask API into a PennyLane variational circuit, then back as a structured prediction payload."
      />
      <div className="mt-10 space-y-3">
        {ARCHITECTURE_LAYERS.map((l, i) => {
          const Icon = LAYER_ICONS[i] ?? Boxes;
          return (
            <div key={l.layer} className="card p-5 flex items-center gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                <Icon className="h-5 w-5" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display font-semibold text-navy-900">{l.layer}</h3>
                  <span className="chip bg-navy-50 text-navy-600 border border-navy-100">
                    {l.tag}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-navy-600">{l.detail}</p>
              </div>
              <span className="font-mono text-xs text-navy-300 hidden sm:block">
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
          );
        })}
      </div>

      {/* Backend integration note */}
      <div className="mt-6 card p-6 bg-navy-950 text-navy-100">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-600 text-white">
            <Database className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-display font-semibold text-white">Planned backend integration</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-navy-200">
              The frontend is structured to POST an uploaded image to a Python Flask endpoint. The
              server runs a PennyLane variational circuit (PennyLane + PyTorch) that returns a JSON
              payload with the predicted disease, confidence, and recommendations. No database is
              required for this prototype — each request is processed statelessly.
            </p>
            <pre className="mt-4 rounded-xl bg-black/40 p-4 font-mono text-xs overflow-x-auto text-brand-300">
{`POST /api/analyze  (multipart/form-data)
→ { "disease", "confidence", "severity", "treatments": [...] }`}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
