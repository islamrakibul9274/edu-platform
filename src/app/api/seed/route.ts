import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Course from '@/models/Course';

export async function POST() {
  try {
    await connectToDatabase();

    // Clear out any old test data to start fresh
    await Course.deleteMany({});

    // Our dummy data
    const dummyCourses = [
      {
        title: "Next.js 15 & React Mastery",
        description: "Build blazing fast, production-ready web applications from scratch.",
        level: "Beginner",
        videoUrl: "https://example.com/nextjs-intro.mp4"
      },
      {
        title: "Computer Vision with YOLOv8",
        description: "Train advanced object detection models for fire and smoke recognition.",
        level: "Advanced",
        videoUrl: "https://example.com/yolov8-training.mp4"
      },
      {
        title: "Data Science Portfolio Building",
        description: "Showcase your Python, machine learning, and full-stack projects effectively.",
        level: "Intermediate",
        videoUrl: "https://example.com/portfolio-guide.mp4"
      }
    ];

    // Inject into MongoDB
    await Course.insertMany(dummyCourses);

    return NextResponse.json({ success: true, message: "Database seeded successfully!" });
    
  } catch (error) {
    console.error("Seeding Error:", error);
    return NextResponse.json(
      { success: false, message: 'Failed to seed database' }, 
      { status: 500 }
    );
  }
}