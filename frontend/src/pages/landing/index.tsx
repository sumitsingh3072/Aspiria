import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Enterprise from "@/components/landing/Enterprise";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="bg-background text-foreground">
      <Navbar />
      <Hero />
      <Features />
      <Enterprise />
      <Footer />
    </div>
  );
}