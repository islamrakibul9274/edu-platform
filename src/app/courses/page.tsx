import { connectToDatabase } from "@/lib/mongodb";
import Course from "@/models/Course";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import CourseCatalog from "@/components/CourseCatalog";

export default async function CoursesPage() {
  await connectToDatabase();
  const session = await getServerSession(authOptions);

  const rawCourses = await Course.find({}).sort({ createdAt: -1 }).lean();

  let userEnrolledIds: string[] = [];
  let userCompletedIds: string[] = [];

  if (session && session.user && (session.user as any).id) {
    const user = await User.findById((session.user as any).id).lean();
    if (user) {
      userEnrolledIds = (user.enrolledCourses || []).map((id: any) => id.toString());
      userCompletedIds = (user.completedCourses || []).map((id: any) => id.toString());
    }
  }

  // Deep sanitize to guarantee 100% plain objects across Server -> Client boundary
  const plainCourses = JSON.parse(JSON.stringify(rawCourses)).map((c: any) => ({
    _id: String(c._id),
    title: String(c.title || ""),
    description: String(c.description || ""),
    level: String(c.level || "Beginner"),
    category: String(c.category || "Web Development"),
    thumbnail: String(c.thumbnail || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80"),
    duration: String(c.duration || "6h 30m"),
    rating: Number(c.rating || 4.8),
    reviewCount: Number(c.reviewCount || 120),
    enrolledCount: Number(c.enrolledCount || 500),
    instructor: c.instructor ? {
      name: String(c.instructor.name || "Senior Instructor"),
      role: String(c.instructor.role || "Architect"),
      avatar: String(c.instructor.avatar || "")
    } : undefined,
    modules: (c.modules || []).map((m: any) => ({
      title: String(m.title || ""),
      lessons: (m.lessons || []).map((l: any) => ({
        id: String(l.id || ""),
        title: String(l.title || ""),
        duration: String(l.duration || "10:00"),
        videoUrl: String(l.videoUrl || ""),
        summary: String(l.summary || ""),
        isFreePreview: Boolean(l.isFreePreview)
      }))
    }))
  }));

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 space-y-2">
        <span className="mono-tag text-zinc-500">ACADEMIC DIRECTORY</span>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Curricula & Tracks
        </h1>
        <p className="text-sm text-zinc-400 max-w-xl">
          Structured production engineering paths spanning systems architecture, vision models, distributed clusters, and native mobile clients.
        </p>
      </div>

      <CourseCatalog 
        initialCourses={plainCourses} 
        userEnrolledIds={JSON.parse(JSON.stringify(userEnrolledIds))} 
        userCompletedIds={JSON.parse(JSON.stringify(userCompletedIds))} 
      />
    </main>
  );
}