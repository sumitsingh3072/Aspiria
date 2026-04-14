import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Logo } from "@/components/ui/logo";

export default function Navbar() {
  return (
    <header className="absolute top-0 left-0 w-full z-50">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-10">
          {/* LOGO → HOME */}
          <Link to="/">
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm text-black/70 dark:text-white/70">
            <Link to="/pricing" className="hover:text-black dark:hover:text-white transition">
              Pricing
            </Link>
            <Link to="/about" className="hover:text-black dark:hover:text-white transition">
              About
            </Link>
            <Link to="/contact" className="hover:text-black dark:hover:text-white transition">
              Contact
            </Link>
          </nav>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          <ModeToggle />

          <Link
            to="/auth/login"
            className="text-sm text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition"
          >
            Sign in
          </Link>

          <Button
            asChild
            size="sm"
            className="rounded-full px-5 bg-red-600 hover:bg-red-700 text-white"
          >
            <Link to="/auth/register">Get Started</Link>
          </Button>
        </div>

      </div>
    </header>
  );
}