import Navbar from "@/components/landing/Navbar";

const CheckIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-red-500 mt-1 flex-shrink-0">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 font-sans transition-colors">
      <Navbar />

      <div className="pt-24 pb-20 container mx-auto px-6 text-center">

        <p className="text-sm font-semibold text-red-500 dark:text-red-400 mb-4 tracking-widest uppercase">
          Pricing
        </p>

        <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white tracking-tight mb-4">
          Honest pricing. No hidden fees.
        </h1>

        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-16 max-w-2xl mx-auto leading-relaxed">
          SocioVeil is currently in early access. Lock in founding-member rates<br className="hidden md:block"/> before we launch publicly.
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

          {/* Starter */}
          <div className="p-8 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-left flex flex-col relative transition-colors">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Starter</h3>
            <div className="mb-4">
              <span className="text-4xl font-bold text-zinc-900 dark:text-white">$29</span>
              <span className="text-zinc-500 dark:text-zinc-400 font-medium ml-1">/month</span>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed min-h-[60px]">
              Perfect for solopreneurs and individual creators managing a personal brand.
            </p>
            
            <ul className="space-y-4 mb-8 flex-1">
              {["3 social media accounts", "AI content drafting (50 posts/mo)", "Smart scheduling & queue", "Basic analytics dashboard", "Email support"].map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300 font-medium">
                  <CheckIcon />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button className="w-full py-3 px-4 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-xl font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
              Join Waitlist
            </button>
          </div>

          {/* Growth */}
          <div className="p-8 rounded-[2rem] border-2 border-red-500 bg-white dark:bg-zinc-900/50 text-left flex flex-col relative shadow-xl shadow-red-500/5">
            <div className="absolute -top-3.5 left-1/2 -tranzinc-x-1/2 bg-red-500 text-white text-sm font-semibold px-4 py-1 rounded-full shadow-sm">
              Most popular
            </div>

            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Growth</h3>
            <div className="mb-4">
              <span className="text-4xl font-bold text-zinc-900 dark:text-white">$79</span>
              <span className="text-zinc-500 dark:text-zinc-400 font-medium ml-1">/month</span>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed min-h-[60px]">
              For growing brands and small teams that need more firepower and collaboration.
            </p>
            
            <ul className="space-y-4 mb-8 flex-1">
              {["10 social media accounts", "Unlimited AI content drafting", "Multi-platform scheduling", "Advanced analytics & reporting", "AI auto-reply & DM management", "3 team seats", "Priority support"].map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300 font-medium">
                  <CheckIcon />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button className="w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors shadow-sm">
              Get Early Access
            </button>
          </div>

          {/* Agency */}
          <div className="p-8 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-left flex flex-col relative transition-colors">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Agency</h3>
            <div className="mb-4">
              <span className="text-4xl font-bold text-zinc-900 dark:text-white">Custom</span>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed min-h-[60px]">
              For agencies managing multiple clients with custom workflows and white-labelling.
            </p>
            
            <ul className="space-y-4 mb-8 flex-1">
              {["Unlimited accounts & clients", "White-label reports", "Custom AI agent training", "Dedicated account manager", "SLA & uptime guarantee", "SSO & advanced permissions"].map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300 font-medium">
                  <CheckIcon />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button className="w-full py-3 px-4 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-xl font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
              Contact Sales
            </button>
          </div>

        </div>

        <p className="mt-12 text-sm text-zinc-500 dark:text-zinc-400">
          All plans include a 14-day free trial. No credit card required to join the waitlist.{' '}
          <a href="#" className="underline hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
            Cancellation & refund policy &rarr;
          </a>
        </p>

      </div>
    </div>
  );
}