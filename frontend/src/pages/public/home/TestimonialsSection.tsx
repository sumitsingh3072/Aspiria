import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-muted/40 py-20 md:py-28">
      <div className="container mx-auto max-w-full px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Don't just take our word for it</h2>
          <p className="mt-4 text-lg text-muted-foreground">See how students and young professionals are finding clarity.</p>
        </div>

        <div className="mx-auto mt-16 grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
          <Card className="glass glass-soft">
            <CardContent className="pt-6">
              <p className="text-base italic">"Aspiria was a game-changer. I was lost between data science and web development. The AI analyzed my projects and interests and laid out a clear path to becoming a Full-Stack AI Engineer, a role I didn't even know existed."</p>
              <div className="mt-6 flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="@aarav" />
                  <AvatarFallback>AS</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">Aarav Sharma</p>
                  <p className="text-sm text-muted-foreground">B.Tech Student</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass glass-soft">
            <CardContent className="pt-6">
              <p className="text-base italic">"As a recent graduate, the job market felt overwhelming. Aspiria's real-time job integration found me internships I was actually qualified for and helped me tailor my resume for each one. I landed an internship in 3 weeks."</p>
              <div className="mt-6 flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="https://github.com/vercel.png" alt="@priya" />
                  <AvatarFallback>PR</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">Priya Reddy</p>
                  <p className="text-sm text-muted-foreground">Recent Graduate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
