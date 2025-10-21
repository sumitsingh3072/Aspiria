import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function CtaSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto max-w-full px-4 md:px-6">
  <div className="mx-auto w-full max-w-3xl rounded-lg bg-primary/10 p-10 text-center glass glass-soft">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to Chart Your Career Path?</h2>
          <p className="mt-4 text-lg text-muted-foreground">Stop wondering what's next. Sign up today and get your free, personalized career plan from Aspiria.</p>
          <Button size="lg" className="mt-8" asChild>
            <Link to="/register">Get Started for Free</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
