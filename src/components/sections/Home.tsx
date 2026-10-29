import {
  Leaf,
  Atom,
  Cpu,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  GitBranch,
  Gauge,
} from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { RESEARCH_OBJECTIVES } from '@/data/demoData';
import type { View } from '@/types';

interface HomeProps {
  onNavigate: (v: View) => void;
}

const ICONS: Record<string, typeof Leaf> = {
  Target: ShieldCheck,
  FlaskConical: Atom,
  Atom: Atom,
  Sprout: Leaf,
};

export function Home({ onNavigate }: HomeProps) {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl" />
          <div className="absolute top-40 -left-24 h-80 w-80 rounded-full bg-navy-200/40 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, #1d2b42 1px, transparent 0)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        <div className="container-page pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="animate-fade-up">
              <span className="chip bg-brand-50 text-brand-700 border border-brand-100">
                <Sparkles className="h-3.5 w-3.5" />
                Hybrid Quantum-Classical ML Framework
              </span>
              <h1 className="heading mt-5 text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.08]">
                Detecting plant disease with{' '}
                <span className="bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
                  quantum-enhanced
                </span>{' '}
                machine learning
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-navy-600 max-w-xl">
                PlantPulse QAI combines variational quantum circuits with classical classifiers to
                screen leaf images for disease. Upload a photo and receive a prediction, confidence
                score, and treatment plan.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={() => onNavigate('analyzer')} className="btn-primary">
                  Analyze a Leaf
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button onClick={() => onNavigate('comparison')} className="btn-ghost">
                  Compare Models
                </button>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
                {[
                  { v: '94.2%', l: 'Hybrid accuracy' },
                  { v: '4', l: 'Qubits' },
                  { v: '38', l: 'Disease classes' },
                ].map((s) => (
                  <div key={s.l}>
                    <p className="font-display text-2xl font-bold text-navy-950">{s.v}</p>
                    <p className="text-xs text-navy-500 mt-0.5">{s.l}</p>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-navy-400">Sample metrics for UI demonstration</p>
            </div>

            {/* Hero visual */}
            <div className="relative animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <div className="relative card p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                    <span className="h-3 w-3 rounded-full bg-brand-400" />
                  </div>
                  <span className="font-mono text-[11px] text-navy-400">
                    pennylane_circuit.png
                  </span>
                </div>

                <div className="mt-5 rounded-xl bg-navy-950 p-5 font-mono text-xs leading-relaxed">
                  <div className="text-navy-300"># Variational quantum feature map</div>
                  <div className="mt-2 text-brand-300">
                    @qml.qnode(dev)
                  </div>
                  <div className="text-white">
                    def <span className="text-brand-400">circuit</span>(features, weights):
                  </div>
                  <div className="pl-4 text-navy-200">
                    qml.AngleEmbedding(features, wires=range(4))
                  </div>
                  <div className="pl-4 text-navy-200">
                    qml.BasicEntanglerLayers(weights, wires=range(4))
                  </div>
                  <div className="pl-4 text-brand-300">
                    return [qml.expval(qml.PauliZ(i)) for i in range(4)]
                  </div>
                </div>

                {/* Floating chips */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {['Superposition', 'Entanglement', 'Interference', 'Measurement'].map((t, i) => (
                    <span
                      key={t}
                      className="chip bg-navy-50 text-navy-700 border border-navy-100 animate-float"
                      style={{ animationDelay: `${i * 0.6}s` }}
                    >
                      <Atom className="h-3 w-3 text-brand-600" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="absolute -bottom-5 -left-5 hidden sm:flex items-center gap-2 rounded-xl border border-navy-100 bg-white px-4 py-3 shadow-card animate-float">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-100 text-brand-700">
                  <Gauge className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-navy-900">Inference latency</p>
                  <p className="text-[11px] text-navy-500">1.84s · hybrid pipeline</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container-page py-16 sm:py-20">
        <SectionHeading
          center
          eyebrow="How it works"
          title="From leaf photo to quantum-encoded diagnosis"
          subtitle="A hybrid pipeline fuses quantum feature maps with classical inference to classify plant disease from leaf images."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Leaf,
              step: '01',
              title: 'Image capture',
              body: 'Agronomist uploads a leaf photo through the drag-and-drop analyzer. The image is validated and previewed locally.',
            },
            {
              icon: Cpu,
              step: '02',
              title: 'Quantum feature map',
              body: 'A frozen encoder compresses the image into feature embeddings, then encoded as rotation angles on qubits via PennyLane.',
            },
            {
              icon: ShieldCheck,
              step: '03',
              title: 'Diagnosis & guidance',
              body: 'Measured quantum expectation values feed a classical dense classifier returning disease, confidence, and treatment.',
            },
          ].map((s) => (
            <div key={s.step} className="card p-6 hover:shadow-glow transition-shadow">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-700">
                  <s.icon className="h-5 w-5" />
                </span>
                <span className="font-mono text-xs font-semibold text-navy-300">
                  {s.step}
                </span>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-navy-900">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-600">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Objectives */}
      <section className="bg-white border-y border-navy-100 py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Research objectives"
            title="What this framework sets out to prove"
            subtitle="Four goals define the scope of the PlantPulse QAI study."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {RESEARCH_OBJECTIVES.map((o) => {
              const Icon = ICONS[o.icon] ?? Atom;
              return (
                <div key={o.title} className="card p-6 h-full hover:-translate-y-1 transition-transform">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy-950 text-brand-400">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-semibold text-navy-900">
                    {o.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-600">{o.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page py-16 sm:py-20">
        <div className="relative overflow-hidden rounded-3xl bg-navy-950 p-8 sm:p-12">
          <div className="absolute -top-20 -right-10 h-72 w-72 rounded-full bg-brand-700/30 blur-3xl" />
          <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-navy-700/40 blur-3xl" />
          <div className="relative grid items-center gap-8 md:grid-cols-2">
            <div>
              <span className="chip bg-white/10 text-brand-300 border border-white/10">
                <GitBranch className="h-3.5 w-3.5" />
                Ready for live backend
              </span>
              <h2 className="heading mt-4 text-2xl sm:text-3xl text-white">
                Try the analyzer with a sample leaf image
              </h2>
              <p className="mt-3 text-navy-200 leading-relaxed">
                The interface is wired to accept a Python Flask + PennyLane backend. In this demo it
                returns illustrative results so you can explore the full diagnostic flow.
              </p>
              <button
                onClick={() => onNavigate('analyzer')}
                className="btn-primary mt-6"
              >
                Open the Analyzer
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-3">
              {[
                'Drag-and-drop image upload with preview',
                'Prediction, confidence & treatment plan',
                'Quantum vs classical benchmark dashboard',
                'Interactive variational circuit visualization',
              ].map((f) => (
                <div key={f} className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 border border-white/10">
                  <ShieldCheck className="h-4 w-4 text-brand-400 shrink-0" />
                  <span className="text-sm text-navy-100">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
