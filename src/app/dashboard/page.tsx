import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Trophy, Clock, PlayCircle } from "lucide-react";
import Link from "next/link";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Course from "@/models/Course";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  await connectToDatabase();

  const currentUser = await User.findById((session.user as any).id).populate({
    path: "enrolledCourses",
    model: Course
  });

  const user = session.user;
  const enrolledCourses = currentUser?.enrolledCourses || [];

  // NEW: Grab the completed courses array so we can count it!
  const completedCourses = currentUser?.completedCourses || [];

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 space-y-8">

      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user?.name}</h1>
            <p className="text-slate-500 mt-1">{user?.email}</p>
          </div>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
          <Link href="/courses">Explore New Courses</Link>
        </Button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Enrolled Courses</CardTitle>
            <Clock className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{enrolledCourses.length}</div>
            <p className="text-xs text-slate-500 mt-1">Keep up the great work!</p>
          </CardContent>
        </Card>

        {/* UPDATED: Dynamically count the completed courses! */}
        <Card className={`border-slate-200 shadow-sm transition-all ${completedCourses.length > 0 ? 'bg-amber-50/30 border-amber-200' : ''}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Completed Courses</CardTitle>
            <Trophy className={`w-4 h-4 ${completedCourses.length > 0 ? 'text-amber-500' : 'text-slate-400'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{completedCourses.length}</div>
            <p className="text-xs text-slate-500 mt-1">
              {completedCourses.length > 0 ? "You earned a new certificate!" : "Finish a course to earn a trophy."}
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm opacity-60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Study Hours</CardTitle>
            <BookOpen className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{completedCourses.length * 2.5}</div>
            <p className="text-xs text-slate-500 mt-1">Estimated hours based on completions.</p>
          </CardContent>
        </Card>
      </div>

      {/* Dynamic Enrolled Courses Grid */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Learning Journey</h2>

        {enrolledCourses.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl">
            <h3 className="text-xl font-semibold text-slate-700 mb-2">You haven't enrolled in any courses yet!</h3>
            <p className="text-slate-500 mb-6">Head over to the course catalog to start learning.</p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/courses">Browse Catalog</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course: any) => {
              // Check if this specific mapped course is also in the completed array
              const isFinished = completedCourses.some((id: any) => id.toString() === course._id.toString());

              return (
                <Card key={course._id.toString()} className="border-slate-200 shadow-sm flex flex-col relative overflow-hidden">
                  {/* Small visual indicator if the course is done */}
                  {isFinished && (
                    <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg z-10">
                      COMPLETED
                    </div>
                  )}

                  <CardHeader>
                    <CardTitle className="text-lg text-blue-600 line-clamp-1 pr-6">{course.title}</CardTitle>
                    <CardDescription className="text-slate-500 mt-1 line-clamp-2">{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-grow justify-end mt-4">
                    <div className="flex justify-between items-center mb-4 text-xs font-medium text-slate-500">
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">{course.level}</span>
                    </div>
                    <Button asChild variant={isFinished ? "secondary" : "outline"} className={`w-full ${isFinished ? 'bg-slate-100' : 'border-blue-200 hover:bg-blue-50 text-blue-700'}`}>
                      <Link href={`/courses/${course._id.toString()}`}>
                        <PlayCircle className="w-4 h-4 mr-2" /> {isFinished ? "Review Course" : "Resume Course"}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

    </main>
  );
}