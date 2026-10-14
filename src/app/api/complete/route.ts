import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ message: "Unauthorized. Please log in." }, { status: 401 });
    }

    const { courseId } = await req.json();
    if (!courseId) {
      return NextResponse.json({ message: "Missing courseId." }, { status: 400 });
    }

    await connectToDatabase();

    const userId = (session.user as any).id;
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // STRICT SECURITY: Must be enrolled to complete track
    const isEnrolled = (user.enrolledCourses || []).some(
      (id: any) => id.toString() === courseId
    );
    if (!isEnrolled) {
      return NextResponse.json(
        { message: "Access denied: You must be enrolled in this track to mark it as completed." },
        { status: 403 }
      );
    }

    await User.findByIdAndUpdate(userId, {
      $addToSet: { completedCourses: courseId }
    });

    return NextResponse.json({ message: "Track marked as completed!" }, { status: 200 });
    
  } catch (error) {
    console.error("Completion Error:", error);
    return NextResponse.json({ message: "Failed to update completion status." }, { status: 500 });
  }
}