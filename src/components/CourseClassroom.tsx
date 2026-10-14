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
  Terminal,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EnrollButton from "@/components/EnrollButton";

interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
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
  isEnrolled,
  isCompleted,
  completedLessonIds: initialCompletedLessonIds,
  initialDiscussions,
  currentUser,
  certificateId: initialCertId
}: CourseClassroomProps) {
  const router = useRouter();

  const allLessons = course.modules?.flatMap((m) => m.lessons) || [];
  
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
    id: "preview",
    title: course.title,
    duration: "10:00",
    videoUrl: course.videoUrl || "https://www.youtube.com/embed/wm5gMKuwSYk",
    summary: course.description
  };

  const isCurrentLessonCompleted = completedLessonIds.includes(activeLesson.id);

  const progressPercent = allLessons.length > 0 
    ? Math.round((completedLessonIds.length / allLessons.length) * 100) 
    : (courseCompleted ? 100 : 0);

  const handleToggleLessonComplete = async () => {
    if (!isEnrolled || !currentUser) return;

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
      console.error(err);
    }
  };

  const handlePostQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionTitle.trim() || !newQuestionContent.trim() || !currentUser) return;

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
      console.error(err);
    } finally {
      setSubmittingQuestion(false);
    }
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return "https://www.youtube.com/embed/wm5gMKuwSYk";
    if (url.includes("embed/")) return url;
    if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/");
    if (url.includes("youtu.be/")) return url.replace("youtu.be/", "www.youtube.com/embed/");
    return url;
  };

  const isLessonAccessible = isEnrolled || activeLesson.isFreePreview;

  return (
    <div className="space-y-8">
      
      {/* Top Banner Navigation & Progress */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mono-tag text-zinc-500 mb-1">
            <Link href="/courses" className="hover:text-zinc-300 transition-colors">DIRECTORY</Link>
            <span>/</span>
            <span className="text-zinc-300">{course.category}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{course.title}</h1>
        </div>

        {isEnrolled && (
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
        )}
      </div>

      {/* Main Classroom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Video Player & Tabs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* CINEMATIC VIDEO CONTAINER */}
          <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-zinc-800 shadow-2xl">
            {isLessonAccessible ? (
              <iframe
                src={`${getEmbedUrl(activeLesson.videoUrl)}?autoplay=0&rel=0&modestbranding=1`}
                title={activeLesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-white bg-zinc-950 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                  <Lock className="w-6 h-6 text-zinc-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Lesson Locked</h3>
                  <p className="text-xs text-zinc-400 mt-1 max-w-sm">
                    Enroll in this track to access full lectures, solution repositories, and certification.
                  </p>
                </div>
                <div className="w-full max-w-xs">
                  <EnrollButton courseId={course._id} />
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
                  {activeLesson.isFreePreview && (
                    <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                      FREE PREVIEW
                    </span>
                  )}
                </div>
              </div>

              {isEnrolled && (
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
              {course.modules?.map((m, mIdx) => (
                <div key={mIdx} className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{m.title}</h4>
                    <span className="mono-tag text-zinc-500">{m.lessons.length} LECTURES</span>
                  </div>
                  <div className="space-y-1 pt-1">
                    {m.lessons.map((lesson) => {
                      const isDone = completedLessonIds.includes(lesson.id);
                      return (
                        <div 
                          key={lesson.id} 
                          onClick={() => (isEnrolled || lesson.isFreePreview) && setActiveLessonId(lesson.id)}
                          className={`p-2.5 rounded-lg flex items-center justify-between transition-colors ${
                            activeLessonId === lesson.id 
                              ? "bg-zinc-800 text-white" 
                              : "hover:bg-zinc-850 cursor-pointer text-zinc-300"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {isDone ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Play className={`w-3.5 h-3.5 ${activeLessonId === lesson.id ? "text-white" : "text-zinc-500"}`} />
                            )}
                            <span className="text-xs">{lesson.title}</span>
                          </div>
                          <span className="mono-tag text-zinc-500">{lesson.duration}</span>
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
              {currentUser ? (
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
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-700"
                  />
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={submittingQuestion} 
                      size="sm"
                      className="bg-zinc-100 text-zinc-950 hover:bg-zinc-200 font-semibold text-xs"
                    >
                      <Send className="w-3 h-3 mr-1.5" />
                      {submittingQuestion ? "Posting..." : "Submit Dispatch"}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 text-center mono-tag text-zinc-400">
                  <Link href="/login" className="text-white underline">Sign in</Link> to post in classroom discussions.
                </div>
              )}

              <div className="space-y-3">
                {discussions.length === 0 ? (
                  <p className="text-center py-8 mono-tag text-zinc-500">NO DISPATCHES RECORDED YET</p>
                ) : (
                  discussions.map((d: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs">{d.userName}</span>
                          <span className="mono-tag text-zinc-400 bg-zinc-800 px-1.5 py-0.2 rounded">
                            {d.userRole || "Student"}
                          </span>
                        </div>
                        <span className="mono-tag text-zinc-500">
                          {new Date(d.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-zinc-200">{d.title}</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed">{d.content}</p>

                      {d.replies && d.replies.length > 0 && (
                        <div className="mt-3 pl-3 border-l border-zinc-700 space-y-2 pt-1">
                          {d.replies.map((r: any, rIdx: number) => (
                            <div key={rIdx} className="space-y-0.5">
                              <span className="mono-tag text-zinc-300 font-bold">{r.userName} (Instructor)</span>
                              <p className="text-xs text-zinc-400">{r.content}</p>
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
                  <Button variant="outline" size="sm" className="text-[11px] h-7 border-zinc-800 text-zinc-300">
                    <Download className="w-3 h-3 mr-1" /> Export
                  </Button>
                </div>

                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-850 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <ExternalLink className="w-4 h-4 text-zinc-400" />
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-200">GitHub Verified Source Repository</h4>
                      <p className="mono-tag text-zinc-500">Dockerfiles, unit tests, and CI workflows</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild className="text-[11px] h-7 border-zinc-800 text-zinc-300">
                    <a href="https://github.com/islamrakibul9274/edu-platform" target="_blank" rel="noopener noreferrer">
                      View Code
                    </a>
                  </Button>
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
                  {completedLessonIds.length} / {allLessons.length} LECTURES
                </p>
              </div>
              <span className="mono-tag px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700">
                {progressPercent}%
              </span>
            </div>

            <div className="p-2 space-y-4 max-h-[580px] overflow-y-auto">
              {course.modules?.map((module, mIdx) => (
                <div key={mIdx} className="space-y-1">
                  <div className="mono-tag text-zinc-500 px-2 py-1">
                    {module.title}
                  </div>
                  <div className="space-y-0.5">
                    {module.lessons.map((lesson) => {
                      const isActive = activeLessonId === lesson.id;
                      const isCompleted = completedLessonIds.includes(lesson.id);
                      const isUnlocked = isEnrolled || lesson.isFreePreview;

                      return (
                        <div
                          key={lesson.id}
                          onClick={() => isUnlocked && setActiveLessonId(lesson.id)}
                          className={`p-2 rounded-lg flex items-center justify-between text-xs transition-all ${
                            isActive
                              ? "bg-zinc-800 text-white font-semibold"
                              : isUnlocked
                              ? "hover:bg-zinc-850 cursor-pointer text-zinc-300"
                              : "opacity-40 cursor-not-allowed text-zinc-500"
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            {isCompleted ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : isUnlocked ? (
                              <Play className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-white" : "text-zinc-500"}`} />
                            ) : (
                              <Lock className="w-3.5 h-3.5 shrink-0 text-zinc-500" />
                            )}
                            <span className="truncate text-xs">{lesson.title}</span>
                          </div>

                          <span className="mono-tag text-zinc-500 shrink-0">{lesson.duration}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {!isEnrolled && (
              <div className="p-3 bg-zinc-950 border-t border-zinc-800">
                <EnrollButton courseId={course._id} />
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
