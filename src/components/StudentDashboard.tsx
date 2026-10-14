"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  Trophy, 
  Clock, 
  Play, 
  Award, 
  Flame, 
  ArrowRight, 
  Check, 
  Printer, 
  X, 
  ShieldCheck, 
  Terminal,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseItem {
  _id: string;
  title: string;
  description: string;
  level: string;
  category: string;
  thumbnail: string;
  duration: string;
  modules?: any[];
}

interface CertificateItem {
  courseId: string;
  courseTitle: string;
  issueDate: string;
  certificateId: string;
}

interface StudentDashboardProps {
  user: {
    id: string;
    name: string;
    email: string;
    streak?: {
      count: number;
    };
  };
  enrolledCourses: CourseItem[];
  completedCourseIds: string[];
  completedLessons: { courseId: string; lessonId: string }[];
  certificates: CertificateItem[];
  recommendedCourses: CourseItem[];
}

export default function StudentDashboard({
  user,
  enrolledCourses,
  completedCourseIds,
  completedLessons,
  certificates,
  recommendedCourses
}: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState<"all" | "in-progress" | "completed" | "certificates">("all");
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);

  const totalEnrolled = enrolledCourses.length;
  const totalCompleted = completedCourseIds.length;
  const totalCertificates = certificates.length;

  const totalHours = enrolledCourses.reduce((acc, c) => {
    const match = c.duration?.match(/(\d+)h/);
    return acc + (match ? parseInt(match[1]) : 6);
  }, 0);

  const inProgressCourses = enrolledCourses.filter(
    (c) => !completedCourseIds.includes(c._id.toString())
  );
  const activeCourse = inProgressCourses[0] || enrolledCourses[0];

  const getCourseProgress = (course: CourseItem) => {
    const allLessonCount = course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
    if (allLessonCount === 0) return completedCourseIds.includes(course._id.toString()) ? 100 : 0;
    
    const userDoneCount = completedLessons.filter((l) => l.courseId === course._id.toString()).length;
    return Math.min(100, Math.round((userDoneCount / allLessonCount) * 100));
  };

  return (
    <div className="space-y-8">
      
      {/* 1. PERSONALIZED MISSION CONTROL HEADER */}
      <div className="p-6 sm:p-8 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-zinc-800 text-zinc-100 font-mono font-bold text-xl flex items-center justify-center border border-zinc-700">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 mono-tag text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>ENGINEER ID // {user.id.slice(-6).toUpperCase()}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-zinc-300">
                <Flame className="w-3 h-3 text-amber-400" /> {user.streak?.count || 4} DAY STREAK
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {user.name}
            </h1>
            <p className="text-xs font-mono text-zinc-500">{user.email}</p>
          </div>
        </div>

        <Button asChild size="sm" className="bg-zinc-100 text-zinc-950 hover:bg-zinc-200 font-semibold text-xs rounded-lg self-start md:self-auto">
          <Link href="/courses">
            Catalog Directory
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </Button>
      </div>

      {/* 2. STAT METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center justify-between mono-tag text-zinc-500 mb-2">
            <span>ENROLLED</span>
            <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-white">{totalEnrolled}</div>
          <p className="text-[11px] font-mono text-zinc-500 mt-0.5">Active tracks</p>
        </div>

        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center justify-between mono-tag text-zinc-500 mb-2">
            <span>COMPLETED</span>
            <Trophy className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-emerald-400">{totalCompleted}</div>
          <p className="text-[11px] font-mono text-zinc-500 mt-0.5">100% verified</p>
        </div>

        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center justify-between mono-tag text-zinc-500 mb-2">
            <span>CREDENTIALS</span>
            <Award className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-zinc-200">{totalCertificates}</div>
          <p className="text-[11px] font-mono text-zinc-500 mt-0.5">Issued certificates</p>
        </div>

        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center justify-between mono-tag text-zinc-500 mb-2">
            <span>HOURS LOGGED</span>
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-white">{totalHours}h+</div>
          <p className="text-[11px] font-mono text-zinc-500 mt-0.5">Hands-on runtime</p>
        </div>
      </div>

      {/* 3. RESUME LEARNING HERO CARD */}
      {activeCourse && (
        <div className="p-6 rounded-xl bg-zinc-900/80 border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="mono-tag text-zinc-500 flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-emerald-400" /> IN-PROGRESS REPOSITORY
            </span>
            <h3 className="text-lg font-bold text-white">
              {activeCourse.title}
            </h3>
            <p className="text-xs text-zinc-400 line-clamp-2">
              {activeCourse.description}
            </p>

            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-xs font-mono text-zinc-400">
                <span>PROGRESS</span>
                <span>{getCourseProgress(activeCourse)}%</span>
              </div>
              <div className="w-full bg-zinc-950 rounded-full h-1.5 overflow-hidden border border-zinc-800">
                <div 
                  className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${getCourseProgress(activeCourse)}%` }}
                />
              </div>
            </div>
          </div>

          <Button asChild className="bg-zinc-100 text-zinc-950 hover:bg-zinc-200 font-semibold text-xs h-9 px-5 rounded-lg shadow-sm">
            <Link href={`/courses/${activeCourse._id.toString()}`}>
              <Play className="w-3.5 h-3.5 mr-1.5" />
              Resume Studio
            </Link>
          </Button>
        </div>
      )}

      {/* 4. TABS NAVIGATION */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-850">
          <div className="flex gap-6 text-xs font-mono">
            <button
              onClick={() => setActiveTab("all")}
              className={`pb-2.5 transition-colors border-b-2 ${
                activeTab === "all" ? "border-zinc-100 text-white font-bold" : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              ALL TRACKS ({enrolledCourses.length})
            </button>
            <button
              onClick={() => setActiveTab("in-progress")}
              className={`pb-2.5 transition-colors border-b-2 ${
                activeTab === "in-progress" ? "border-zinc-100 text-white font-bold" : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              IN-PROGRESS ({inProgressCourses.length})
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`pb-2.5 transition-colors border-b-2 ${
                activeTab === "completed" ? "border-zinc-100 text-white font-bold" : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              COMPLETED ({totalCompleted})
            </button>
            <button
              onClick={() => setActiveTab("certificates")}
              className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
                activeTab === "certificates" ? "border-zinc-100 text-white font-bold" : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              CREDENTIALS ({certificates.length})
            </button>
          </div>
        </div>

        {/* TAB CONTENT: COURSES */}
        {activeTab !== "certificates" && (
          <div>
            {enrolledCourses.length === 0 ? (
              <div className="text-center py-16 rounded-xl border border-dashed border-zinc-850 bg-zinc-900/30 p-8 space-y-3">
                <Terminal className="w-8 h-8 text-zinc-600 mx-auto" />
                <h3 className="text-sm font-bold text-zinc-200">No active enrollments</h3>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                  Browse the curriculum catalog to begin learning.
                </p>
                <Button asChild size="sm" className="bg-zinc-100 text-zinc-950 hover:bg-zinc-200 text-xs">
                  <Link href="/courses">Browse Catalog</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(activeTab === "all" 
                  ? enrolledCourses 
                  : activeTab === "in-progress" 
                  ? inProgressCourses 
                  : enrolledCourses.filter((c) => completedCourseIds.includes(c._id.toString()))
                ).map((course) => {
                  const isDone = completedCourseIds.includes(course._id.toString());
                  const progress = getCourseProgress(course);

                  return (
                    <div key={course._id.toString()} className="obsidian-card rounded-xl overflow-hidden flex flex-col justify-between">
                      <div>
                        <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover grayscale-20"
                          />
                          {isDone ? (
                            <span className="absolute top-2 right-2 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/90 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                              <Check className="w-3 h-3" /> COMPLETED
                            </span>
                          ) : (
                            <span className="absolute top-2 right-2 text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950/80 text-zinc-300 border border-zinc-800">
                              {progress}%
                            </span>
                          )}
                        </div>

                        <div className="p-4 space-y-1.5">
                          <div className="mono-tag text-zinc-500">
                            {course.category}
                          </div>
                          <h4 className="text-sm font-bold text-white line-clamp-1">
                            {course.title}
                          </h4>
                          <p className="text-xs text-zinc-400 line-clamp-2">
                            {course.description}
                          </p>

                          <div className="pt-2">
                            <div className="w-full bg-zinc-950 rounded-full h-1 overflow-hidden border border-zinc-850">
                              <div
                                className={`h-full rounded-full ${isDone ? "bg-emerald-400" : "bg-zinc-200"}`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 pt-0">
                        <Button asChild size="sm" className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white text-xs">
                          <Link href={`/courses/${course._id.toString()}`}>
                            {isDone ? "Review Track" : "Resume Track"}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB CONTENT: CERTIFICATES */}
        {activeTab === "certificates" && (
          <div>
            {certificates.length === 0 ? (
              <div className="text-center py-16 rounded-xl border border-dashed border-zinc-850 bg-zinc-900/30 p-8 space-y-3">
                <Award className="w-8 h-8 text-zinc-600 mx-auto" />
                <h3 className="text-sm font-bold text-zinc-200">No credentials issued</h3>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                  Complete all modules in any track to automatically issue your verified credential.
                </p>
                <Button asChild size="sm" className="bg-zinc-100 text-zinc-950 hover:bg-zinc-200 text-xs">
                  <Link href="/courses">Start a Track</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certificates.map((cert, idx) => (
                  <div 
                    key={idx} 
                    className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="mono-tag text-zinc-500 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          VERIFIED CREDENTIAL
                        </span>
                        <span className="font-mono text-[11px] text-zinc-400 bg-zinc-950 border border-zinc-800 px-2 py-0.5 rounded">
                          {cert.certificateId}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white">
                        {cert.courseTitle}
                      </h4>
                      <p className="font-mono text-xs text-zinc-500 mt-1">
                        Issued on {new Date(cert.issueDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-zinc-850 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-emerald-400">
                        ● VERIFIED AUTHENTIC
                      </span>
                      <Button 
                        onClick={() => setSelectedCert(cert)}
                        size="sm"
                        className="bg-zinc-100 text-zinc-950 hover:bg-zinc-200 text-xs font-semibold h-8"
                      >
                        Inspect Certificate
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* 5. RECOMMENDED NEXT COURSES */}
      {recommendedCourses.length > 0 && (
        <div className="pt-6 border-t border-zinc-850 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="mono-tag text-zinc-500">RECOMMENDED</span>
              <h3 className="text-base font-bold text-white">Complementary Curricula</h3>
            </div>
            <Button asChild variant="outline" size="sm" className="text-xs border-zinc-800 text-zinc-300">
              <Link href="/courses">All Curricula</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedCourses.slice(0, 3).map((rec) => (
              <div key={rec._id.toString()} className="obsidian-card p-4 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="mono-tag text-zinc-500 mb-1">{rec.category}</div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{rec.title}</h4>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1">{rec.description}</p>
                </div>
                <div className="mt-4 pt-2 border-t border-zinc-850">
                  <Button asChild variant="outline" size="sm" className="w-full text-xs border-zinc-800 text-zinc-300 hover:text-white">
                    <Link href={`/courses/${rec._id.toString()}`}>
                      Inspect Track
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SWISS CERTIFICATE MODAL */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white text-zinc-950 rounded-2xl shadow-2xl overflow-hidden border border-zinc-300">
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 z-20 p-1.5 rounded-md bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-8 sm:p-12 text-left bg-white border border-zinc-200 m-4 rounded-xl relative space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-zinc-950 text-white font-mono flex items-center justify-center text-xs font-bold">
                    ED
                  </div>
                  <span className="font-bold tracking-tight text-sm uppercase">EDUPLATFORM ACADEMIC COUNCIL</span>
                </div>
                <span className="font-mono text-xs text-zinc-600">SERIAL // {selectedCert.certificateId}</span>
              </div>

              <div className="space-y-1">
                <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest block">CREDENTIAL OF EXCELLENCE</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
                  Certificate of Engineering Completion
                </h2>
              </div>

              <div className="py-2 border-y border-zinc-100 space-y-1">
                <span className="font-mono text-[11px] text-zinc-500 uppercase">AWARDED TO</span>
                <div className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
                  {user.name}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Has fulfilled all architectural milestones, code assignments, and end-to-end practical verifications for
                </p>
                <div className="text-base font-bold text-zinc-900">
                  {selectedCert.courseTitle}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-zinc-200 text-xs font-mono">
                <div>
                  <span className="text-zinc-500 block text-[10px]">REVIEWER</span>
                  <span className="font-semibold text-zinc-900">Academic Review Board</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px]">VERIFIED TIMESTAMP</span>
                  <span className="font-semibold text-zinc-900">{new Date(selectedCert.issueDate).toISOString().split('T')[0]}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-zinc-500 border-t border-zinc-100">
                <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> SHA-256 CRYPTOGRAPHICALLY VERIFIED
                </span>
                <span>STATUS: ISSUED</span>
              </div>
            </div>

            <div className="p-3 bg-zinc-50 border-t border-zinc-200 flex items-center justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.print()}
                className="text-xs text-zinc-800"
              >
                <Printer className="w-3.5 h-3.5 mr-1" />
                Print PDF
              </Button>
              <Button 
                size="sm"
                onClick={() => setSelectedCert(null)}
                className="bg-zinc-950 text-white hover:bg-zinc-800 text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
