import FeatureCard from './FeatureCard';
import { Bot, Target, LineChart } from 'lucide-react';

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-muted/40 py-20 md:py-28">
      <div className="container mx-auto max-w-full px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Personalized Guidance at Scale</h2>
          <p className="mt-4 text-lg text-muted-foreground">Stop guessing. Start building a career based on data-driven insights tailored just for you.</p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={Bot}
            title="Personalized AI Advisor"
            description="Chat 24/7 with your AI mentor. Get answers to career questions, resume tips, and interview prep, all based on your unique profile."
          />
          <FeatureCard
            icon={Target}
            title="Skill Gap Analysis"
            description="We identify the exact skills you need for your dream job and provide a clear learning plan with links to relevant courses and projects."
          />
          <FeatureCard
            icon={LineChart}
            title="Real-Time Market Data"
            description="Our AI continuously ingests data from live job postings, ensuring your career advice is always up-to-date with current market demands."
          />
        </div>
      </div>
    </section>
  );
}
