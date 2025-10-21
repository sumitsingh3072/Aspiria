import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap } from 'lucide-react';
import { useState } from 'react';
import { ModeToggle } from '@/components/mode-toggle';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Testimonials', href: '#testimonials' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-full items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Aspiria</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              {link.name}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" asChild>
            <Link to="/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link to="/register">Get Started Free</Link>
          </Button>
          <ModeToggle />
        </div>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute top-16 z-40 w-full animate-in fade-in-20 slide-in-from-top-4 border-b bg-background p-4 shadow-md md:hidden">
          <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} className="text-base font-medium text-muted-foreground hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                  {link.name}
                </a>
              ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2 border-t pt-4">
            <Button variant="ghost" asChild className="w-full justify-start">
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild className="w-full">
              <Link to="/register">Get Started Free</Link>
            </Button>
            <div className="mt-2 flex items-center justify-start">
              <ModeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
