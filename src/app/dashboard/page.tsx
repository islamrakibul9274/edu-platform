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
    redirect("/login");
  }

  await connectToDatabase();

  const currentUser = await User.findById((session.user as any).id)
    .populate({
      path: "enrolledCourses",
      model: Course
    })
    .lean();

  if (!currentUser) {
    redirect("/login");
  }

  // Fetch all courses for recommendations
  const allCourses = await Course.find({}).lean();

  // Extract enrolled and completed course IDs
  const enrolledCourses = (currentUser.enrolledCourses || []).map((c: any) => ({
    _id: c._id.toString(),
    title: c.title,
    description: c.description,
    level: c.level,
    category: c.category || "Web Development",
    thumbnail: c.thumbnail || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
    duration: c.duration || "6h 30m",
    modules: c.modules || []
  }));

  const enrolledIds = enrolledCourses.map((c: any) => c._id);
  const completedCourseIds = (currentUser.completedCourses || []).map((id: any) => id.toString());

  // Filter recommended courses (courses user is NOT enrolled in)
  const recommendedCourses = allCourses
    .filter((c: any) => !enrolledIds.includes(c._id.toString()))
    .map((c: any) => ({
      _id: c._id.toString(),
      title: c.title,
      description: c.description,
      level: c.level,
      category: c.category || "Engineering",
      thumbnail: c.thumbnail || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
      duration: c.duration || "6h 30m"
    }));

  const completedLessons = (currentUser.completedLessons || []).map((cl: any) => ({
    courseId: cl.courseId,
    lessonId: cl.lessonId
  }));

  const certificates = (currentUser.certificates || []).map((cert: any) => ({
    courseId: cert.courseId,
    courseTitle: cert.courseTitle,
    issueDate: cert.issueDate?.toISOString() || new Date().toISOString(),
    certificateId: cert.certificateId
  }));

  const user = {
    id: currentUser._id.toString(),
    name: currentUser.name,
    email: currentUser.email,
    streak: currentUser.streak || { count: 4 }
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