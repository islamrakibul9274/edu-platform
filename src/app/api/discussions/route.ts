import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Discussion from "@/models/Discussion";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json({ message: "Course ID is required" }, { status: 400 });
    }

    await connectToDatabase();
    const discussions = await Discussion.find({ courseId }).sort({ createdAt: -1 });

    return NextResponse.json({ discussions }, { status: 200 });
  } catch (error) {
    console.error("Discussions GET error:", error);
    return NextResponse.json({ message: "Failed to fetch discussions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { courseId, lessonId, title, content, parentDiscussionId } = body;

    await connectToDatabase();

    const userName = session.user.name || "Anonymous Learner";
    const userRole = (session.user as any).role === "instructor" ? "Instructor" : "Student";
    const userAvatar = (session.user as any).avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userName)}`;

    // If replying to existing discussion
    if (parentDiscussionId) {
      const discussion = await Discussion.findById(parentDiscussionId);
      if (!discussion) {
        return NextResponse.json({ message: "Discussion not found" }, { status: 404 });
      }

      discussion.replies.push({
        userName,
        userRole,
        userAvatar,
        content,
        createdAt: new Date()
      });

      await discussion.save();
      return NextResponse.json({ success: true, discussion }, { status: 200 });
    }

    // Creating new discussion question
    if (!courseId || !title || !content) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const newDiscussion = await Discussion.create({
      courseId,
      lessonId,
      userName,
      userRole,
      userAvatar,
      title,
      content,
      upvotes: 0,
      replies: []
    });

    return NextResponse.json({ success: true, discussion: newDiscussion }, { status: 201 });
  } catch (error) {
    console.error("Discussions POST error:", error);
    return NextResponse.json({ message: "Failed to post discussion" }, { status: 500 });
  }
}
