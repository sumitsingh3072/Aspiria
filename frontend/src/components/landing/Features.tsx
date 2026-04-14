export default function Features() {
  return (
    <section className="bg-zinc-50 dark:bg-zinc-950 transition-colors py-20 font-sans border-t border-zinc-100 dark:border-zinc-900">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header */}
        <div className="mb-16">
          <p className="text-sm font-semibold text-red-500 dark:text-red-500 mb-4 tracking-widest uppercase">
            Platform Capabilities
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight max-w-2xl">
            Everything you need to navigate your career with confidence.
          </h2>
        </div>

        {/* Feature Grid Container */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm transition-colors">

          {/* ROW 1 */}
          <div className="grid md:grid-cols-2 border-b border-zinc-200 dark:border-zinc-800 transition-colors">

            {/* Feature 1: AI-POWERED CAREER ANALYSIS */}
            <div className="p-10 md:p-12 border-r-0 md:border-r border-b md:border-b-0 border-zinc-200 dark:border-zinc-800 transition-colors flex flex-col group">
              <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-8">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>

              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
                AI-Powered Career Analysis
              </h3>

              <div className="space-y-4 mb-8 flex-1">
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  Aspiria analyzes your current profile, skills, and experience against millions of real-world job postings to identify hidden opportunities and precise skill gaps.
                </p>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  Stop guessing. Get a data-driven understanding of exactly where you stand in the market and the highest-leverage skills you need to learn next.
                </p>
              </div>

              {/* Visual Component */}
              <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 mt-auto transition-colors group-hover:border-orange-500/50">
                <div className="flex justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-3">
                  <span>Current Fit: Product Design</span>
                  <span className="text-orange-600 dark:text-orange-400">82% Match</span>
                </div>
                <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-orange-500 w-[82%] rounded-full" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    <span className="text-xs text-zinc-600 dark:text-zinc-300">Figma & Prototyping</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                    <span className="text-xs text-zinc-600 dark:text-zinc-300">User Research Methods (Gap)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: DYNAMIC ROADMAPS */}
            <div className="p-10 md:p-12 transition-colors flex flex-col group">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-8">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
              </div>

              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
                Dynamic Skill Roadmaps
              </h3>

              <div className="space-y-4 mb-8 flex-1">
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  Generate a structured, week-by-week learning roadmap customized to your specific target role, current skill level, and available timeline.
                </p>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  Whether you are preparing for a career switch in 6 months or an interview loop in 3 weeks, Aspiria builds an actionable plan to keep you focused.
                </p>
              </div>

              {/* Visual Component */}
              <div className="grid grid-cols-4 gap-2 mt-auto">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-12 rounded-lg border flex items-center justify-center text-[10px] font-bold transition-colors ${
                      i < 5 
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40' 
                        : i === 5 
                          ? 'bg-white dark:bg-zinc-950 border-blue-500 dark:border-blue-500 text-zinc-900 dark:text-white shadow-sm ring-1 ring-blue-500'
                          : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-400'
                    }`}
                  >
                    W{i + 1}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ROW 2 */}
          <div className="grid md:grid-cols-2">

            {/* Feature 3: INTERVIEW PREPARATION */}
            <div className="p-10 md:p-12 border-r-0 md:border-r border-b md:border-b-0 border-zinc-200 dark:border-zinc-800 transition-colors flex flex-col group">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center mb-8">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>

              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
                Targeted Interview Prep
              </h3>

              <div className="space-y-4 mb-8 flex-1">
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  Prepare for the exact questions and scenarios you will face. Access a curated database of real interview experiences, technical breakdowns, and behavioral strategies.
                </p>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  From early-stage phone screens to final rounds, learn the patterns of top-tier company interviews and how to effectively demonstrate your competency.
                </p>
              </div>

              {/* Visual Component */}
              <div className="mt-auto bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 transition-colors group-hover:border-green-500/50">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center flex-shrink-0 font-bold text-zinc-900 dark:text-white">
                    G
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">Product Design Interview Loop</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">Google • L4 • Reported 2 weeks ago</p>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded text-[10px] font-semibold">App Critique</span>
                      <span className="px-2 py-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded text-[10px] font-semibold">Whiteboarding</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 4: AUTOMATED APPLICATION TRACKING */}
            <div className="p-10 md:p-12 transition-colors flex flex-col group">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-8">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
              </div>

              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
                Smart Application Tracking
              </h3>

              <div className="space-y-4 mb-8 flex-1">
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  Replace chaotic spreadsheets with an intelligent pipeline. Track every application, upcoming interview, and necessary follow-up in one centralized workspace.
                </p>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  Aspiria's AI automatically extracts details from job descriptions, suggests customized resume tweaks, and reminds you when it's time to reach out to recruiters.
                </p>
              </div>

              {/* Visual Component */}
              <div className="mt-auto space-y-3">
                <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    <span className="text-xs font-semibold text-zinc-900 dark:text-white">Spotify</span>
                  </div>
                  <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded">Screening</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg transition-colors opacity-70">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-zinc-400" />
                    <span className="text-xs font-semibold text-zinc-900 dark:text-white">Airbnb</span>
                  </div>
                  <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded">Applied</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}