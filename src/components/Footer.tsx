import Link from "next/link";
import { GraduationCap, ShieldCheck, Cpu } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#09090b] text-zinc-400 border-t border-zinc-850/80 mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 text-zinc-100">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-200">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-bold text-base tracking-tight">
                EduPlatform
              </span>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed">
              High-yield engineering curricula for modern developers. Production architecture, vision models, and verified credentials.
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              <a 
                href="https://github.com/islamrakibul9274/edu-platform" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Catalog Links */}
          <div className="space-y-3">
            <h4 className="mono-tag text-zinc-300">Curricula</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/courses" className="hover:text-zinc-200 transition-colors">Next.js 16 Full-Stack</Link></li>
              <li><Link href="/courses" className="hover:text-zinc-200 transition-colors">Complete YOLO Masterclass</Link></li>
              <li><Link href="/courses" className="hover:text-zinc-200 transition-colors">Python Data Science</Link></li>
              <li><Link href="/courses" className="hover:text-zinc-200 transition-colors">Kubernetes Cloud Native</Link></li>
            </ul>
          </div>

          {/* Platform */}
          <div className="space-y-3">
            <h4 className="mono-tag text-zinc-300">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/dashboard" className="hover:text-zinc-200 transition-colors">Student Dashboard</Link></li>
              <li><Link href="/courses" className="hover:text-zinc-200 transition-colors">Course Catalog</Link></li>
              <li><Link href="/login" className="hover:text-zinc-200 transition-colors">Sign In</Link></li>
              <li><Link href="/register" className="hover:text-zinc-200 transition-colors">Create Account</Link></li>
            </ul>
          </div>

          {/* Infrastructure */}
          <div className="space-y-3">
            <h4 className="mono-tag text-zinc-300">Status & Telemetry</h4>
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2.5 font-mono text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">EDGE_STATUS</span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> 200 OK
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">HOST</span>
                <span className="text-zinc-300">Vercel Production</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">STORE</span>
                <span className="text-zinc-300">MongoDB Atlas</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
          <p suppressHydrationWarning>© {new Date().getFullYear()} EduPlatform. All rights reserved.</p>
          <div className="flex items-center gap-4 text-zinc-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" /> AES-256
            </span>
            <span className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-zinc-400" /> Turbopack
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
