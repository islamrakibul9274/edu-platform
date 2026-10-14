import { connectToDatabase } from "@/lib/mongodb";
import Course from "@/models/Course";
import User from "@/models/User";
import Discussion from "@/models/Discussion";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import CourseClassroom from "@/components/CourseClassroom";

export default async function CourseDetailsPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    notFound();
  }

  await connectToDatabase();
  const session = await getServerSession(authOptions);

  const rawCourse = await Course.findById(courseId).lean();
  if (!rawCourse) {
    notFound();
  }

  // Fetch discussions
  const rawDiscussions = await Discussion.find({ courseId }).sort({ createdAt: -1 }).lean();

  let isEnrolled = false;
  let isCompleted = false;
  let completedLessonIds: string[] = [];
  let certificateId: string | null = null;
  let currentUser = null;

  if (session && session.user && (session.user as any).id) {
    const user = await User.findById((session.user as any).id).lean();
    if (user) {
      currentUser = {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      };

      isEnrolled = (user.enrolledCourses || []).some(
        (id: any) => id.toString() === courseId
      );

      isCompleted = (user.completedCourses || []).some(
        (id: any) => id.toString() === courseId
      );

      // Extract completed lessons for this course
      completedLessonIds = (user.completedLessons || [])
        .filter((item: any) => item.courseId === courseId)
        .map((item: any) => item.lessonId);

      // Extract certificate ID if present
      const cert = (user.certificates || []).find((c: any) => c.courseId === courseId);
      if (cert) {
        certificateId = cert.certificateId;
      }
    }
  }

  // Serialize course data for client component
  const course = {
    _id: rawCourse._id.toString(),
    title: rawCourse.title,
    description: rawCourse.description,
    level: rawCourse.level,
    category: rawCourse.category || "Web Development",
    thumbnail: rawCourse.thumbnail || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
    duration: rawCourse.duration || "6h 30m",
    rating: rawCourse.rating || 4.8,
    reviewCount: rawCourse.reviewCount || 120,
    videoUrl: rawCourse.videoUrl,
    instructor: rawCourse.instructor,
    learningOutcomes: rawCourse.learningOutcomes || [],
    prerequisites: rawCourse.prerequisites || [],
    tags: rawCourse.tags || [],
    modules: (rawCourse.modules || []).map((m: any) => ({
      title: m.title,
      lessons: (m.lessons || []).map((l: any) => ({
        id: l.id,
        title: l.title,
        duration: l.duration,
        videoUrl: l.videoUrl,
        summary: l.summary,
        isFreePreview: Boolean(l.isFreePreview)
      }))
    }))
  };

  const discussions = rawDiscussions.map((d: any) => ({
    _id: d._id.toString(),
    courseId: d.courseId,
    lessonId: d.lessonId,
    userName: d.userName,
    userRole: d.userRole,
    userAvatar: d.userAvatar,
    title: d.title,
    content: d.content,
    upvotes: d.upvotes || 0,
    createdAt: d.createdAt?.toISOString() || new Date().toISOString(),
    replies: (d.replies || []).map((r: any) => ({
      userName: r.userName,
      userRole: r.userRole,
      userAvatar: r.userAvatar,
      content: r.content,
      createdAt: r.createdAt?.toISOString() || new Date().toISOString()
    }))
  }));

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <CourseClassroom
        course={course}
        isEnrolled={isEnrolled}
        isCompleted={isCompleted}
        completedLessonIds={completedLessonIds}
        initialDiscussions={discussions}
        currentUser={currentUser}
        certificateId={certificateId}
      />
    </main>
  );
}