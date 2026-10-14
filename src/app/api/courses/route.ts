import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Course from '@/models/Course';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json(
        { message: 'Unauthorized. Please sign in to access course data.' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    
    const user = await User.findById((session.user as any).id).lean();
    const enrolledIds = (user?.enrolledCourses || []).map((id: any) => id.toString());

    const rawCourses = await Course.find({}).lean();
    const plainCourses = JSON.parse(JSON.stringify(rawCourses)).map((c: any) => {
      const isEnrolled = enrolledIds.includes(String(c._id));
      return {
        ...c,
        _id: String(c._id),
        // Only disclose stream URLs if user is enrolled
        videoUrl: isEnrolled ? c.videoUrl : undefined,
        modules: (c.modules || []).map((m: any) => ({
          title: m.title,
          lessons: (m.lessons || []).map((l: any) => ({
            id: l.id,
            title: l.title,
            duration: l.duration,
            summary: l.summary,
            videoUrl: isEnrolled ? l.videoUrl : undefined,
            isFreePreview: false
          }))
        }))
      };
    });
    
    return NextResponse.json({ success: true, data: plainCourses });
    
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch courses' }, 
      { status: 500 }
    );
  }
}