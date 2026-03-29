import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // UPDATE: Explicitly check for session, session.user, and the custom id
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await req.json();
    await connectToDatabase();

    // UPDATE: Safely cast the ID
    await User.findByIdAndUpdate((session.user as any).id, {
      $addToSet: { completedCourses: courseId }
    });

    return NextResponse.json({ message: "Course marked as completed!" }, { status: 200 });
    
  } catch (error) {
    console.error("Completion Error:", error);
    return NextResponse.json({ message: "Failed to update status" }, { status: 500 });
  }
}