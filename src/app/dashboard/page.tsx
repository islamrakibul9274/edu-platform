import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Course from "@/models/Course";
import StudentDashboard from "@/components/StudentDashboard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !(session.user as any).id) {
    redirect("/login?callbackUrl=/dashboard");
  }

  await connectToDatabase();

  const rawUser = await User.findById((session.user as any).id)
    .populate({
      path: "enrolledCourses",
      model: Course
    })
    .lean();

  if (!rawUser) {
    redirect("/login");
  }

  const rawAllCourses = await Course.find({}).lean();

  // Deep sanitize user and courses to guarantee plain objects
  const currentUser = JSON.parse(JSON.stringify(rawUser));
  const allCourses = JSON.parse(JSON.stringify(rawAllCourses));

  const enrolledCourses = (currentUser.enrolledCourses || []).map((c: any) => ({
    _id: String(c._id),
    title: String(c.title || ""),
    description: String(c.description || ""),
    level: String(c.level || "Beginner"),
    category: String(c.category || "Web Development"),
    thumbnail: String(c.thumbnail || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80"),
    duration: String(c.duration || "6h 30m"),
    modules: (c.modules || []).map((m: any) => ({
      title: String(m.title || ""),
      lessons: (m.lessons || []).map((l: any) => ({
        id: String(l.id || ""),
        title: String(l.title || ""),
        duration: String(l.duration || "10:00"),
        videoUrl: String(l.videoUrl || "")
      }))
    }))
  }));

  const enrolledIds = enrolledCourses.map((c: any) => c._id);
  const completedCourseIds = (currentUser.completedCourses || []).map((id: any) => String(id));

  const recommendedCourses = allCourses
    .filter((c: any) => !enrolledIds.includes(String(c._id)))
    .map((c: any) => ({
      _id: String(c._id),
      title: String(c.title || ""),
      description: String(c.description || ""),
      level: String(c.level || "Beginner"),
      category: String(c.category || "Engineering"),
      thumbnail: String(c.thumbnail || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80"),
      duration: String(c.duration || "6h 30m")
    }));

  const completedLessons = (currentUser.completedLessons || []).map((cl: any) => ({
    courseId: String(cl.courseId),
    lessonId: String(cl.lessonId)
  }));

  const certificates = (currentUser.certificates || []).map((cert: any) => ({
    courseId: String(cert.courseId),
    courseTitle: String(cert.courseTitle),
    issueDate: String(cert.issueDate || new Date().toISOString()),
    certificateId: String(cert.certificateId)
  }));

  const user = {
    id: String(currentUser._id),
    name: String(currentUser.name || "Student"),
    email: String(currentUser.email || ""),
    streak: currentUser.streak ? { count: Number(currentUser.streak.count || 4) } : { count: 4 }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <StudentDashboard
        user={user}
        enrolledCourses={enrolledCourses}
        completedCourseIds={completedCourseIds}
        completedLessons={completedLessons}
        certificates={certificates}
        recommendedCourses={recommendedCourses}
      />
    </main>
  );
}