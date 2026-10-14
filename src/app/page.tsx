import Link from "next/link";
import { 
  ArrowRight, 
  Terminal, 
  Check, 
  Star, 
  Clock, 
  Code2, 
  BrainCircuit, 
  BarChart3, 
  Cloud, 
  Smartphone, 
  Palette,
  ShieldCheck,
  Cpu,
  Layers,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { connectToDatabase } from "@/lib/mongodb";
import Course from "@/models/Course";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  await connectToDatabase();
  const featuredCourses = await Course.find({}).limit(3).lean();

  const tracks = [
    { title: "Full-Stack Web Architecture", icon: Code2, count: "12 Curricula", desc: "Next.js 16, React 19, Turbopack, Server Actions & distributed DB models." },
    { title: "Computer Vision & Perception", icon: BrainCircuit, count: "8 Curricula", desc: "YOLOv8, PyTorch, Real-time ByteTrack, segmentation and TensorRT export." },
    { title: "Data Science & Machine Learning", icon: BarChart3, count: "10 Curricula", desc: "High-performance Pandas vectorization, Scikit-Learn pipelines & analytics." },
    { title: "Cloud Native & DevOps", icon: Cloud, count: "7 Curricula", desc: "Self-healing Kubernetes clusters, Docker security, Helm & ArgoCD GitOps." },
    { title: "Mobile Systems Engineering", icon: Smartphone, count: "6 Curricula", desc: "React Native, Expo 52 file-based routing, gesture handlers & SQLite persistence." },
    { title: "Design Systems & UI Engineering", icon: Palette, count: "9 Curricula", desc: "Tailwind CSS v4 tokens, accessible Radix UI primitives & 60FPS interactions." },
  ];

  const testimonials = [
    {
      name: "Marcus Vance",
      role: "Staff Engineer @ FinTech Core",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      content: "The Next.js 16 architecture track eliminated the guesswork around Server Components and MongoDB connection pooling in high-concurrency environments.",
      track: "Next.js 16 Full-Stack"
    },
    {
      name: "Devon Clark",
      role: "Vision Pipeline Engineer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      content: "The YOLOv8 course went straight to the production metal — dataset preparation, edge quantization, and TensorRT inference at 60 FPS.",
      track: "Computer Vision with YOLOv8"
    },
    {
      name: "Aria Montgomery",
      role: "Cloud Platform Architect",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      content: "Finally an LMS that treats students like engineers. Clean syllabus, verifiable completion certificates, and zero hand-waving.",
      track: "Cloud Native & Kubernetes"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#09090b] text-zinc-100">
      
      {/* 1. HERO SECTION - Technical Minimalist 2026 */}
      <section className="relative overflow-hidden pt-18 pb-24 lg:pt-28 lg:pb-32 bg-tech-grid border-b border-zinc-850">
        
        {/* Subtle radial spotlight (monochrome neutral) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/[0.03] blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            
            {/* Minimalist Monospace Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>PRODUCTION LMS // 2026 COHORT</span>
            </div>

            {/* High-Impact Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08]">
              Engineering curricula <br />
              <span className="text-zinc-400 font-normal">built for developers who ship.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Step beyond toy projects. Architect production SaaS applications, train real-time perception models, orchestrate Kubernetes clusters, and earn cryptographic credentials.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              {session?.user ? (
                <>
                  <Button asChild size="lg" className="w-full sm:w-auto h-11 px-6 bg-zinc-100 text-zinc-950 hover:bg-zinc-200 font-semibold text-xs rounded-lg shadow-sm">
                    <Link href="/courses">
                      Explore Curricula
                      <ArrowRight className="w-3.5 h-3.5 ml-2" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="w-full sm:w-auto h-11 px-6 bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:bg-zinc-850 hover:text-white font-medium text-xs rounded-lg">
                    <Link href="/dashboard">
                      Student Dashboard
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild size="lg" className="w-full sm:w-auto h-11 px-6 bg-zinc-100 text-zinc-950 hover:bg-zinc-200 font-semibold text-xs rounded-lg shadow-sm">
                    <Link href="/register">
                      Start Learning Free
                      <ArrowRight className="w-3.5 h-3.5 ml-2" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="w-full sm:w-auto h-11 px-6 bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:bg-zinc-850 hover:text-white font-medium text-xs rounded-lg">
                    <Link href="/login">
                      Sign In
                    </Link>
                  </Button>
                </>
              )}
            </div>

            {/* Trust specs */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-mono text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-zinc-300" /> Protected HD Video Streams
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-zinc-300" /> Verifiable Certificates
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-zinc-300" /> Community Q&A
              </span>
            </div>

          </div>

          {/* Metric Bento Strip */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
            <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
              <div className="font-mono text-2xl lg:text-3xl font-bold text-white">15,420</div>
              <p className="mono-tag text-zinc-500 mt-1">Active Engineers</p>
            </div>
            <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
              <div className="font-mono text-2xl lg:text-3xl font-bold text-emerald-400">4.92 / 5.0</div>
              <p className="mono-tag text-zinc-500 mt-1">Instructor Score</p>
            </div>
            <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
              <div className="font-mono text-2xl lg:text-3xl font-bold text-white">98.4%</div>
              <p className="mono-tag text-zinc-500 mt-1">Completion Index</p>
            </div>
            <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
              <div className="font-mono text-2xl lg:text-3xl font-bold text-zinc-300">100%</div>
              <p className="mono-tag text-zinc-500 mt-1">Real Repo Projects</p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. FEATURED COURSES - Bento Grid */}
      <section className="py-20 bg-[#09090b] border-b border-zinc-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="mono-tag text-zinc-500">FEATURED TRACKS</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                Core Production Curricula
              </h2>
            </div>
            <Button asChild variant="outline" size="sm" className="self-start sm:self-auto border-zinc-800 text-zinc-300 hover:text-white bg-zinc-900 text-xs">
              <Link href="/courses">
                View Full Catalog ({featuredCourses.length > 0 ? "6 Tracks" : "All"})
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCourses.map((course: any) => {
              const levelDot = 
                course.level === 'Beginner' ? 'bg-emerald-400' :
                course.level === 'Intermediate' ? 'bg-amber-400' : 'bg-sky-400';

              return (
                <div 
                  key={course._id.toString()} 
                  className="obsidian-card rounded-xl overflow-hidden flex flex-col justify-between group"
                >
                  {/* Thumbnail Banner */}
                  <div>
                    <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
                      <img 
                        src={course.thumbnail || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80"} 
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300 grayscale-20 contrast-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111114] via-transparent to-transparent" />
                      
                      {/* Monospace Level Tag */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-950/80 border border-zinc-800 text-zinc-300 mono-tag">
                        <span className={`w-1.5 h-1.5 rounded-full ${levelDot}`}></span>
                        {course.level}
                      </div>

                      <div className="absolute bottom-3 left-3 text-zinc-300 mono-tag bg-zinc-950/80 px-2 py-0.5 rounded border border-zinc-850">
                        {course.category}
                      </div>

                      <div className="absolute bottom-3 right-3 text-zinc-300 mono-tag flex items-center gap-1 bg-zinc-950/80 px-2 py-0.5 rounded border border-zinc-850">
                        <Star className="w-3 h-3 text-zinc-300 fill-zinc-300" /> {course.rating || 4.9}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-2">
                      <h3 className="text-base font-bold text-white group-hover:text-zinc-200 transition-colors line-clamp-1">
                        {course.title}
                      </h3>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>
                    </div>
                  </div>

                  {/* Footer strip */}
                  <div className="p-5 pt-0 border-t border-zinc-850/80 mt-4 space-y-3">
                    <div className="flex items-center justify-between text-xs text-zinc-400 pt-3">
                      <div className="flex items-center gap-2">
                        <img 
                          src={course.instructor?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"} 
                          alt="Instructor" 
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="text-zinc-300 text-xs">{course.instructor?.name || "Senior Instructor"}</span>
                      </div>
                      <span className="font-mono text-[11px] text-zinc-400">{course.duration}</span>
                    </div>

                    <Button asChild size="sm" className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white text-xs font-semibold rounded-lg">
                      <Link href={`/courses/${course._id.toString()}`}>
                        Access Track
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 3. TRACK DOMAINS - Precision Bento Grid */}
      <section className="py-20 bg-[#09090b] border-b border-zinc-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mb-12">
            <span className="mono-tag text-zinc-500">DISCIPLINES</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
              Engineering Disciplines
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1">
              Full pipelines covering foundational theory through to bare-metal optimization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tracks.map((t, idx) => {
              const Icon = t.icon;
              return (
                <Link 
                  key={idx} 
                  href="/courses"
                  className="obsidian-card p-5 rounded-xl flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 group-hover:text-white transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="mono-tag text-zinc-400">
                        {t.count}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-zinc-200 transition-colors">
                        {t.title}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        {t.desc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-850/80 flex items-center justify-between text-xs mono-tag text-zinc-400 group-hover:text-zinc-200">
                    <span>EXPLORE SYLLABUS</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. METHODOLOGY ROADMAP */}
      <section className="py-20 bg-[#0c0c0e] border-b border-zinc-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-xl mb-12">
            <span className="mono-tag text-zinc-500">LEARNING ARCHITECTURE</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
              Engineered For Retention
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-2">
              <span className="mono-tag text-zinc-500 block">PHASE 01</span>
              <h3 className="text-sm font-bold text-white">Syllabus Breakdown</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Clear modular checkpoints with real architecture design diagrams and setup checklists.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-2">
              <span className="mono-tag text-zinc-500 block">PHASE 02</span>
              <h3 className="text-sm font-bold text-white">Interactive Studio</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Video lecture player with dynamic module switcher, speed controls, and code snippets.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-2">
              <span className="mono-tag text-zinc-500 block">PHASE 03</span>
              <h3 className="text-sm font-bold text-white">Peer & Instructor Q&A</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Direct in-classroom discussion board for resolving edge cases and debugging hurdles.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-2">
              <span className="mono-tag text-zinc-500 block">PHASE 04</span>
              <h3 className="text-sm font-bold text-white">Verified Credential</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Automatic generation of verifiable digital certificates with unique serial numbers.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="py-20 bg-[#09090b] border-b border-zinc-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-xl mb-12">
            <span className="mono-tag text-zinc-500">DISPATCHES</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
              Field Reports
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="obsidian-card p-5 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="mono-tag text-zinc-500 mb-3">{t.track}</div>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    "{t.content}"
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-zinc-850 flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-8 h-8 rounded-full object-cover grayscale" />
                  <div>
                    <h4 className="text-xs font-bold text-white">{t.name}</h4>
                    <p className="text-[11px] text-zinc-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. CALL TO ACTION - Minimalist Terminal style */}
      <section className="py-18 bg-[#0c0c0e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-zinc-900 border border-zinc-800 mono-tag text-zinc-400">
            <Terminal className="w-3.5 h-3.5" />
            <span>{session?.user ? "STUDENT CONSOLE // ACTIVE" : "READY TO SHIP PRODUCTION CODE"}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            {session?.user 
              ? "Continue your engineering journey." 
              : "Start mastering modern engineering today."}
          </h2>

          <p className="text-sm text-zinc-400 max-w-lg mx-auto">
            {session?.user 
              ? "Resume your enrolled tracks, complete pending architectural milestones, and inspect new curricula."
              : "Zero subscription walls for core tracks. Join thousands of developers building scalable systems."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {session?.user ? (
              <>
                <Button asChild size="lg" className="h-10 px-6 bg-zinc-100 text-zinc-950 hover:bg-zinc-200 font-semibold text-xs rounded-lg">
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="w-3.5 h-3.5 ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-10 px-6 bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white text-xs rounded-lg">
                  <Link href="/courses">Browse Curricula</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild size="lg" className="h-10 px-6 bg-zinc-100 text-zinc-950 hover:bg-zinc-200 font-semibold text-xs rounded-lg">
                  <Link href="/register">Create Free Account</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-10 px-6 bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white text-xs rounded-lg">
                  <Link href="/login">Sign In</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}