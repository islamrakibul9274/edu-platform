import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Code, LineChart } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-50 text-slate-900 py-24 px-4">

      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-3xl mx-auto mb-20">
        <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl">
          Welcome to the <span className="text-blue-600">Education Platform</span>
        </h1>
        <p className="text-xl text-slate-600">
          Master full-stack development, data science, and modern engineering with our interactive courses.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          {/* Using the new Shadcn Button component */}
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-md px-8">
            Browse Courses
          </Button>
          <Button size="lg" variant="outline" className="text-md px-8">
            Student Login
          </Button>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full">

        {/* Using the new Shadcn Card component */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <Code className="w-10 h-10 text-blue-600 mb-2" />
            <CardTitle>Web Development</CardTitle>
            <CardDescription>Master React, Next.js, and Node.</CardDescription>
          </CardHeader>
          <CardContent className="text-slate-600">
            Build production-ready, full-stack applications from scratch with modern architecture.
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <LineChart className="w-10 h-10 text-blue-600 mb-2" />
            <CardTitle>Computer Vision</CardTitle>
            <CardDescription>Python, YOLOv8, and AI Models.</CardDescription>
          </CardHeader>
          <CardContent className="text-slate-600">
            Train advanced object detection models like fire and smoke recognition systems.
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <BookOpen className="w-10 h-10 text-blue-600 mb-2" />
            <CardTitle>Interactive Learning</CardTitle>
            <CardDescription>Learn by doing, not just watching.</CardDescription>
          </CardHeader>
          <CardContent className="text-slate-600">
            Access quizzes, hands-on assignments, and real-world project builds.
          </CardContent>
        </Card>

      </div>
    </main>
  );
}