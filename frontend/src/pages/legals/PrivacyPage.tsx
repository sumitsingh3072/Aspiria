import Navbar from "@/components/landing/Navbar";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 font-sans transition-colors">
      <Navbar />

      <div className="pt-24 pb-20 container mx-auto px-6 max-w-3xl">
        <p className="text-sm font-semibold text-red-500 dark:text-red-400 mb-4 tracking-widest uppercase">
          Legal
        </p>

        <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white tracking-tight mb-4">
          Privacy Policy
        </h1>
        
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-12">
          Effective date: 1 March 2026
        </p>

        <div className="space-y-10 text-zinc-600 dark:text-zinc-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">1. Information We Collect</h2>
            <p className="mb-4">We collect information you provide directly:</p>
            <ul className="list-disc pl-5 space-y-2 mb-6">
              <li>Account registration data (name, email, password).</li>
              <li>Professional profile data and resume uploads.</li>
              <li>Content you create, schedule, or publish through the platform.</li>
              <li>Payment information (processed securely by Stripe; we do not store card data).</li>
            </ul>
            
            <p className="mb-4">We also collect data automatically:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Usage data and feature interaction logs.</li>
              <li>Device and browser information.</li>
              <li>IP address and approximate location.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-2 mb-6">
              <li>To operate, maintain, and improve the Aspiria platform.</li>
              <li>To authenticate your identity and manage your subscription.</li>
              <li>To deliver AI-generated career suggestions and matching features.</li>
              <li>To send transactional emails and product updates (opt-out available).</li>
              <li>To detect fraud, abuse, or security incidents.</li>
            </ul>
            <p className="font-medium text-zinc-900 dark:text-white">
              We never use your content or data to train third-party AI models, and we never sell your data to advertisers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">3. Data Sharing</h2>
            <p>
              We share data only as necessary to deliver the Service: with infrastructure providers (hosting, storage), 
              payment processors (Stripe), and analytics tools (under strict data processing agreements). We may share data 
              if required by law or to protect our legal rights.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}