import { Atom, Activity, GitBranch, Layers, Zap } from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { CIRCUIT_GATES } from '@/data/demoData';

const QUBITS = 3;

const GATE_COLORS: Record<string, string> = {
  H: 'fill-brand-500',
  RY: 'fill-navy-500',
  CNOT: 'fill-navy-900',
  M: 'fill-amber-500',
  I: 'fill-navy-200',
};

export function QuantumCircuit() {
  const wireY = (q: number) => 60 + q * 70;
  const colX = [120, 200, 280, 360, 440, 520, 620, 700];

  const activeGates = CIRCUIT_GATES.slice(0, 8);

  return (
    <div className="animate-fade-in">
      <section className="container-page pt-12 pb-6">
        <SectionHeading
          eyebrow="Quantum Circuit Visualization"
          title="How quantum feature processing works"
          subtitle="A variational quantum circuit encodes leaf-image features as qubit rotations, entangles them, and measures expectation values that feed the classical classifier."
        />
        <p className="mt-4 text-xs font-medium text-brand-700 bg-brand-50 inline-flex items-center gap-1.5 rounded-full px-3 py-1 border border-brand-100">
          <Atom className="h-3.5 w-3.5" />
          Illustrative 3-qubit variational ansatz for demonstration.
        </p>
      </section>

      <section className="container-page pb-8">
        <div className="card p-6 sm:p-8 overflow-x-auto">
          <div className="min-w-[760px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-navy-950 text-brand-400">
                  <Atom className="h-4 w-4" />
                </span>
                <span className="font-display font-semibold text-navy-900">
                  Variational Feature Map
                </span>
              </div>
              <span className="font-mono text-[11px] text-navy-400">dev = qml.device('default.qubit', wires=3)</span>
            </div>

            <svg viewBox="0 0 780 260" className="w-full">
              {/* Wires */}
              {Array.from({ length: QUBITS }).map((_, q) => (
                <g key={q}>
                  <line
                    x1="60"
                    y1={wireY(q)}
                    x2="760"
                    y2={wireY(q)}
                    stroke="#c5d3e6"
                    strokeWidth="2"
                  />
                  <text x="44" y={wireY(q) + 5} textAnchor="end" className="fill-navy-700 font-mono text-[12px] font-semibold">
                    q[{q}]
                  </text>
                  <text x="752" y={wireY(q) + 5} textAnchor="end" className="fill-navy-400 font-mono text-[10px]">
                    ⟨Z⟩
                  </text>
                </g>
              ))}

              {/* Gates */}
              {activeGates.map((gate, i) => {
                const x = colX[i] ?? 120 + i * 80;
                const y = wireY(gate.qubit);
                if (gate.type === 'CNOT') {
                  const targetQ = gate.qubit + 1;
                  const ty = wireY(targetQ);
                  return (
                    <g key={gate.id} className="cursor-pointer">
                      <line x1={x} y1={y} x2={x} y2={ty} stroke="#1d2b42" strokeWidth="2" />
                      <circle cx={x} cy={y} r="6" className="fill-navy-900" />
                      <circle cx={x} cy={ty} r="11" fill="white" stroke="#1d2b42" strokeWidth="2" />
                  <line x1={x - 11} y1={ty} x2={x + 11} y2={ty} stroke="#1d2b42" strokeWidth="2" />
                  <line x1={x} y1={ty - 11} x2={x} y2={ty + 11} stroke="#1d2b42" strokeWidth="2" />
                    </g>
                  );
                }
                if (gate.type === 'M') {
                  return (
                    <g key={gate.id}>
                      <rect x={x - 18} y={y - 14} width="36" height="28" rx="6" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
                      <text x={x} y={y + 5} textAnchor="middle" className="fill-amber-700 font-mono text-[11px] font-semibold">
                        {gate.label}
                      </text>
                    </g>
                  );
                }
                return (
                  <g key={gate.id}>
                    <rect
                      x={x - 20}
                      y={y - 16}
                      width="40"
                      height="32"
                      rx="7"
                      className={GATE_COLORS[gate.type]}
                    />
                    <text
                      x={x}
                      y={y + 4}
                      textAnchor="middle"
                      className="fill-white font-mono text-[11px] font-semibold"
                    >
                      {gate.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Gate legend */}
            <div className="mt-4 flex flex-wrap gap-3">
              {[
                { l: 'Hadamard (H)', c: 'bg-brand-500' },
                { l: 'Rotation (Ry)', c: 'bg-navy-500' },
                { l: 'Entangle (CNOT)', c: 'bg-navy-900' },
                { l: 'Measure (M)', c: 'bg-amber-500' },
              ].map((g) => (
                <span key={g.l} className="inline-flex items-center gap-2 text-xs text-navy-600">
                  <span className={`h-3 w-3 rounded ${g.c}`} />
                  {g.l}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gate explanations */}
      <section className="container-page pb-6">
        <h3 className="font-display text-lg font-semibold text-navy-900 mb-4">
          Step-by-step circuit walk-through
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {activeGates.map((g, i) => (
            <div key={g.id} className="card p-4 flex gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-navy-950 font-mono text-xs font-semibold text-brand-400">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-navy-900">
                  {g.label} <span className="font-normal text-navy-400">on q[{g.qubit}]</span>
                </p>
                <p className="text-xs text-navy-600 mt-0.5 leading-relaxed">{g.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Concept cards */}
      <section className="container-page pb-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Layers,
              title: 'Superposition',
              body: 'Hadamard gates place qubits in a superposition of 0 and 1, letting the circuit represent many feature configurations at once.',
            },
            {
              icon: GitBranch,
              title: 'Entanglement',
              body: 'CNOT gates correlate qubits so measuring one instantly informs the others — the resource classical models cannot access.',
            },
            {
              icon: Zap,
              title: 'Interference',
              body: 'Parameterized rotations amplify correct prediction amplitudes while canceling wrong ones, shaping the final distribution.',
            },
            {
              icon: Activity,
              title: 'Measurement',
              body: 'Qubits collapse to classical bit strings whose expectation values become features for the classical dense classifier.',
            },
          ].map((c) => (
            <div key={c.title} className="card p-5 h-full">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-700">
                <c.icon className="h-5 w-5" />
              </span>
              <h4 className="mt-3 font-display font-semibold text-navy-900">{c.title}</h4>
              <p className="mt-1.5 text-sm leading-relaxed text-navy-600">{c.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
