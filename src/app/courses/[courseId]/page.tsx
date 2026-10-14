import { connectToDatabase } from "@/lib/mongodb";
import Course from "@/models/Course";
import User from "@/models/User";
import Discussion from "@/models/Discussion";
import { notFound, redirect } from "next/navigation";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import CourseClassroom from "@/components/CourseClassroom";

export default async function CourseDetailsPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    notFound();
  }

  const session = await getServerSession(authOptions);

  // STRICT SECURITY: Must be logged in to access any course classroom
  if (!session || !session.user || !(session.user as any).id) {
    redirect(`/login?callbackUrl=/courses/${courseId}`);
  }

  await connectToDatabase();

  const rawCourse = await Course.findById(courseId).lean();
  if (!rawCourse) {
    notFound();
  }

  const user = await User.findById((session.user as any).id).lean();
  if (!user) {
    redirect(`/login?callbackUrl=/courses/${courseId}`);
  }

  const currentUser = {
    id: String(user._id),
    name: String(user.name || "Student"),
    email: String(user.email || "")
  };

  // STRICT ENROLLMENT CHECK
  const isEnrolled = (user.enrolledCourses || []).some(
    (id: any) => id.toString() === courseId
  );

  const isCompleted = (user.completedCourses || []).some(
    (id: any) => id.toString() === courseId
  );

  const completedLessonIds = (user.completedLessons || [])
    .filter((item: any) => item.courseId === courseId)
    .map((item: any) => String(item.lessonId));

  const cert = (user.certificates || []).find((c: any) => c.courseId === courseId);
  const certificateId = cert ? String(cert.certificateId) : null;

  const rawDiscussions = await Discussion.find({ courseId }).sort({ createdAt: -1 }).lean();

  // Deep sanitize course object to ensure zero Mongoose BSON ObjectIds or Buffers are passed to Client Components
  const plainCourseJson = JSON.parse(JSON.stringify(rawCourse));

  // STRICT VIDEO PROTECTION:
  // If the student is NOT enrolled, videoUrl is completely stripped from server props.
  // The client never receives proprietary stream URLs over the wire until enrolled!
  const course = {
    _id: String(plainCourseJson._id),
    title: String(plainCourseJson.title || ""),
    description: String(plainCourseJson.description || ""),
    level: String(plainCourseJson.level || "Beginner"),
    category: String(plainCourseJson.category || "Web Development"),
    thumbnail: String(plainCourseJson.thumbnail || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80"),
    duration: String(plainCourseJson.duration || "6h 30m"),
    rating: Number(plainCourseJson.rating || 4.8),
    reviewCount: Number(plainCourseJson.reviewCount || 120),
    videoUrl: isEnrolled && plainCourseJson.videoUrl ? String(plainCourseJson.videoUrl) : undefined,
    instructor: plainCourseJson.instructor ? {
      name: String(plainCourseJson.instructor.name || "Instructor"),
      role: String(plainCourseJson.instructor.role || "Architect"),
      avatar: String(plainCourseJson.instructor.avatar || ""),
      bio: String(plainCourseJson.instructor.bio || "")
    } : undefined,
    learningOutcomes: (plainCourseJson.learningOutcomes || []).map(String),
    prerequisites: (plainCourseJson.prerequisites || []).map(String),
    tags: (plainCourseJson.tags || []).map(String),
    modules: (plainCourseJson.modules || []).map((m: any) => ({
      title: String(m.title || ""),
      lessons: (m.lessons || []).map((l: any) => ({
        id: String(l.id || ""),
        title: String(l.title || ""),
        duration: String(l.duration || "10:00"),
        // Only provide videoUrl if the student has actively enrolled in this track
        videoUrl: isEnrolled ? String(l.videoUrl || "") : "",
        summary: String(l.summary || ""),
        isFreePreview: false // Zero free preview bypass - must enroll to unlock
      }))
    }))
  };

  const plainDiscussionsJson = JSON.parse(JSON.stringify(rawDiscussions));
  const discussions = plainDiscussionsJson.map((d: any) => ({
    _id: String(d._id),
    courseId: String(d.courseId),
    lessonId: d.lessonId ? String(d.lessonId) : undefined,
    userName: String(d.userName || "Anonymous"),
    userRole: String(d.userRole || "Student"),
    userAvatar: d.userAvatar ? String(d.userAvatar) : undefined,
    title: String(d.title || ""),
    content: String(d.content || ""),
    upvotes: Number(d.upvotes || 0),
    createdAt: String(d.createdAt || new Date().toISOString()),
    replies: (d.replies || []).map((r: any) => ({
      userName: String(r.userName || "User"),
      userRole: String(r.userRole || "Student"),
      userAvatar: r.userAvatar ? String(r.userAvatar) : undefined,
      content: String(r.content || ""),
      createdAt: String(r.createdAt || new Date().toISOString())
    }))
  }));

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <CourseClassroom
        course={course}
        isEnrolled={isEnrolled}
        isCompleted={isCompleted}
        completedLessonIds={JSON.parse(JSON.stringify(completedLessonIds))}
        initialDiscussions={discussions}
        currentUser={currentUser}
        certificateId={certificateId}
      />
    </main>
  );
}