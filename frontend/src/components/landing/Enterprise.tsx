import { Link } from "react-router-dom";

export default function Enterprise() {
  return (
    <section className="py-24 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 relative overflow-hidden font-sans transition-colors">

      {/* Glow Effect */}
      <div className="absolute inset-0 flex justify-center pointer-events-none">
        <div className="w-[800px] h-[400px] bg-red-500/10 dark:bg-red-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 max-w-6xl relative z-10 grid md:grid-cols-2 gap-16 items-center">

        {/* LEFT CONTENT */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight mb-4">
            Built for scale, designed for precision
          </h2>

          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8">
            Aspiria leverages large-scale job market data and advanced AI models to provide highly accurate career insights. Stop guessing and start making informed, data-driven decisions about your future.
          </p>

          <div className="flex items-center gap-6">
            <button className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors shadow-sm shadow-red-500/20">
              Explore Features
            </button>

            <Link
              to="/features"
              className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-1"
            >
              Learn more
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </div>

        {/* RIGHT GRID */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10">

          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-5">
            <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center mb-4">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-2">AI-driven insights</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Actionable feedback derived from millions of successful career trajectories.
            </p>
          </div>

          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-5">
            <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center mb-4">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-2">Real-time matching</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Instantly compare your profile against active job market requirements.
            </p>
          </div>

          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-5">
            <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center mb-4">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-2">Skill gap analysis</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Pinpoint exactly which frameworks and concepts you need to learn next.
            </p>
          </div>

          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-5">
            <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center mb-4">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
            </div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-2">Adaptive roadmaps</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Get a custom week-by-week curriculum tailored to your specific timeline.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}