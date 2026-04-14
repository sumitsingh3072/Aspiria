import Navbar from "@/components/landing/Navbar";

export default function AboutPage() {
  const values = [
    {
      title: "Transparency",
      description: "No black-box algorithms. You see exactly what our agents do and why — every suggestion, every insight."
    },
    {
      title: "Creator-first",
      description: "Built for the people doing the work: solopreneurs, agencies, startup marketing teams, and everything in between."
    },
    {
      title: "Privacy by design",
      description: "We prioritize your data security and ensure that your personal information is always protected."
    },
    {
      title: "Relentless improvement",
      description: "We are constantly iterating and improving our models to provide the best possible experience."
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 font-sans transition-colors">
      <Navbar />

      <div className="pt-24 pb-20 container mx-auto px-6 max-w-4xl">
        
        <p className="text-sm font-semibold text-red-500 dark:text-red-400 mb-4 tracking-widest uppercase">
          About Us
        </p>

        <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white tracking-tight mb-6 leading-tight">
          We're building the AI operating system for careers.
        </h1>

        <p className="text-lg text-zinc-600 dark:text-zinc-300 mb-10 leading-relaxed max-w-3xl">
          Aspiria helps you understand your career path with clarity.
          Instead of guessing what to learn next, we give you precise,
          data-driven insights.
        </p>

        <div className="w-full h-px bg-zinc-100 dark:bg-zinc-800 my-10" />

        <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight mb-4">
          Our Mission
        </h2>

        <p className="text-lg text-zinc-600 dark:text-zinc-300 mb-10 leading-relaxed max-w-3xl">
          To empower every student and professional with personalized,
          AI-driven career guidance.
        </p>

        <div className="w-full h-px bg-zinc-100 dark:bg-zinc-800 my-10" />

        <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight mb-8">
          What We Stand For
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {values.map((item) => (
            <div key={item.title} className="p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-transparent dark:border-zinc-800">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-3">{item.title}</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}