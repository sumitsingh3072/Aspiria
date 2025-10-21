import { GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto flex max-w-full flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row md:px-6">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          <span className="text-base font-semibold">Aspiria</span>
        </div>

        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Aspiria. All rights reserved.</p>

        <nav className="flex gap-4">
          <Link to="#" className="text-sm text-muted-foreground hover:text-primary">Terms</Link>
          <Link to="#" className="text-sm text-muted-foreground hover:text-primary">Privacy</Link>
        </nav>
      </div>
    </footer>
  );
}
