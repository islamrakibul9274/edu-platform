"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Play, 
  Check, 
  Lock, 
  Clock, 
  Award, 
  MessageSquare, 
  FileText, 
  Download, 
  ExternalLink, 
  Send, 
  Printer, 
  X,
  ShieldCheck,
  ShieldAlert,
  Terminal,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EnrollButton from "@/components/EnrollButton";

interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl?: string;
  summary?: string;
  isFreePreview?: boolean;
}

interface Module {
  title: string;
  lessons: Lesson[];
}

interface CourseClassroomProps {
  course: {
    _id: string;
    title: string;
    description: string;
    level: string;
    category: string;
    thumbnail: string;
    duration: string;
    rating: number;
    reviewCount: number;
    videoUrl?: string;
    instructor?: {
      name: string;
      role: string;
      avatar: string;
      bio: string;
    };
    learningOutcomes?: string[];
    prerequisites?: string[];
    tags?: string[];
    modules: Module[];
  };
  isEnrolled: boolean;
  isCompleted: boolean;
  completedLessonIds: string[];
  initialDiscussions: any[];
  currentUser: {
    id: string;
    name: string;
    email: string;
  } | null;
  certificateId?: string | null;
}

export default function CourseClassroom({
  course,
  isEnrolled: initialIsEnrolled,
  isCompleted,
  completedLessonIds: initialCompletedLessonIds,
  initialDiscussions,
  currentUser,
  certificateId: initialCertId
}: CourseClassroomProps) {
  const router = useRouter();

  // STRICT ENROLLMENT & CURRICULUM STATE
  const [enrolled, setEnrolled] = useState<boolean>(initialIsEnrolled);
  const [currentModules, setCurrentModules] = useState<Module[]>(course.modules || []);
  
  const allLessons = currentModules.flatMap((m) => m.lessons) || [];
  
  const [activeLessonId, setActiveLessonId] = useState<string>(
    allLessons[0]?.id || "default"
  );
  
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(initialCompletedLessonIds || []);
  const [courseCompleted, setCourseCompleted] = useState<boolean>(isCompleted);
  const [certificateId, setCertificateId] = useState<string | null>(initialCertId || null);

  const [activeTab, setActiveTab] = useState<"overview" | "curriculum" | "discussions" | "resources">("overview");
  const [showCertificate, setShowCertificate] = useState(false);

  const [discussions, setDiscussions] = useState<any[]>(initialDiscussions || []);
  const [newQuestionTitle, setNewQuestionTitle] = useState("");
  const [newQuestionContent, setNewQuestionContent] = useState("");
  const [submittingQuestion, setSubmittingQuestion] = useState(false);

  const activeLesson = allLessons.find((l) => l.id === activeLessonId) || allLessons[0] || {
    id: "default",
    title: course.title,
    duration: "10:00",
    videoUrl: "",
    summary: course.description
  };

  const isCurrentLessonCompleted = completedLessonIds.includes(activeLesson.id);

  const progressPercent = allLessons.length > 0 
    ? Math.round((completedLessonIds.length / allLessons.length) * 100) 
    : (courseCompleted ? 100 : 0);

  // Instantaneous unlock callback when enrollment finishes
  const handleEnrollSuccess = (newModules?: any[]) => {
    setEnrolled(true);
    if (newModules && newModules.length > 0) {
      setCurrentModules(newModules);
    }
    router.refresh();
  };

  const handleToggleLessonComplete = async () => {
    if (!enrolled || !currentUser) return;

    try {
      const res = await fetch("/api/complete-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course._id, lessonId: activeLesson.id }),
      });

      const data = await res.json();
      if (res.ok) {
        if (!completedLessonIds.includes(activeLesson.id)) {
          setCompletedLessonIds([...completedLessonIds, activeLesson.id]);
        }
        if (data.isCourseCompleted) {
          setCourseCompleted(true);
          if (data.certificateId) {
            setCertificateId(data.certificateId);
            setShowCertificate(true);
          }
        }
        router.refresh();
      }
    } catch (err) {
      console.error("Lesson completion error:", err);
    }
  };

  const handlePostQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionTitle.trim() || !newQuestionContent.trim() || !currentUser || !enrolled) return;

    setSubmittingQuestion(true);
    try {
      const res = await fetch("/api/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: course._id,
          lessonId: activeLesson.id,
          title: newQuestionTitle,
          content: newQuestionContent
        })
      });

      const data = await res.json();
      if (res.ok && data.discussion) {
        setDiscussions([data.discussion, ...discussions]);
        setNewQuestionTitle("");
        setNewQuestionContent("");
      }
    } catch (err) {
      console.error("Discussion submit error:", err);
    } finally {
      setSubmittingQuestion(false);
    }
  };

  const getEmbedUrl = (url?: string) => {
    if (!url) return "";
    if (url.includes("embed/")) return url;
    if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/");
    if (url.includes("youtu.be/")) return url.replace("youtu.be/", "www.youtube.com/embed/");
    return url;
  };

  // STRICT VIDEO STREAM SECURITY: Video is ONLY accessible if the student is enrolled
  const isLessonAccessible = enrolled && Boolean(activeLesson.videoUrl);

  return (
    <div className="space-y-8">
      
      {/* Top Banner Navigation & Progress */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mono-tag text-zinc-500 mb-1">
            <Link href="/courses" className="hover:text-zinc-300 transition-colors">DIRECTORY</Link>
            <span>/</span>
            <span className="text-zinc-300">{course.category}</span>
            <span>/</span>
            <span className={enrolled ? "text-emerald-400 font-semibold" : "text-amber-400 font-semibold"}>
              {enrolled ? "ENROLLED STUDENT" : "TRACK UNENROLLED"}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{course.title}</h1>
        </div>

        {enrolled ? (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="mono-tag text-zinc-500">TRACK PROGRESS</div>
              <div className="font-mono text-sm font-bold text-zinc-200">{progressPercent}% COMPLETED</div>
            </div>
            <div className="w-24 bg-zinc-950 rounded-full h-2 overflow-hidden border border-zinc-800">
              <div 
                className="bg-emerald-400 h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {(courseCompleted || progressPercent === 100) && (
              <Button 
                onClick={() => setShowCertificate(true)}
                size="sm"
                className="bg-zinc-100 text-zinc-950 hover:bg-zinc-200 font-semibold text-xs"
              >
                <Award className="w-3.5 h-3.5 mr-1.5" />
                Certificate
              </Button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="mono-tag text-amber-500">ACCESS RESTRICTED</div>
              <div className="font-mono text-xs text-zinc-400">Enrollment Required</div>
            </div>
            <div className="w-48">
              <EnrollButton courseId={course._id} onEnrolled={handleEnrollSuccess} size="sm" />
            </div>
          </div>
        )}
      </div>

      {/* Main Classroom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Video Player & Tabs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* CINEMATIC VIDEO CONTAINER OR ULTRA-SECURE GATED SCREEN */}
          <div className="relative aspect-video rounded-xl overflow-hidden bg-[#0c0c0e] border border-zinc-800 shadow-2xl">
            {isLessonAccessible ? (
              <iframe
                src={`${getEmbedUrl(activeLesson.videoUrl)}?autoplay=0&rel=0&modestbranding=1`}
                title={activeLesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <div className="w-full h-full flex flex-col justify-between p-6 sm:p-8 bg-[#09090b] text-white">
                
                {/* Security Protocol Header */}
                <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="font-mono text-[11px] font-bold text-amber-400 tracking-wider">
                      STREAM LOCKED
                    </span>
                    <span className="text-zinc-600 font-mono text-[11px]">|</span>
                    <span className="font-mono text-[11px] text-zinc-400">
                      ENROLLMENT VERIFICATION REQUIRED
                    </span>
                  </div>
                  <span className="mono-tag text-zinc-500 hidden sm:inline-block">
                    PROPRIETARY DRM STREAM
                  </span>
                </div>

                {/* Center Content Gate */}
                <div className="flex flex-col items-center justify-center text-center py-2 sm:py-4 space-y-4 max-w-lg mx-auto">
                  <div className="relative">
                    <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-zinc-900 border border-zinc-750 flex items-center justify-center text-zinc-300 shadow-xl">
                      <Lock className="w-6 h-6 sm:w-7 sm:h-7 text-zinc-200" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-zinc-950 border border-zinc-750 flex items-center justify-center">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base sm:text-xl font-bold text-white tracking-tight">
                      Enroll to Unlock Lecture Stream
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed max-w-md mx-auto">
                      High-definition video walkthroughs, system diagrams, and interactive labs are reserved for enrolled students. Enroll now for instant access.
                    </p>
                  </div>

                  {/* Feature checklist */}
                  <div className="grid grid-cols-2 gap-2 w-full max-w-sm text-left pt-1">
                    <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-850 flex items-center gap-2 text-[11px] font-mono text-zinc-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>1080p Video Playback</span>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-850 flex items-center gap-2 text-[11px] font-mono text-zinc-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Architecture Repos</span>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-850 flex items-center gap-2 text-[11px] font-mono text-zinc-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Instructor Q&A</span>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-850 flex items-center gap-2 text-[11px] font-mono text-zinc-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Swiss-Style Credential</span>
                    </div>
                  </div>

                  {/* Unlock Button */}
                  <div className="w-full max-w-xs pt-1">
                    <EnrollButton
                      courseId={course._id}
                      onEnrolled={handleEnrollSuccess}
                      size="lg"
                      className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-bold text-xs h-11 rounded-lg shadow-md transition-all"
                    />
                  </div>
                </div>

                {/* Footer Security Watermark */}
                <div className="flex items-center justify-between pt-2 border-t border-zinc-850/80 text-[10px] font-mono text-zinc-600">
                  <span>TRACK // {course._id.slice(-6).toUpperCase()}</span>
                  <span>SECURITY PROTOCOL ENFORCED</span>
                </div>
              </div>
            )}
          </div>

          {/* Active Lesson Controls & Info */}
          <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="mono-tag text-zinc-500">
                  ACTIVE LECTURE
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5">{activeLesson.title}</h2>
                <div className="flex items-center gap-3 mono-tag text-zinc-400 mt-1">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {activeLesson.duration}</span>
                  {!enrolled && (
                    <span className="px-1.5 py-0.2 rounded bg-zinc-950 text-amber-400 border border-amber-800/60 font-mono text-[10px]">
                      ENROLLMENT REQUIRED
                    </span>
                  )}
                </div>
              </div>

              {enrolled && (
                <Button
                  onClick={handleToggleLessonComplete}
                  size="sm"
                  className={`text-xs font-semibold rounded-lg transition-all ${
                    isCurrentLessonCompleted 
                      ? "bg-emerald-950 text-emerald-400 border border-emerald-800 hover:bg-emerald-900/60" 
                      : "bg-zinc-100 text-zinc-950 hover:bg-zinc-200"
                  }`}
                >
                  <Check className="w-3.5 h-3.5 mr-1.5" />
                  {isCurrentLessonCompleted ? "Completed" : "Mark as Completed"}
                </Button>
              )}
            </div>

            {activeLesson.summary && (
              <p className="text-xs text-zinc-400 pt-2 border-t border-zinc-850 leading-relaxed">
                {activeLesson.summary}
              </p>
            )}
          </div>

          {/* Classroom Tabs Navigation */}
          <div className="border-b border-zinc-850 flex gap-6 text-xs font-mono">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-2.5 transition-colors border-b-2 ${
                activeTab === "overview" 
                  ? "border-zinc-100 text-white font-bold" 
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              OVERVIEW
            </button>
            <button
              onClick={() => setActiveTab("curriculum")}
              className={`pb-2.5 transition-colors border-b-2 ${
                activeTab === "curriculum" 
                  ? "border-zinc-100 text-white font-bold" 
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              SYLLABUS
            </button>
            <button
              onClick={() => setActiveTab("discussions")}
              className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
                activeTab === "discussions" 
                  ? "border-zinc-100 text-white font-bold" 
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              DISCUSSIONS
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                {discussions.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("resources")}
              className={`pb-2.5 transition-colors border-b-2 ${
                activeTab === "resources" 
                  ? "border-zinc-100 text-white font-bold" 
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              ASSETS & REPOS
            </button>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4">
                <span className="mono-tag text-zinc-500">SPECIFICATION</span>
                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">{course.description}</p>
                
                {course.learningOutcomes && course.learningOutcomes.length > 0 && (
                  <div className="pt-4 border-t border-zinc-850 space-y-3">
                    <span className="mono-tag text-zinc-500">LEARNING OBJECTIVES</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {course.learningOutcomes.map((outcome, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {course.instructor && (
                <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-start gap-4">
                  <img
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    className="w-12 h-12 rounded-lg object-cover grayscale border border-zinc-800"
                  />
                  <div>
                    <span className="mono-tag text-zinc-500">INSTRUCTOR</span>
                    <h4 className="text-sm font-bold text-white">{course.instructor.name}</h4>
                    <p className="mono-tag text-zinc-400 mb-1">{course.instructor.role}</p>
                    <p className="text-xs text-zinc-400 leading-relaxed">{course.instructor.bio}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CURRICULUM */}
          {activeTab === "curriculum" && (
            <div className="space-y-3">
              {currentModules.map((m, mIdx) => (
                <div key={mIdx} className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{m.title}</h4>
                    <span className="mono-tag text-zinc-500">{m.lessons.length} LECTURES</span>
                  </div>
                  <div className="space-y-1 pt-1">
                    {m.lessons.map((lesson) => {
                      const isDone = completedLessonIds.includes(lesson.id);
                      const isSelected = activeLessonId === lesson.id;
                      return (
                        <div 
                          key={lesson.id} 
                          onClick={() => setActiveLessonId(lesson.id)}
                          className={`p-2.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                            isSelected 
                              ? "bg-zinc-800 text-white" 
                              : "hover:bg-zinc-850 text-zinc-300"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {isDone ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : enrolled ? (
                              <Play className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-zinc-500"}`} />
                            ) : (
                              <Lock className="w-3.5 h-3.5 text-zinc-500" />
                            )}
                            <span className="text-xs">{lesson.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {!enrolled && (
                              <span className="px-1 py-0.2 rounded text-[9px] font-mono bg-zinc-850 text-zinc-500 border border-zinc-800">
                                LOCKED
                              </span>
                            )}
                            <span className="mono-tag text-zinc-500">{lesson.duration}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: DISCUSSIONS */}
          {activeTab === "discussions" && (
            <div className="space-y-4">
              {enrolled ? (
                currentUser ? (
                  <form onSubmit={handlePostQuestion} className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                    <span className="mono-tag text-zinc-500 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
                      NEW DISCUSSION THREAD
                    </span>
                    <Input
                      placeholder="Subject line..."
                      value={newQuestionTitle}
                      onChange={(e) => setNewQuestionTitle(e.target.value)}
                      required
                      className="bg-zinc-950 border-zinc-800 text-xs text-zinc-200"
                    />
                    <textarea
                      placeholder="Provide technical context, reproduction steps, or code..."
                      value={newQuestionContent}
                      onChange={(e) => setNewQuestionContent(e.target.value)}
                      required
                      rows={3}
                      className="w-full rounded-md border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-200 focus:outline-hidden focus:border-zinc-700"
                    />
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={submittingQuestion}
                        size="sm"
                        className="bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-xs font-semibold rounded-lg"
                      >
                        <Send className="w-3.5 h-3.5 mr-1.5" />
                        {submittingQuestion ? "Posting..." : "Post to Community"}
                      </Button>
                    </div>
                  </form>
                ) : null
              ) : (
                <div className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800 text-center space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
                    <Lock className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Community Q&A is Locked</h4>
                    <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                      Enroll in this track to participate in technical discussions, ask instructors questions, and collaborate with peers.
                    </p>
                  </div>
                  <div className="max-w-xs mx-auto pt-1">
                    <EnrollButton courseId={course._id} onEnrolled={handleEnrollSuccess} size="sm" />
                  </div>
                </div>
              )}

              {/* Discussions List */}
              <div className="space-y-3">
                {discussions.length === 0 ? (
                  <div className="p-8 text-center bg-zinc-900/30 rounded-xl border border-zinc-800/80">
                    <p className="text-xs text-zinc-500">No discussion threads yet. Be the first to start a conversation!</p>
                  </div>
                ) : (
                  discussions.map((d: any) => (
                    <div key={d._id} className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={d.userAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(d.userName)}`}
                            alt={d.userName}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="text-xs font-semibold text-zinc-200">{d.userName}</span>
                          <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 text-[10px] font-mono">
                            {d.userRole || "Student"}
                          </span>
                        </div>
                        <span className="mono-tag text-zinc-500">
                          {new Date(d.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-white">{d.title}</h4>
                        <p className="text-xs text-zinc-300 mt-1 leading-relaxed">{d.content}</p>
                      </div>

                      {/* Replies */}
                      {d.replies && d.replies.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-zinc-850 space-y-2">
                          {d.replies.map((r: any, rIdx: number) => (
                            <div key={rIdx} className="p-3 rounded-lg bg-zinc-950 border border-zinc-850 space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <img
                                    src={r.userAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(r.userName)}`}
                                    alt={r.userName}
                                    className="w-5 h-5 rounded-full object-cover"
                                  />
                                  <span className="text-xs font-medium text-zinc-300">{r.userName}</span>
                                  <span className="px-1 py-0.2 rounded bg-zinc-850 text-emerald-400 text-[9px] font-mono">
                                    {r.userRole || "Instructor"}
                                  </span>
                                </div>
                                <span className="text-[10px] font-mono text-zinc-500">
                                  {new Date(r.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-xs text-zinc-400 pl-7">{r.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: RESOURCES */}
          {activeTab === "resources" && (
            <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <span className="mono-tag text-zinc-500">REPOSITORIES & ARTIFACTS</span>
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-850 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-zinc-400" />
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-200">System Architecture Spec & Cheat Sheet</h4>
                      <p className="mono-tag text-zinc-500">Reference manual (.pdf)</p>
                    </div>
                  </div>
                  {enrolled ? (
                    <Button variant="outline" size="sm" className="text-[11px] h-7 border-zinc-800 text-zinc-300 hover:text-white">
                      <Download className="w-3 h-3 mr-1" /> Export
                    </Button>
                  ) : (
                    <span className="text-[10px] font-mono text-zinc-500 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Enrolled Only
                    </span>
                  )}
                </div>

                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-850 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <ExternalLink className="w-4 h-4 text-zinc-400" />
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-200">GitHub Verified Source Repository</h4>
                      <p className="mono-tag text-zinc-500">Dockerfiles, unit tests, and CI workflows</p>
                    </div>
                  </div>
                  {enrolled ? (
                    <Button variant="outline" size="sm" asChild className="text-[11px] h-7 border-zinc-800 text-zinc-300 hover:text-white">
                      <a href="https://github.com/islamrakibul9274/edu-platform" target="_blank" rel="noopener noreferrer">
                        View Code
                      </a>
                    </Button>
                  ) : (
                    <span className="text-[10px] font-mono text-zinc-500 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Enrolled Only
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right 1 Column: Course Curriculum Playlist */}
        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden sticky top-20">
            <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold mono-tag text-zinc-300">CURRICULUM TREE</h3>
                <p className="text-[11px] font-mono text-zinc-500 mt-0.5">
                  {enrolled ? `${completedLessonIds.length} / ${allLessons.length} LECTURES` : "TRACK ACCESS LOCKED"}
                </p>
              </div>
              <span className={`mono-tag px-2 py-0.5 rounded border ${
                enrolled 
                  ? "bg-zinc-800 text-zinc-200 border-zinc-700" 
                  : "bg-amber-950/80 text-amber-400 border-amber-800/60"
              }`}>
                {enrolled ? `${progressPercent}%` : "LOCKED"}
              </span>
            </div>

            <div className="p-2 space-y-4 max-h-[580px] overflow-y-auto">
              {currentModules.map((module, mIdx) => (
                <div key={mIdx} className="space-y-1">
                  <div className="mono-tag text-zinc-500 px-2 py-1">
                    {module.title}
                  </div>
                  <div className="space-y-0.5">
                    {module.lessons.map((lesson) => {
                      const isActive = activeLessonId === lesson.id;
                      const isCompleted = completedLessonIds.includes(lesson.id);

                      return (
                        <div
                          key={lesson.id}
                          onClick={() => setActiveLessonId(lesson.id)}
                          className={`p-2 rounded-lg flex items-center justify-between text-xs transition-all cursor-pointer ${
                            isActive
                              ? "bg-zinc-800 text-white font-semibold"
                              : enrolled
                              ? "hover:bg-zinc-850 text-zinc-300"
                              : "hover:bg-zinc-900/80 text-zinc-400"
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            {isCompleted ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : enrolled ? (
                              <Play className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-white" : "text-zinc-500"}`} />
                            ) : (
                              <Lock className="w-3.5 h-3.5 shrink-0 text-zinc-500" />
                            )}
                            <span className="truncate text-xs">{lesson.title}</span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {!enrolled && (
                              <span className="px-1 py-0.2 rounded text-[9px] font-mono bg-zinc-850 text-zinc-500 border border-zinc-800">
                                LOCKED
                              </span>
                            )}
                            <span className="mono-tag text-zinc-500">{lesson.duration}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {!enrolled && (
              <div className="p-3 bg-zinc-950 border-t border-zinc-800">
                <EnrollButton courseId={course._id} onEnrolled={handleEnrollSuccess} />
              </div>
            )}
          </div>
        </div>

      </div>

      {/* MINIMALIST VERIFIABLE SWISS CERTIFICATE */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white text-zinc-950 rounded-2xl shadow-2xl overflow-hidden border border-zinc-300">
            
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 z-20 p-1.5 rounded-md bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Swiss Precision Credential Document */}
            <div id="certificate-print-area" className="p-8 sm:p-12 text-left bg-white border border-zinc-200 m-4 rounded-xl relative space-y-6">
              
              <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-zinc-950 text-white font-mono flex items-center justify-center text-xs font-bold">
                    ED
                  </div>
                  <span className="font-bold tracking-tight text-sm uppercase">EDUPLATFORM ACADEMIC COUNCIL</span>
                </div>
                <span className="font-mono text-xs text-zinc-600">SERIAL // {certificateId || "CERT-VERIFIED-2026"}</span>
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
                  {currentUser?.name || "Distinguished Student"}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Has fulfilled all architectural milestones, code assignments, and end-to-end practical verifications for
                </p>
                <div className="text-base font-bold text-zinc-900">
                  {course.title}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-zinc-200 text-xs font-mono">
                <div>
                  <span className="text-zinc-500 block text-[10px]">REVIEWER</span>
                  <span className="font-semibold text-zinc-900">{course.instructor?.name || "Staff Architect"}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px]">VERIFIED TIMESTAMP</span>
                  <span className="font-semibold text-zinc-900">{new Date().toISOString().split('T')[0]}</span>
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
                onClick={() => setShowCertificate(false)}
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
