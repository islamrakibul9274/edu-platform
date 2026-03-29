import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, LockKeyhole } from "lucide-react";
import { connectToDatabase } from "@/lib/mongodb";
import Course from "@/models/Course";
import User from "@/models/User";
import { notFound, redirect } from "next/navigation";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import EnrollButton from "@/components/EnrollButton";
import MarkCompleteButton from "@/components/MarkCompleteButton";

export default async function CourseDetailsPage({ params }: { params: Promise<{ courseId: string }> }) {
  // 1. Ensure they are logged in
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const { courseId } = await params;

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    notFound();
  }

  // 2. Connect to DB and fetch the specific course
  await connectToDatabase();
  const course = await Course.findById(courseId);

  if (!course) {
    notFound();
  }

  // 3. ENROLLMENT LOGIC: Fetch the current user to see their enrolled courses
  const currentUser = await User.findById(session.user.id);

  // 4. Check if this specific course ID exists in their enrolledCourses array
  // const isEnrolled = currentUser?.enrolledCourses?.includes(courseId);
  // We use .some() to check if any of the IDs, when converted to a string, match our URL courseId!
  const isEnrolled = currentUser?.enrolledCourses?.some(id => id.toString() === courseId);

  // Add this new line to check if they finished it:
  const isCompleted = currentUser?.completedCourses?.some(id => id.toString() === courseId);
  return (
    <main className="max-w-7xl mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8">

      {/* Left Column: The Video Area */}
      <div className="w-full lg:w-2/3 space-y-6">

        {/* CONDITIONAL UI: Show Video OR Show Locked State */}
        {isEnrolled ? (
          <div className="aspect-video bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg overflow-hidden relative">
            <div className="absolute inset-0 bg-blue-900/20 mix-blend-overlay"></div>
            <PlayCircle className="w-20 h-20 text-blue-500 opacity-80 hover:opacity-100 transition-opacity cursor-pointer z-10" />
            <span className="absolute bottom-4 left-4 text-sm font-medium">Ready to play: {course.title}</span>
          </div>
        ) : (
          <div className="aspect-video bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-500 shadow-sm p-6 text-center">
            <LockKeyhole className="w-16 h-16 text-slate-300 mb-4" />
            <h2 className="text-2xl font-bold text-slate-700 mb-2">Course Locked</h2>
            <p className="max-w-md mb-4">You need to enroll in this course to access the video lectures and premium materials.</p>
            <div className="w-full max-w-sm">
              <EnrollButton courseId={courseId} />
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-slate-900">{course.title}</h1>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold">
              {course.level}
            </span>
          </div>
          <p className="text-slate-600 mt-2 text-lg">
            {course.description}
          </p>
        </div>
      </div>

      {/* Right Column: Course Content Sidebar */}
      <div className="w-full lg:w-1/3">
        <Card className="border-slate-200 shadow-sm sticky top-24">
          <CardHeader className="bg-slate-50 border-b border-slate-100 rounded-t-xl">
            <CardTitle className="text-lg">Course Content</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-slate-100">
              <li className="p-4 bg-blue-50 border-l-4 border-blue-600 flex justify-between items-center opacity-100 transition-opacity">
                <span className="font-medium text-blue-900">1. Introduction to {course.title}</span>
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">5:20</span>
              </li>
              <li className={`p-4 flex justify-between items-center transition-colors ${isEnrolled ? "text-slate-600 hover:bg-slate-50 cursor-pointer" : "text-slate-400 opacity-70"}`}>
                <span>2. Environment Setup</span>
                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">12:45</span>
              </li>
            </ul>
            <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-xl">
              {isEnrolled ? (
                <MarkCompleteButton courseId={courseId} isCompleted={isCompleted} />
              ) : (
                <Button disabled className="w-full bg-slate-300 text-white">
                  Enroll to start
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

    </main>
  );
}