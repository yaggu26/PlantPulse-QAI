import { Methodology, Architecture, Objectives } from '@/components/ResearchParts';
import { SectionHeading } from '@/components/SectionHeading';

export function Research() {
  return (
    <div className="animate-fade-in space-y-16 pb-16">
      <section className="container-page pt-12">
        <SectionHeading
          eyebrow="Research & Methodology"
          title="Project methodology, architecture & objectives"
          subtitle="The academic foundation behind PlantPulse QAI — designed for demonstration to evaluators and research officials."
        />
      </section>

      <Objectives />
      <Methodology />
      <Architecture />
    </div>
  );
}
