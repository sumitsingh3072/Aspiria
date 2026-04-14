import Navbar from "@/components/landing/Navbar";

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 font-sans transition-colors">
      <Navbar />

      <div className="pt-24 pb-20 container mx-auto px-6 max-w-3xl">
        <p className="text-sm font-semibold text-red-500 dark:text-red-400 mb-4 tracking-widest uppercase">
          Legal
        </p>

        <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white tracking-tight mb-4">
          Cancellation & Refund Policy
        </h1>
        
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-12">
          Effective date: 1 March 2026
        </p>

        <div className="space-y-10 text-zinc-600 dark:text-zinc-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">Overview</h2>
            <p>
              Aspiria believes in fair and transparent billing. We want you to feel confident trying our platform. This policy 
              explains how cancellations and refunds work for our subscription plans and early-access payments.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">Subscription Cancellations</h2>
            <ul className="list-disc pl-5 space-y-4">
              <li>
                You may cancel your subscription at any time from your account settings or by contacting <a href="mailto:billing@aspiria.com" className="text-red-500 dark:text-red-400 hover:underline">billing@aspiria.com</a>.
              </li>
              <li>
                Cancellations take effect at the end of the current billing period. You will retain full access to your plan until then.
              </li>
              <li>
                We do not offer partial refunds for unused days within a billing cycle, unless otherwise required by applicable law.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">14-Day Free Trial</h2>
            <p>
              New accounts on paid plans receive a 14-day free trial. No charge is made until the trial ends. You may cancel 
              any time during the trial without being billed.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">Early-Access & Waitlist Payments</h2>
            <p>
              Early-access subscriptions are eligible for a full refund within <span className="font-bold text-zinc-900 dark:text-white">7 days of payment</span>, provided the platform has 
              not yet been made available to you. Once access is granted, the standard subscription policy applies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">Annual Plans</h2>
            <p>
              Annual subscriptions may be cancelled for a prorated refund within 30 days of the initial purchase or renewal. 
              After 30 days, the remaining balance is non-refundable but access continues until the end of the annual term.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}