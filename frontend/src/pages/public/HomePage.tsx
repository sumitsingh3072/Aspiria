import Header from './home/Header';
import HeroSection from './home/HeroSection';
import FeaturesSection from './home/FeaturesSection';
import HowItWorksSection from './home/HowItWorksSection';
import TestimonialsSection from './home/TestimonialsSection';
import CtaSection from './home/CtaSection';
import Footer from './home/Footer';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}