import Link from "next/link";
import { GraduationCap, ShieldCheck, Zap, Globe, Share2, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 text-white">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-sm">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight">
                EduPlatform<span className="text-blue-500">.</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering engineers and builders with production-grade engineering courses, interactive environments, and verifiable industry credentials.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <a 
                href="https://github.com/islamrakibul9274/edu-platform" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 rounded-lg bg-slate-900 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="GitHub Repository"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <a 
                href="#" 
                className="p-2 rounded-lg bg-slate-900 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Twitter Community"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="p-2 rounded-lg bg-slate-900 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Catalog Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Explore Tracks</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/courses" className="hover:text-blue-400 transition-colors">Full-Stack Next.js 16</Link></li>
              <li><Link href="/courses" className="hover:text-blue-400 transition-colors">Computer Vision & YOLOv8</Link></li>
              <li><Link href="/courses" className="hover:text-blue-400 transition-colors">Python Data Science</Link></li>
              <li><Link href="/courses" className="hover:text-blue-400 transition-colors">Kubernetes & DevOps</Link></li>
              <li><Link href="/courses" className="hover:text-blue-400 transition-colors">Mobile with React Native</Link></li>
            </ul>
          </div>

          {/* Student Hub */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Student Hub</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/dashboard" className="hover:text-blue-400 transition-colors">My Learning Dashboard</Link></li>
              <li><Link href="/dashboard" className="hover:text-blue-400 transition-colors">Issued Certificates</Link></li>
              <li><Link href="/courses" className="hover:text-blue-400 transition-colors">Course Catalog</Link></li>
              <li><Link href="/login" className="hover:text-blue-400 transition-colors">Student Sign In</Link></li>
              <li><Link href="/register" className="hover:text-blue-400 transition-colors">Create Free Account</Link></li>
            </ul>
          </div>

          {/* Infrastructure & Status */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Platform Architecture</h4>
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Status</span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Systems 100% Active
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Deployed On</span>
                <span className="text-slate-200 font-medium">Vercel Edge Network</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Database</span>
                <span className="text-slate-200 font-medium">MongoDB Atlas</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} EduPlatform LMS. Built with Next.js 16, React 19, TypeScript & Tailwind CSS.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> End-to-end Encrypted
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Turbopack Accelerated
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
