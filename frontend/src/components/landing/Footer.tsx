import { Link } from "react-router-dom";

const SocialIcon = ({ children, href }: { children: React.ReactNode; href: string }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white transition-colors"
  >
    {children}
  </a>
);

export default function Footer() {
  return (
    <footer className="relative bg-white dark:bg-zinc-950 pt-20 pb-10 overflow-hidden font-sans transition-colors border-t border-zinc-100 dark:border-zinc-900">
      <div className="container mx-auto px-6 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 mb-20">
          
          <div className="col-span-1 md:col-span-5 pr-0 md:pr-10">
            <Link to="/" className="flex items-center gap-3 mb-6 w-fit">
              <div className="w-8 h-8 rounded-md bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold text-lg">
                A
              </div>
              <span className="font-bold text-lg tracking-wide text-zinc-900 dark:text-white">Aspiria</span>
            </Link>
            
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6 max-w-sm">
              AI-powered career guidance — understand your path, discover roles, and grow your career from one intelligent platform.
            </p>

            <div className="flex gap-3">
              <SocialIcon href="https://twitter.com">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </SocialIcon>
              <SocialIcon href="https://instagram.com">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </SocialIcon>
              <SocialIcon href="https://linkedin.com">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </SocialIcon>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h4 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 tracking-widest uppercase mb-6">Product</h4>
            <div className="flex flex-col space-y-4">
              <Link to="/features" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors w-fit">Features</Link>
              <Link to="/pricing" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors w-fit">Pricing</Link>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h4 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 tracking-widest uppercase mb-6">Company</h4>
            <div className="flex flex-col space-y-4">
              <Link to="/about" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors w-fit">About</Link>
              <Link to="/contact" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors w-fit">Contact us</Link>
            </div>
          </div>

          <div className="col-span-1 md:col-span-3">
            <h4 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 tracking-widest uppercase mb-6">Legal</h4>
            <div className="flex flex-col space-y-4">
              <Link to="/terms" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors w-fit">Terms and Conditions</Link>
              <Link to="/privacy" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors w-fit">Privacy Policy</Link>
              <Link to="/refund" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors w-fit">Cancellation & Refund Policy</Link>
            </div>
          </div>

        </div>

        

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-500 dark:text-zinc-500">
          <p>© {new Date().getFullYear()} Aspiria. All rights reserved.</p>
          <div className="flex gap-4 md:gap-6">
            <Link to="/terms" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">Terms and Conditions</Link>
            <span className="text-zinc-300 dark:text-zinc-700">·</span>
            <Link to="/privacy" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">Privacy Policy</Link>
            <span className="text-zinc-300 dark:text-zinc-700">·</span>
            <Link to="/refund" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">Cancellation & Refund Policy</Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-[-10%] left-0 w-full overflow-hidden pointer-events-none select-none flex justify-center z-0 ">
        <h1 className="text-[12rem] md:text-[18rem] lg:text-[24rem] font-black tracking-tighter text-zinc-100 dark:text-zinc-900/40 leading-none whitespace-nowrap">
          Aspiria
        </h1>
      </div>
    </footer>
  );
}