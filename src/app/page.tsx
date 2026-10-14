import Link from "next/link";
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Star, 
  Users, 
  Award, 
  PlayCircle, 
  Code2, 
  BrainCircuit, 
  BarChart3, 
  Cloud, 
  Smartphone, 
  Palette,
  ShieldCheck,
  Zap,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { connectToDatabase } from "@/lib/mongodb";
import Course from "@/models/Course";

export default async function Home() {
  await connectToDatabase();
  const featuredCourses = await Course.find({}).limit(3).lean();

  const categories = [
    { title: "Full-Stack Development", icon: Code2, count: "12 Courses", color: "from-blue-500 to-indigo-600", desc: "Next.js 16, React 19, Node.js, GraphQL & scalable APIs" },
    { title: "Artificial Intelligence", icon: BrainCircuit, count: "8 Courses", color: "from-purple-500 to-pink-600", desc: "Computer Vision, YOLOv8, PyTorch, LLMs & Neural Networks" },
    { title: "Data Science & ML", icon: BarChart3, count: "10 Courses", color: "from-emerald-500 to-teal-600", desc: "Pandas, NumPy, Scikit-Learn, Predictive Modeling & Dashboards" },
    { title: "Cloud & DevOps", icon: Cloud, count: "7 Courses", color: "from-sky-500 to-blue-600", desc: "Kubernetes, Docker, ArgoCD, Terraform & Microservices" },
    { title: "Mobile Engineering", icon: Smartphone, count: "6 Courses", color: "from-amber-500 to-orange-600", desc: "React Native, Expo 52, iOS & Android Native Architecture" },
    { title: "UI/UX & Design Systems", icon: Palette, count: "9 Courses", color: "from-rose-500 to-red-600", desc: "Tailwind v4, Figma Tokens, Accessibility & Micro-Interactions" },
  ];

  const testimonials = [
    {
      name: "Marcus Aurelius Vance",
      role: "Senior Software Engineer @ FinTech",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      content: "The Next.js 16 course here is fundamentally different from generic courses. The focus on real architecture, Server Actions, and MongoDB performance gave me immediate confidence at work.",
      course: "Next.js 16 & React 19 Mastery"
    },
    {
      name: "Devon Clark",
      role: "Machine Learning Engineer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      content: "The YOLOv8 computer vision pipeline with real TensorRT export was the exact production skill set I needed. The curriculum structure and certificate were instrumental.",
      course: "Computer Vision with YOLOv8"
    },
    {
      name: "Aria Montgomery",
      role: "Staff Platform Architect",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      content: "Top quality pedagogy. Deep, hands-on, zero fluff. The interactive student discussions and verifiable completion credentials make this platform stand out.",
      course: "Cloud Native DevOps & Kubernetes"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32 bg-radial from-blue-50/60 via-slate-50 to-slate-50">
        
        {/* Subtle background glow effect */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-blue-400/15 via-indigo-400/20 to-violet-400/15 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            
            {/* Announcement Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold shadow-xs animate-in fade-in slide-in-from-bottom-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin" />
              <span>Next-Gen Software Engineering LMS • 2026 Edition</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.1]">
              Master Real-World Engineering. <br />
              <span className="gradient-text">Build the Future.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Step beyond basic tutorials. Build production SaaS apps, train computer vision models, deploy self-healing Kubernetes clusters, and earn verifiable industry credentials.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button asChild size="lg" className="w-full sm:w-auto h-13 px-8 text-base bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-102">
                <Link href="/courses">
                  Explore Course Catalog
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto h-13 px-8 text-base bg-white/80 hover:bg-white text-slate-800 border-slate-300/80 shadow-xs">
                <Link href="/dashboard">
                  Student Dashboard
                </Link>
              </Button>
            </div>

            {/* Trust points */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Free Preview Lessons Available
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-500" /> Tamper-Proof Digital Certificates
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" /> Live Interactive Video Player
              </span>
            </div>

          </div>

          {/* KPI Metrics Strip */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-center">
              <div className="text-3xl lg:text-4xl font-extrabold text-slate-900">15,000+</div>
              <p className="text-xs font-medium text-slate-500 mt-1">Active Software Engineers</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-center">
              <div className="text-3xl lg:text-4xl font-extrabold text-blue-600">4.92 ★</div>
              <p className="text-xs font-medium text-slate-500 mt-1">Average Course Rating</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-center">
              <div className="text-3xl lg:text-4xl font-extrabold text-emerald-600">98%</div>
              <p className="text-xs font-medium text-slate-500 mt-1">Course Satisfaction Rate</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-center">
              <div className="text-3xl lg:text-4xl font-extrabold text-violet-600">100%</div>
              <p className="text-xs font-medium text-slate-500 mt-1">Hands-on Real Projects</p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. FEATURED COURSES SHOWCASE */}
      <section className="py-20 bg-white border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" /> Featured Tracks
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Trending Engineering Courses
              </h2>
              <p className="text-slate-600 mt-2 text-base">
                Curated curriculum designed by staff engineers to bring you from intermediate to senior mastery.
              </p>
            </div>
            <Button asChild variant="outline" className="self-start md:self-auto border-slate-300">
              <Link href="/courses">
                View All {featuredCourses.length > 0 ? "Courses" : "Catalog"}
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCourses.map((course: any) => {
              const levelColor = 
                course.level === 'Beginner' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                course.level === 'Intermediate' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                'bg-purple-50 text-purple-700 border-purple-200';

              return (
                <Card 
                  key={course._id.toString()} 
                  className="group overflow-hidden rounded-2xl border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 flex flex-col bg-white"
                >
                  {/* Thumbnail Banner */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                    <img 
                      src={course.thumbnail || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80"} 
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    
                    <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-md border backdrop-blur-md shadow-xs ${levelColor}`}>
                      {course.level}
                    </span>

                    <span className="absolute bottom-3 left-3 text-xs font-medium text-white/90 bg-slate-900/80 px-2 py-0.5 rounded">
                      {course.category || "Engineering"}
                    </span>

                    <span className="absolute bottom-3 right-3 text-xs font-medium text-white/90 flex items-center gap-1 bg-slate-900/80 px-2 py-0.5 rounded">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {course.rating || 4.9}
                    </span>
                  </div>

                  {/* Body Content */}
                  <CardContent className="p-6 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {course.title}
                      </h3>
                      <p className="text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 space-y-4">
                      {/* Instructor & Meta */}
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                          <img 
                            src={course.instructor?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"} 
                            alt={course.instructor?.name || "Instructor"} 
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="font-medium text-slate-700">{course.instructor?.name || "Senior Instructor"}</span>
                        </div>
                        <span>{course.duration || "8h 30m"}</span>
                      </div>

                      {/* CTA Button */}
                      <Button asChild className="w-full bg-slate-900 hover:bg-blue-600 text-white transition-colors group-hover:shadow-md">
                        <Link href={`/courses/${course._id.toString()}`}>
                          View Curriculum
                          <ArrowRight className="w-4 h-4 ml-1.5" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

        </div>
      </section>

      {/* 3. TRACK CATEGORIES */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Explore Industry Learning Tracks
            </h2>
            <p className="text-slate-600 text-base">
              Choose your domain and master modern engineering workflows from architecture to deployment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <Link 
                  key={idx} 
                  href="/courses"
                  className="group p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-400 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${cat.color} text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-semibold text-slate-400 group-hover:text-blue-600 transition-colors">
                        {cat.count}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                    Explore track <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. LEARNING METHODOLOGY / HOW IT WORKS */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-blue-400 text-xs font-semibold uppercase tracking-wider">Methodology</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Engineered For Deep Mastery
            </h2>
            <p className="text-slate-400 text-base">
              A structured four-step journey built around real development workflows rather than passive video consumption.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 relative">
              <span className="text-4xl font-black text-blue-500/30 absolute top-4 right-4">01</span>
              <BookOpen className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-lg font-bold mb-2">Curated Curriculum</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Step-by-step modular lessons covering real production use cases and architectural tradeoffs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 relative">
              <span className="text-4xl font-black text-indigo-500/30 absolute top-4 right-4">02</span>
              <PlayCircle className="w-8 h-8 text-indigo-400 mb-4" />
              <h3 className="text-lg font-bold mb-2">Interactive Player</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                High-definition video playback with speed controls, syllabus navigation, and free lesson previews.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 relative">
              <span className="text-4xl font-black text-purple-500/30 absolute top-4 right-4">03</span>
              <Users className="w-8 h-8 text-purple-400 mb-4" />
              <h3 className="text-lg font-bold mb-2">Community Q&A</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ask questions right on the lesson page, get answers from instructors and collaborate with peers.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 relative">
              <span className="text-4xl font-black text-emerald-500/30 absolute top-4 right-4">04</span>
              <Award className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-lg font-bold mb-2">Verified Credential</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Complete all modules and automatically generate a digital certificate with verification ID.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Trusted by Engineers Worldwide
            </h2>
            <p className="text-slate-600 text-base">
              Hear from developers building production systems after completing our courses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[...Array(5)].map((_, starIdx) => (
                      <Star key={starIdx} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-700 italic leading-relaxed">
                    "{t.content}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{t.name}</h4>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="py-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ready to Accelerate Your Career?
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Join thousands of developers leveling up their full-stack, AI, and DevOps skills. Start learning today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-slate-100 font-bold px-8 shadow-md">
              <Link href="/register">Create Free Account</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 px-8">
              <Link href="/courses">Browse Catalog</Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}