import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await req.json();
    await connectToDatabase();

    // Use $addToSet so they can't mark it completed multiple times
    await User.findByIdAndUpdate(session.user.id, {
      $addToSet: { completedCourses: courseId }
    });

    return NextResponse.json({ message: "Course marked as completed!" }, { status: 200 });
    
  } catch (error) {
    console.error("Completion Error:", error);
    return NextResponse.json({ message: "Failed to update status" }, { status: 500 });
  }
}