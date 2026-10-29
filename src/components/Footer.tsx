import { Leaf, Github, Mail, BookOpen } from 'lucide-react';

export function Footer() {
return ( <footer className="border-t border-navy-100 bg-navy-950 text-navy-200"> <div className="container-page py-12"> <div className="grid gap-10 md:grid-cols-3"> <div> <div className="flex items-center gap-2.5"> <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white"> <Leaf className="h-5 w-5" /> </span> <div> <p className="font-display text-sm font-bold text-white">
PlantPulse QAI </p> <p className="text-[11px] uppercase tracking-wider text-brand-400">
Hybrid Quantum-Classical ML </p> </div> </div>


        <p className="mt-4 text-sm leading-relaxed text-navy-300">
          A research framework exploring quantum-enhanced feature maps
          for plant disease classification, paired with classical
          machine learning for plant disease analysis.
        </p>
      </div>

      <div>
        <p className="text-sm font-semibold text-white">Project Context</p>
        <ul className="mt-3 space-y-2 text-sm text-navy-300">
          <li>Final-year engineering capstone</li>
          <li>Quantum Machine Learning</li>
          <li>PennyLane quantum circuit</li>
          <li>Classical SVM comparison</li>
        </ul>
      </div>

      <div>
        <p className="text-sm font-semibold text-white">Project Resources</p>
        <p className="mt-3 text-sm leading-relaxed text-navy-300">
          Exploring classical and quantum-feature approaches
          for plant disease classification.
        </p>

        <div className="mt-4 flex gap-3">
          <a
            href="#"
            className="grid h-9 w-9 place-items-center rounded-lg bg-navy-800 text-navy-200 hover:text-brand-400 transition-colors"
            aria-label="GitHub repository"
          >
            <Github className="h-4 w-4" />
          </a>

          <a
            href="#"
            className="grid h-9 w-9 place-items-center rounded-lg bg-navy-800 text-navy-200 hover:text-brand-400 transition-colors"
            aria-label="Email"
          >
            <Mail className="h-4 w-4" />
          </a>

          <a
            href="#"
            className="grid h-9 w-9 place-items-center rounded-lg bg-navy-800 text-navy-200 hover:text-brand-400 transition-colors"
            aria-label="Documentation"
          >
            <BookOpen className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>

    <div className="mt-10 border-t border-navy-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className="text-xs text-navy-400">
        © {new Date().getFullYear()} PlantPulse QAI. Academic research prototype.
      </p>

      <p className="text-xs text-navy-400">
        React · Tailwind CSS · Flask · PennyLane
      </p>
    </div>
  </div>
</footer>

);
}
