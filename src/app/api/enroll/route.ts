import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    // 1. Ensure they are actually logged in
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Grab the course ID they want to enroll in
    const { courseId } = await req.json();
    await connectToDatabase();

    // 3. Update the User in MongoDB. 
    // We use $addToSet instead of $push so they can't accidentally enroll twice!
    await User.findByIdAndUpdate(session.user.id, {
      $addToSet: { enrolledCourses: courseId }
    });

    return NextResponse.json({ message: "Successfully enrolled!" }, { status: 200 });
    
  } catch (error) {
    console.error("Enrollment Error:", error);
    return NextResponse.json({ message: "Enrollment failed" }, { status: 500 });
  }
}