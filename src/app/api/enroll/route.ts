import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Course from "@/models/Course";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ message: "Unauthorized. Please log in to enroll." }, { status: 401 });
    }

    const { courseId } = await req.json();
    if (!courseId) {
      return NextResponse.json({ message: "Course ID is required." }, { status: 400 });
    }

    await connectToDatabase();

    const course = await Course.findById(courseId).lean();
    if (!course) {
      return NextResponse.json({ message: "Curriculum not found." }, { status: 404 });
    }

    const userId = (session.user as any).id;
    await User.findByIdAndUpdate(userId, {
      $addToSet: { enrolledCourses: courseId }
    });

    // Deep sanitize course modules to provide plain objects with verified video URLs upon enrollment
    const plainCourse = JSON.parse(JSON.stringify(course));
    const unlockedModules = (plainCourse.modules || []).map((m: any) => ({
      title: String(m.title || ""),
      lessons: (m.lessons || []).map((l: any) => ({
        id: String(l.id || ""),
        title: String(l.title || ""),
        duration: String(l.duration || "10:00"),
        videoUrl: String(l.videoUrl || ""),
        summary: String(l.summary || ""),
        isFreePreview: false
      }))
    }));

    return NextResponse.json({ 
      success: true, 
      message: "Successfully enrolled in track! Video streaming unlocked.",
      modules: unlockedModules,
      videoUrl: plainCourse.videoUrl || ""
    }, { status: 200 });
    
  } catch (error) {
    console.error("Enrollment Error:", error);
    return NextResponse.json({ message: "Enrollment transaction failed." }, { status: 500 });
  }
}