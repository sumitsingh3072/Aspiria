import Navbar from "@/components/landing/Navbar";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 font-sans transition-colors">
      <Navbar />

      <div className="pt-24 pb-20 container mx-auto px-6 max-w-3xl">
        <p className="text-sm font-semibold text-red-500 dark:text-red-400 mb-4 tracking-widest uppercase">
          Legal
        </p>

        <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white tracking-tight mb-4">
          Terms and Conditions
        </h1>
        
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-12">
          Effective date: 1 March 2026
        </p>

        <div className="space-y-10 text-zinc-600 dark:text-zinc-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Aspiria ("Service", "Platform"), operated by Aspiria Technologies Pvt. Ltd. 
              ("Company", "we", "us"), you agree to be bound by these Terms and Conditions. If you do not agree, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">2. Description of Service</h2>
            <p>
              Aspiria is an AI-powered career discovery platform that provides job matching, insights, application automation, 
              and related services. Features may change or be updated at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">3. Account Registration</h2>
            <p>
              You must create an account to use the Service. You are responsible for maintaining the confidentiality of your 
              login credentials and for all activity under your account. You agree to provide accurate, current, and complete 
              information and to update it as necessary. Accounts may not be transferred or shared with third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">4. Acceptable Use</h2>
            <p className="mb-4">You agree not to use the Service to:</p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Publish spam, misleading content, or content that violates applicable laws.</li>
              <li>Violate the terms of service of connected platforms.</li>
              <li>Attempt to reverse-engineer, scrape, or copy any part of the platform.</li>
              <li>Impersonate any person or entity.</li>
              <li>Transmit harmful, offensive, or unlawful content.</li>
            </ul>
            <p>We reserve the right to suspend or terminate accounts that violate these terms without prior notice.</p>
          </section>
        </div>
      </div>
    </div>
  );
}