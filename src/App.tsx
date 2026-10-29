import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { DemoBanner } from '@/components/DemoBanner';
import { Home } from '@/components/sections/Home';
import { Analyzer } from '@/components/sections/Analyzer';
import { Comparison } from '@/components/sections/Comparison';
import { QuantumCircuit } from '@/components/sections/QuantumCircuit';
import { Research } from '@/components/sections/Research';
import type { View } from '@/types';

export default function App() {
  const [view, setView] = useState<View>('home');

  return (
    <div className="min-h-screen flex flex-col bg-navy-50">
      <DemoBanner />
      <Navbar view={view} onNavigate={setView} />

      <main className="flex-1">
        {view === 'home' && <Home onNavigate={setView} />}
        {view === 'analyzer' && <Analyzer />}
        {view === 'comparison' && <Comparison />}
        {view === 'quantum' && <QuantumCircuit />}
        {view === 'research' && <Research />}
      </main>

      <Footer />
    </div>
  );
}
