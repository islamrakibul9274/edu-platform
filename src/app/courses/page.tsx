import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { connectToDatabase } from "@/lib/mongodb";
import Course from "@/models/Course";

export default async function CoursesPage() {
    // 1. Connect directly to MongoDB
    await connectToDatabase();
    const courses = await Course.find({});

    return (
        <main className="max-w-7xl mx-auto px-4 py-16">
            <div className="mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Available Courses</h1>
                <p className="text-lg text-slate-600 mt-2">Level up your engineering skills today.</p>
            </div>

            {/* The Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 2. Map over the real MongoDB data */}
                {courses.map((course) => (
                    <Card key={course._id.toString()} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-xl text-blue-600">{course.title}</CardTitle>
                            <CardDescription className="text-slate-500 mt-1">{course.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col flex-grow justify-end mt-4">
                            <div className="flex justify-between items-center mb-4 text-sm font-medium text-slate-700">
                                <span>Level:</span>
                                <span className="bg-slate-100 px-2 py-1 rounded-md">{course.level}</span>
                            </div>
                            
                            {/* 3. The perfectly wired Shadcn + Next.js Link */}
                            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                <Link href={`/courses/${course._id.toString()}`}>
                                    View Course
                                </Link>
                            </Button>
                            
                        </CardContent>
                    </Card>
                ))}
            </div>
        </main>
    );
}