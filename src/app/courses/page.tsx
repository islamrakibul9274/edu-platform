import { connectToDatabase } from "@/lib/mongodb";
import Course from "@/models/Course";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import CourseCatalog from "@/components/CourseCatalog";
import { Sparkles } from "lucide-react";

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

  // Format courses for client component serialization
  const courses = rawCourses.map((c: any) => ({
    _id: c._id.toString(),
    title: c.title,
    description: c.description,
    level: c.level,
    category: c.category || "Web Development",
    thumbnail: c.thumbnail || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
    duration: c.duration || "6h 30m",
    rating: c.rating || 4.8,
    reviewCount: c.reviewCount || 120,
    enrolledCount: c.enrolledCount || 500,
    instructor: c.instructor,
    modules: c.modules || []
  }));

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header Banner */}
      <div className="mb-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Industry Curricula</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Explore Production Courses
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl">
          Learn modern full-stack development, applied machine learning, cloud architecture, and cross-platform engineering with step-by-step guidance.
        </p>
      </div>

      {/* Interactive Catalog Component */}
      <CourseCatalog 
        initialCourses={courses} 
        userEnrolledIds={userEnrolledIds} 
        userCompletedIds={userCompletedIds} 
      />

    </main>
  );
}