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
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { courseId, lessonId } = await req.json();
    if (!courseId || !lessonId) {
      return NextResponse.json({ message: "Missing courseId or lessonId" }, { status: 400 });
    }

    await connectToDatabase();
    const userId = (session.user as any).id;

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if this lesson is already recorded
    const alreadyCompleted = user.completedLessons?.some(
      (item: any) => item.courseId === courseId && item.lessonId === lessonId
    );

    if (!alreadyCompleted) {
      if (!user.completedLessons) user.completedLessons = [];
      user.completedLessons.push({ courseId, lessonId, completedAt: new Date() });
    }

    // Check if the whole course is completed
    const course = await Course.findById(courseId);
    let isCourseCompleted = false;
    let certificateId = null;

    if (course && course.modules && course.modules.length > 0) {
      const allLessons = course.modules.flatMap((m: any) => m.lessons);
      const userCompletedInCourse = user.completedLessons.filter((l: any) => l.courseId === courseId);
      
      const allDone = allLessons.every((lesson: any) =>
        userCompletedInCourse.some((cl: any) => cl.lessonId === lesson.id)
      );

      if (allDone) {
        isCourseCompleted = true;
        
        // Add to completedCourses if not present
        if (!user.completedCourses) user.completedCourses = [];
        const alreadyCourseDone = user.completedCourses.some((id: any) => id.toString() === courseId);
        if (!alreadyCourseDone) {
          user.completedCourses.push(courseId);
        }

        // Issue certificate if not already issued
        if (!user.certificates) user.certificates = [];
        const existingCert = user.certificates.find((c: any) => c.courseId === courseId);
        if (existingCert) {
          certificateId = existingCert.certificateId;
        } else {
          certificateId = `CERT-${courseId.slice(-6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
          user.certificates.push({
            courseId,
            courseTitle: course.title,
            issueDate: new Date(),
            certificateId
          });
        }
      }
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Lesson marked complete",
      isCourseCompleted,
      certificateId
    }, { status: 200 });

  } catch (error) {
    console.error("Complete Lesson Error:", error);
    return NextResponse.json({ message: "Failed to update lesson status" }, { status: 500 });
  }
}
