"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  PlayCircle, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  ChevronRight, 
  ChevronDown, 
  Clock, 
  Award, 
  MessageSquare, 
  FileText, 
  Download, 
  ExternalLink, 
  Send, 
  Sparkles, 
  Printer, 
  X,
  Share2,
  BookOpen,
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

  // Flatten all lessons
  const allLessons = course.modules?.flatMap((m) => m.lessons) || [];
  
  // Active lesson state
  const [activeLessonId, setActiveLessonId] = useState<string>(
    allLessons[0]?.id || "default"
  );
  
  // Completed lessons state
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(initialCompletedLessonIds || []);
  const [courseCompleted, setCourseCompleted] = useState<boolean>(isCompleted);
  const [certificateId, setCertificateId] = useState<string | null>(initialCertId || null);

  // UI tabs state: 'overview' | 'curriculum' | 'discussions' | 'resources'
  const [activeTab, setActiveTab] = useState<"overview" | "curriculum" | "discussions" | "resources">("overview");

  // Certificate Modal state
  const [showCertificate, setShowCertificate] = useState(false);

  // Discussions state
  const [discussions, setDiscussions] = useState<any[]>(initialDiscussions || []);
  const [newQuestionTitle, setNewQuestionTitle] = useState("");
  const [newQuestionContent, setNewQuestionContent] = useState("");
  const [submittingQuestion, setSubmittingQuestion] = useState(false);

  // Find active lesson object
  const activeLesson = allLessons.find((l) => l.id === activeLessonId) || allLessons[0] || {
    id: "preview",
    title: course.title,
    duration: "10:00",
    videoUrl: course.videoUrl || "https://www.youtube.com/embed/wm5gMKuwSYk",
    summary: course.description
  };

  const isCurrentLessonCompleted = completedLessonIds.includes(activeLesson.id);

  // Calculate progress %
  const progressPercent = allLessons.length > 0 
    ? Math.round((completedLessonIds.length / allLessons.length) * 100) 
    : (courseCompleted ? 100 : 0);

  // Handle Mark Lesson Complete
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

  // Handle Post Question
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

  // Convert normal youtube link to embed format if needed
  const getEmbedUrl = (url: string) => {
    if (!url) return "https://www.youtube.com/embed/wm5gMKuwSYk";
    if (url.includes("embed/")) return url;
    if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/");
    if (url.includes("youtu.be/")) return url.replace("youtu.be/", "www.youtube.com/embed/");
    return url;
  };

  // Lesson accessible check
  const isLessonAccessible = isEnrolled || activeLesson.isFreePreview;

  return (
    <div className="space-y-8">
      
      {/* Top Banner Navigation & Progress */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <Link href="/courses" className="hover:text-blue-600 transition-colors">Courses</Link>
            <span>/</span>
            <span className="text-blue-600">{course.category}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{course.title}</h1>
        </div>

        {isEnrolled && (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs font-semibold text-slate-500">Course Progress</div>
              <div className="text-lg font-bold text-slate-900">{progressPercent}% Completed</div>
            </div>
            <div className="w-24 bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
              <div 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {(courseCompleted || progressPercent === 100) && (
              <Button 
                onClick={() => setShowCertificate(true)}
                className="bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-xs"
              >
                <Award className="w-4 h-4 mr-1.5" />
                View Certificate
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Main Classroom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Video Player & Tabs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* VIDEO PLAYER CONTAINER */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl">
            {isLessonAccessible ? (
              <iframe
                src={`${getEmbedUrl(activeLesson.videoUrl)}?autoplay=0&rel=0&modestbranding=1`}
                title={activeLesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-white bg-slate-900/95 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                  <Lock className="w-8 h-8 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">This Lesson is Locked</h3>
                  <p className="text-sm text-slate-400 mt-1 max-w-md">
                    Enroll in this course to get full access to all lectures, project repositories, and certificate.
                  </p>
                </div>
                <div className="w-full max-w-xs">
                  <EnrollButton courseId={course._id} />
                </div>
              </div>
            )}
          </div>

          {/* Active Lesson Controls & Info */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  Currently Playing
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-0.5">{activeLesson.title}</h2>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {activeLesson.duration}</span>
                  {activeLesson.isFreePreview && (
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                      Free Preview
                    </span>
                  )}
                </div>
              </div>

              {isEnrolled && (
                <Button
                  onClick={handleToggleLessonComplete}
                  className={`transition-all font-semibold ${
                    isCurrentLessonCompleted 
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {isCurrentLessonCompleted ? "Lesson Completed" : "Mark as Completed"}
                </Button>
              )}
            </div>

            {activeLesson.summary && (
              <p className="text-sm text-slate-600 pt-2 border-t border-slate-100 leading-relaxed">
                {activeLesson.summary}
              </p>
            )}
          </div>

          {/* Classroom Tabs Navigation */}
          <div className="border-b border-slate-200 flex gap-6 text-sm font-semibold">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-3 transition-colors border-b-2 ${
                activeTab === "overview" 
                  ? "border-blue-600 text-blue-600" 
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Overview & Objectives
            </button>
            <button
              onClick={() => setActiveTab("curriculum")}
              className={`pb-3 transition-colors border-b-2 ${
                activeTab === "curriculum" 
                  ? "border-blue-600 text-blue-600" 
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Full Syllabus
            </button>
            <button
              onClick={() => setActiveTab("discussions")}
              className={`pb-3 transition-colors border-b-2 flex items-center gap-1.5 ${
                activeTab === "discussions" 
                  ? "border-blue-600 text-blue-600" 
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Community Q&A
              <span className="text-xs px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600">
                {discussions.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("resources")}
              className={`pb-3 transition-colors border-b-2 ${
                activeTab === "resources" 
                  ? "border-blue-600 text-blue-600" 
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Resources & Downloads
            </button>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Description */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-4">
                <h3 className="text-lg font-bold text-slate-900">About this Course</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{course.description}</p>
                
                {course.learningOutcomes && course.learningOutcomes.length > 0 && (
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <h4 className="text-sm font-bold text-slate-900">What You Will Master</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {course.learningOutcomes.map((outcome, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Instructor Card */}
              {course.instructor && (
                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 flex items-start gap-4">
                  <img
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    className="w-14 h-14 rounded-full object-cover shadow-sm"
                  />
                  <div>
                    <span className="text-xs font-semibold text-blue-600 uppercase">Instructor</span>
                    <h4 className="text-base font-bold text-slate-900">{course.instructor.name}</h4>
                    <p className="text-xs text-slate-500 mb-2">{course.instructor.role}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{course.instructor.bio}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CURRICULUM */}
          {activeTab === "curriculum" && (
            <div className="space-y-4">
              {course.modules?.map((m, mIdx) => (
                <div key={mIdx} className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-3">
                  <h4 className="text-base font-bold text-slate-900 flex items-center justify-between">
                    <span>{m.title}</span>
                    <span className="text-xs font-normal text-slate-500">{m.lessons.length} Lectures</span>
                  </h4>
                  <div className="space-y-2 pt-2">
                    {m.lessons.map((lesson) => {
                      const isDone = completedLessonIds.includes(lesson.id);
                      return (
                        <div 
                          key={lesson.id} 
                          onClick={() => (isEnrolled || lesson.isFreePreview) && setActiveLessonId(lesson.id)}
                          className={`p-3 rounded-xl flex items-center justify-between transition-colors ${
                            activeLessonId === lesson.id 
                              ? "bg-blue-50 border border-blue-200" 
                              : "hover:bg-slate-50 cursor-pointer border border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <PlayCircle className={`w-4 h-4 ${activeLessonId === lesson.id ? "text-blue-600" : "text-slate-400"}`} />
                            )}
                            <span className="text-sm font-medium text-slate-800">{lesson.title}</span>
                          </div>
                          <span className="text-xs text-slate-500">{lesson.duration}</span>
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
            <div className="space-y-6">
              {/* Ask Question Form */}
              {currentUser ? (
                <form onSubmit={handlePostQuestion} className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-4 shadow-xs">
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    Ask a Question about this Lesson
                  </h4>
                  <Input
                    placeholder="Brief question summary..."
                    value={newQuestionTitle}
                    onChange={(e) => setNewQuestionTitle(e.target.value)}
                    required
                    className="bg-slate-50 border-slate-200 text-sm"
                  />
                  <textarea
                    placeholder="Provide details or paste any code snippets you're having trouble with..."
                    value={newQuestionContent}
                    onChange={(e) => setNewQuestionContent(e.target.value)}
                    required
                    rows={3}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={submittingQuestion} 
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs"
                    >
                      <Send className="w-3.5 h-3.5 mr-1.5" />
                      {submittingQuestion ? "Posting..." : "Post Question"}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="p-4 rounded-xl bg-slate-100 text-center text-xs text-slate-600">
                  <Link href="/login" className="text-blue-600 font-semibold underline">Sign in</Link> to participate in the classroom discussion.
                </div>
              )}

              {/* Discussions List */}
              <div className="space-y-4">
                {discussions.length === 0 ? (
                  <p className="text-center py-8 text-sm text-slate-500">No discussions posted yet. Be the first to start a conversation!</p>
                ) : (
                  discussions.map((d: any, idx: number) => (
                    <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={d.userAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"}
                            alt={d.userName}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-800">{d.userName}</span>
                            <span className="text-[10px] ml-2 px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                              {d.userRole || "Student"}
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {new Date(d.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900">{d.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{d.content}</p>

                      {/* Replies */}
                      {d.replies && d.replies.length > 0 && (
                        <div className="mt-3 pl-4 border-l-2 border-blue-500 space-y-3 pt-2">
                          {d.replies.map((r: any, rIdx: number) => (
                            <div key={rIdx} className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-blue-900">{r.userName}</span>
                                {r.userRole === "Instructor" && (
                                  <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-semibold">
                                    Instructor
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-700">{r.content}</p>
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
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Course Materials & Downloads</h3>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800">Complete Course Notes & Cheat Sheet (.PDF)</h4>
                      <p className="text-xs text-slate-500">Summary formulas, key shortcuts, and architectural diagrams</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs">
                    <Download className="w-3.5 h-3.5 mr-1" /> Download
                  </Button>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ExternalLink className="w-5 h-5 text-indigo-600" />
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800">Official GitHub Starter & Solution Repository</h4>
                      <p className="text-xs text-slate-500">Fully configured branches for every module and checkpoint</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild className="text-xs">
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
        <div className="space-y-6">
          <Card className="rounded-2xl border-slate-200/80 shadow-xs overflow-hidden sticky top-20">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Course Curriculum</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {completedLessonIds.length} of {allLessons.length} lessons completed
                </p>
              </div>
              <span className="text-xs font-bold text-blue-400 bg-blue-950 px-2.5 py-1 rounded-md border border-blue-800">
                {progressPercent}%
              </span>
            </div>

            <CardContent className="p-0 divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
              {course.modules?.map((module, mIdx) => (
                <div key={mIdx} className="p-4 space-y-2">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {module.title}
                  </div>
                  <div className="space-y-1">
                    {module.lessons.map((lesson) => {
                      const isActive = activeLessonId === lesson.id;
                      const isCompleted = completedLessonIds.includes(lesson.id);
                      const isUnlocked = isEnrolled || lesson.isFreePreview;

                      return (
                        <div
                          key={lesson.id}
                          onClick={() => isUnlocked && setActiveLessonId(lesson.id)}
                          className={`p-3 rounded-xl flex items-center justify-between text-xs transition-all ${
                            isActive
                              ? "bg-blue-600 text-white font-semibold shadow-xs"
                              : isUnlocked
                              ? "hover:bg-slate-100 cursor-pointer text-slate-700"
                              : "opacity-60 cursor-not-allowed text-slate-400"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate pr-2">
                            {isCompleted ? (
                              <CheckCircle2 className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-emerald-600"}`} />
                            ) : isUnlocked ? (
                              <PlayCircle className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-blue-600"}`} />
                            ) : (
                              <Lock className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                            )}
                            <span className="truncate">{lesson.title}</span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {lesson.isFreePreview && !isEnrolled && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                                Free
                              </span>
                            )}
                            <span className={isActive ? "text-blue-100" : "text-slate-400"}>{lesson.duration}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </CardContent>

            {!isEnrolled && (
              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <EnrollButton courseId={course._id} />
              </div>
            )}
          </Card>
        </div>

      </div>

      {/* VERIFIABLE DIGITAL CERTIFICATE MODAL */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
            
            {/* Close button */}
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Printable Certificate Content */}
            <div id="certificate-print-area" className="p-8 sm:p-12 text-center bg-radial from-amber-50/50 via-white to-slate-50 border-8 border-double border-amber-600/30 m-4 rounded-2xl relative">
              
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
                This is proudly presented to
              </p>
              
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-700 underline decoration-amber-500 underline-offset-8 my-3">
                {currentUser?.name || "Distinguished Student"}
              </div>

              <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed mt-4">
                For successfully fulfilling all lectures, practical assignments, and hands-on milestones in
              </p>

              <div className="text-xl font-bold text-slate-900 mt-1 mb-6">
                {course.title}
              </div>

              <div className="grid grid-cols-2 gap-8 max-w-md mx-auto pt-6 border-t border-slate-200 text-xs">
                <div>
                  <div className="font-serif italic text-base text-slate-800">
                    {course.instructor?.name || "Sarah Chen"}
                  </div>
                  <div className="text-slate-400 mt-0.5">Instructor & Verified Reviewer</div>
                </div>
                <div>
                  <div className="font-mono font-semibold text-slate-700">
                    {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="text-slate-400 mt-0.5">Issue Date</div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Certificate ID: <strong className="font-mono text-slate-700">{certificateId || "CERT-VERIFIED-2026"}</strong></span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Authenticity Verified
                </span>
              </div>

            </div>

            {/* Modal Actions */}
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
                onClick={() => setShowCertificate(false)}
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
