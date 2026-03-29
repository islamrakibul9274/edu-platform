import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Course from '@/models/Course';

export async function GET() {
  try {
    // 1. Connect to the database using the file we made earlier
    await connectToDatabase();
    
    // 2. Ask Mongoose to find all courses
    const courses = await Course.find({});
    
    // 3. Send them back to the frontend
    return NextResponse.json({ success: true, data: courses });
    
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch courses' }, 
      { status: 500 }
    );
  }
}