import Navbar from "@/components/landing/Navbar";

export default function ContactPage() {
  const contactMethods = [
    {
      title: "General & Support",
      email: "support@aspiria.com",
      description: "For product questions, account help, and general inquiries."
    },
    {
      title: "Partnerships & Press",
      email: "partners@aspiria.com",
      description: "Collaboration opportunities, integrations, and media enquiries."
    },
    {
      title: "Billing & Payments",
      email: "billing@aspiria.com",
      description: "Subscription changes, invoices, refunds, and payment issues."
    },
    {
      title: "Legal",
      email: "legal@aspiria.com",
      description: "Data requests, compliance queries, and legal notices."
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 font-sans transition-colors">
      <Navbar />

      <div className="pt-24 pb-20 container mx-auto px-6 max-w-4xl">

        <p className="text-sm font-semibold text-red-500 dark:text-red-400 mb-4 tracking-widest uppercase">
          Contact Us
        </p>

        <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white tracking-tight mb-6 leading-tight">
          We're here to help.
        </h1>

        <p className="text-lg text-zinc-600 dark:text-zinc-300 mb-12 leading-relaxed max-w-3xl">
          Whether you have a billing question, need technical support, want to explore a partnership, or just want to share feedback — we respond fast. Typically within one business day.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {contactMethods.map((item) => (
            <div key={item.title} className="p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-transparent dark:border-zinc-800">
              <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 mb-2 tracking-widest uppercase">
                {item.title}
              </p>
              <a href={`mailto:${item.email}`} className="text-red-500 dark:text-red-400 font-medium mb-3 block hover:underline w-fit">
                {item.email}
              </a>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="w-full h-px bg-zinc-100 dark:bg-zinc-800 my-12" />

        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight mb-6">
          Response Times
        </h2>

        <div className="space-y-3 text-zinc-600 dark:text-zinc-300">
          <p><span className="font-semibold text-zinc-900 dark:text-white">General queries:</span> within 1 business day</p>
          <p><span className="font-semibold text-zinc-900 dark:text-white">Billing & refunds:</span> within 24 hours</p>
          <p><span className="font-semibold text-zinc-900 dark:text-white">Critical account issues:</span> within 4 hours (during business hours)</p>
        </div>

      </div>
    </div>
  );
}