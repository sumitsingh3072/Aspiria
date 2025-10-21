import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  return (
    <section className="container mx-auto max-w-full px-4 py-20 text-center md:px-6 md:py-32">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Find Your Future, Faster.</h1>
        <p className="mt-6 text-lg text-muted-foreground md:text-xl">
          Aspiria is your personal AI career advisor. We analyze your unique skills and interests to
          create a personalized career map, complete with skill gap analysis and real-time job
          market data.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Button size="lg" asChild>
            <Link to="/register">Get Your Free Career Plan</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="#features">Learn More</a>
          </Button>
        </div>
      </div>

      <div className="mx-auto mt-16 w-full max-w-4xl px-4">
  <div className="aspect-video w-full rounded-xl border bg-muted p-4 shadow-lg glass glass-glossy">
          <p className="text-muted-foreground"></p>
        </div>
      </div>
    </section>
  );
}
