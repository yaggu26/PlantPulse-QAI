import { useState, useEffect } from 'react';
import { Leaf, Menu, X } from 'lucide-react';
import type { View } from '@/types';

interface NavbarProps {
  view: View;
  onNavigate: (view: View) => void;
}

const NAV_ITEMS: { id: View; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'analyzer', label: 'Analyzer' },
  { id: 'comparison', label: 'Quantum vs Classical' },
  { id: 'quantum', label: 'Quantum Circuit' },
  { id: 'research', label: 'Research' },
];

export function Navbar({ view, onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (v: View) => {
    onNavigate(v);
    setOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-navy-100 bg-white/85 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <nav className="container-page flex h-16 items-center justify-between">
        <button
          onClick={() => go('home')}
          className="flex items-center gap-2.5 group"
          aria-label="PlantPulse QAI home"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow transition-transform group-hover:scale-105">
            <Leaf className="h-5 w-5" />
          </span>
          <span className="hidden sm:flex flex-col leading-tight text-left">
            <span className="font-display text-sm font-bold text-navy-950">PlantPulse QAI</span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-brand-600">
              Hybrid Quantum ML
            </span>
          </span>
        </button>

        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${
                view === item.id
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-navy-600 hover:bg-navy-50 hover:text-navy-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => go('analyzer')}
          className="hidden md:inline-flex btn-primary !py-2 !px-4"
        >
          Launch Analyzer
        </button>

        <button
          className="md:hidden grid h-10 w-10 place-items-center rounded-lg border border-navy-200 text-navy-700"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-navy-100 bg-white animate-fade-in">
          <div className="container-page py-3 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                className={`rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-all ${
                  view === item.id
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-navy-600 hover:bg-navy-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
