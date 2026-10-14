"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  Trophy, 
  Clock, 
  PlayCircle, 
  Award, 
  Flame, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink,
  Printer,
  X,
  Layers,
  GraduationCap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Compute stats
  const totalEnrolled = enrolledCourses.length;
  const totalCompleted = completedCourseIds.length;
  const totalCertificates = certificates.length;

  // Calculate overall hours
  const totalHours = enrolledCourses.reduce((acc, c) => {
    const match = c.duration?.match(/(\d+)h/);
    return acc + (match ? parseInt(match[1]) : 6);
  }, 0);

  // Identify most recent in-progress course
  const inProgressCourses = enrolledCourses.filter(
    (c) => !completedCourseIds.includes(c._id.toString())
  );
  const activeCourse = inProgressCourses[0] || enrolledCourses[0];

  // Helper to calculate course completion %
  const getCourseProgress = (course: CourseItem) => {
    const allLessonCount = course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
    if (allLessonCount === 0) return completedCourseIds.includes(course._id.toString()) ? 100 : 0;
    
    const userDoneCount = completedLessons.filter((l) => l.courseId === course._id.toString()).length;
    return Math.min(100, Math.round((userDoneCount / allLessonCount) * 100));
  };

  return (
    <div className="space-y-10">
      
      {/* 1. PERSONALIZED WELCOME BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-8 sm:p-10 shadow-xl border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white text-2xl sm:text-3xl font-extrabold shadow-lg shadow-blue-500/30">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold backdrop-blur-md mb-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{user.streak?.count || 4} Day Learning Streak</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
                {getGreeting()}, {user.name}! 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">{user.email} • Pro Student Account</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md">
              <Link href="/courses">
                Explore Catalog
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      </div>

      {/* 2. STAT KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <Card className="rounded-2xl border-slate-200/80 shadow-xs bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Enrolled Tracks
            </CardTitle>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalEnrolled}</div>
            <p className="text-xs text-slate-500 mt-1">Active curricula</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 shadow-xs bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Completed
            </CardTitle>
            <Trophy className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalCompleted}</div>
            <p className="text-xs text-slate-500 mt-1">100% finished</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 shadow-xs bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Certificates
            </CardTitle>
            <Award className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalCertificates}</div>
            <p className="text-xs text-slate-500 mt-1">Verified credentials</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 shadow-xs bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Study Time
            </CardTitle>
            <Clock className="w-4 h-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalHours}h+</div>
            <p className="text-xs text-slate-500 mt-1">Estimated hours</p>
          </CardContent>
        </Card>
      </div>

      {/* 3. PRIORITY "RESUME LEARNING" HERO CARD */}
      {activeCourse && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Jump Back In
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
              {activeCourse.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">
              {activeCourse.description}
            </p>

            {/* Course Progress */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-semibold text-slate-600">
                <span>Progress</span>
                <span>{getCourseProgress(activeCourse)}% Completed</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${getCourseProgress(activeCourse)}%` }}
                />
              </div>
            </div>
          </div>

          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 shadow-md">
            <Link href={`/courses/${activeCourse._id.toString()}`}>
              <PlayCircle className="w-5 h-5 mr-2" />
              Resume Classroom
            </Link>
          </Button>
        </div>
      )}

      {/* 4. TABS NAVIGATION */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200">
          <div className="flex gap-6 text-sm font-semibold">
            <button
              onClick={() => setActiveTab("all")}
              className={`pb-3 transition-colors border-b-2 ${
                activeTab === "all" ? "border-blue-600 text-blue-600 font-bold" : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              All Courses ({enrolledCourses.length})
            </button>
            <button
              onClick={() => setActiveTab("in-progress")}
              className={`pb-3 transition-colors border-b-2 ${
                activeTab === "in-progress" ? "border-blue-600 text-blue-600 font-bold" : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              In Progress ({inProgressCourses.length})
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`pb-3 transition-colors border-b-2 ${
                activeTab === "completed" ? "border-blue-600 text-blue-600 font-bold" : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Completed ({totalCompleted})
            </button>
            <button
              onClick={() => setActiveTab("certificates")}
              className={`pb-3 transition-colors border-b-2 flex items-center gap-1.5 ${
                activeTab === "certificates" ? "border-blue-600 text-blue-600 font-bold" : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Award className="w-4 h-4 text-amber-500" />
              Certificates ({certificates.length})
            </button>
          </div>
        </div>

        {/* TAB CONTENT: COURSES */}
        {activeTab !== "certificates" && (
          <div>
            {enrolledCourses.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8 space-y-4">
                <GraduationCap className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-xl font-bold text-slate-800">You haven't enrolled in any tracks yet</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                  Browse our catalog to start building modern web, AI, and DevOps projects today.
                </p>
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
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
                    <Card key={course._id.toString()} className="rounded-2xl border-slate-200/80 shadow-xs flex flex-col justify-between overflow-hidden bg-white">
                      <div>
                        {/* Cover Image */}
                        <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                          {isDone ? (
                            <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white flex items-center gap-1 shadow-xs">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                            </span>
                          ) : (
                            <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-600 text-white shadow-xs">
                              {progress}% Done
                            </span>
                          )}
                        </div>

                        <CardContent className="p-5 space-y-2">
                          <div className="text-[11px] font-semibold text-blue-600 uppercase tracking-wide">
                            {course.category}
                          </div>
                          <h4 className="text-base font-bold text-slate-900 line-clamp-1">
                            {course.title}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-2">
                            {course.description}
                          </p>

                          {/* Progress bar */}
                          <div className="pt-2">
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${isDone ? "bg-emerald-500" : "bg-blue-600"}`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </div>

                      <div className="p-5 pt-0">
                        <Button asChild className="w-full bg-slate-900 hover:bg-blue-600 text-white font-medium text-xs">
                          <Link href={`/courses/${course._id.toString()}`}>
                            <PlayCircle className="w-3.5 h-3.5 mr-1.5" />
                            {isDone ? "Review Track" : "Continue Track"}
                          </Link>
                        </Button>
                      </div>
                    </Card>
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
              <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8 space-y-4">
                <Award className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-xl font-bold text-slate-800">No certificates earned yet</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                  Complete all the lectures and milestones of any course to automatically receive your verifiable digital credential.
                </p>
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href="/courses">Start a Course</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certificates.map((cert, idx) => (
                  <div 
                    key={idx} 
                    className="p-6 rounded-3xl bg-gradient-to-br from-amber-50/60 via-white to-slate-50 border-2 border-amber-200/80 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
                          <Award className="w-7 h-7" />
                        </div>
                        <span className="text-[11px] font-mono font-bold text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-200">
                          {cert.certificateId}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider block">
                        Verified Credential
                      </span>
                      <h4 className="text-lg font-bold text-slate-900 mt-1">
                        {cert.courseTitle}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Issued on {new Date(cert.issueDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-amber-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Authentic & Verified
                      </span>
                      <Button 
                        onClick={() => setSelectedCert(cert)}
                        className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold"
                      >
                        View Certificate
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
        <div className="pt-8 border-t border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Recommended Next Tracks</h3>
              <p className="text-xs text-slate-500">Expand your skillset with complementary engineering domains</p>
            </div>
            <Button asChild variant="outline" size="sm" className="text-xs">
              <Link href="/courses">View All Catalog</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedCourses.slice(0, 3).map((rec) => (
              <Card key={rec._id.toString()} className="rounded-2xl border-slate-200/80 shadow-xs flex flex-col justify-between overflow-hidden bg-white">
                <div>
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                    <img src={rec.thumbnail} alt={rec.title} className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 left-2 text-[10px] text-white/90 bg-slate-950/80 px-2 py-0.5 rounded font-medium">
                      {rec.category}
                    </span>
                  </div>
                  <CardContent className="p-4 space-y-1.5">
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{rec.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{rec.description}</p>
                  </CardContent>
                </div>
                <div className="p-4 pt-0">
                  <Button asChild variant="outline" className="w-full text-xs">
                    <Link href={`/courses/${rec._id.toString()}`}>
                      Enroll in Track
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* CERTIFICATE MODAL */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 sm:p-12 text-center bg-radial from-amber-50/50 via-white to-slate-50 border-8 border-double border-amber-600/30 m-4 rounded-2xl relative">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500 text-white shadow-lg shadow-amber-500/30 mb-4">
                <Award className="w-10 h-10" />
              </div>

              <span className="text-xs font-extrabold tracking-widest text-amber-700 uppercase block mb-1">
                EduPlatform Verified Credential
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-serif">
                Certificate of Completion
              </h2>

              <p className="text-xs text-slate-500 mt-4 uppercase tracking-wider">
                This credential is proudly awarded to
              </p>
              
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-700 underline decoration-amber-500 underline-offset-8 my-3">
                {user.name}
              </div>

              <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed mt-4">
                For successfully fulfilling all lectures, practical assignments, and hands-on milestones in
              </p>

              <div className="text-xl font-bold text-slate-900 mt-1 mb-6">
                {selectedCert.courseTitle}
              </div>

              <div className="grid grid-cols-2 gap-8 max-w-md mx-auto pt-6 border-t border-slate-200 text-xs">
                <div>
                  <div className="font-serif italic text-base text-slate-800">EduPlatform Academic Board</div>
                  <div className="text-slate-400 mt-0.5">Verified Instructor Review</div>
                </div>
                <div>
                  <div className="font-mono font-semibold text-slate-700">
                    {new Date(selectedCert.issueDate).toLocaleDateString()}
                  </div>
                  <div className="text-slate-400 mt-0.5">Issue Date</div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Certificate ID: <strong className="font-mono text-slate-700">{selectedCert.certificateId}</strong></span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Authenticity Verified
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => window.print()}
                className="text-xs font-semibold"
              >
                <Printer className="w-3.5 h-3.5 mr-1.5" />
                Print / Save PDF
              </Button>
              <Button 
                onClick={() => setSelectedCert(null)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
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
