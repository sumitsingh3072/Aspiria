import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardPreview from "./DashboardPreview";
import { APP_NAME } from "@/components/ui/logo";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative pt-28 pb-20 text-center overflow-hidden">

      {/* Glow */}
      <div className="absolute inset-0 flex justify-center">
        <div className="w-[800px] h-[800px] bg-red-500/20 blur-[140px] rounded-full" />
      </div>

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[300px] bg-gradient-to-t from-red-500/20 via-red-500/10 to-transparent blur-[120px]" />

      {/* Noise */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}
      />

      <div className="container mx-auto px-6 relative z-10">

        <div className="text-xs px-4 py-1 rounded-full border border-border bg-muted/40 text-red-500 inline-block mb-6">
          Powered by Google API
        </div>

        <h1 className="text-4xl md:text-6xl font-semibold mb-6">
          Start Your Career <br />
          with <span className="text-red-500">Superhuman Insight</span>
        </h1>

        <p className="text-muted-foreground max-w-xl mx-auto mb-8">
          {APP_NAME} analyzes your profile and delivers hyper-personalized career paths.
        </p>

        <div className="flex justify-center gap-3 mb-16">
            <Link to="/auth/register">
          <Button className="bg-red-600 hover:bg-red-700">
            Evaluate My Profile <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          </Link>
          <Button variant="outline">View Demo</Button>
        </div>

        <div className="max-w-5xl mx-auto rounded-xl border bg-background/60 backdrop-blur-xl p-3 shadow-xl">
          <DashboardPreview />
        </div>

      </div>
    </section>
  );
}