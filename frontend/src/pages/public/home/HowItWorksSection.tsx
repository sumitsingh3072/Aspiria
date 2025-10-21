export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 md:py-28">
      <div className="container mx-auto max-w-full px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Get Started in 3 Steps</h2>
          <p className="mt-4 text-lg text-muted-foreground">Your path to career clarity is just a few clicks away.</p>
        </div>

        <div className="relative mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="absolute left-0 top-1/2 hidden h-px w-full -translate-y-1/2 bg-transparent md:block">
            <svg width="100%" height="2" className="overflow-visible">
              <line x1="0" y1="1" x2="100%" y2="1" strokeWidth="2" strokeDasharray="8 8" className="stroke-muted" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary bg-background text-lg font-bold text-primary">1</div>
            <h3 className="text-xl font-semibold">Create Your Profile</h3>
            <p className="mt-2 text-muted-foreground">Sign up and tell us about your education, skills, and interests. The more we know, the better the advice.</p>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary bg-background text-lg font-bold text-primary">2</div>
            <h3 className="text-xl font-semibold">Chat with Your AI Advisor</h3>
            <p className="mt-2 text-muted-foreground">Start a conversation. Ask questions and get instant, personalized recommendations for career paths and projects.</p>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary bg-background text-lg font-bold text-primary">3</div>
            <h3 className="text-xl font-semibold">Build Your Future</h3>
            <p className="mt-2 text-muted-foreground">Follow your custom learning plan, build projects, and connect with real-time internship and job opportunities.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
