"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  BookOpen, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Layers,
  GraduationCap
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CourseItem {
  _id: string;
  title: string;
  description: string;
  level: string;
  category: string;
  thumbnail: string;
  duration: string;
  rating: number;
  reviewCount: number;
  enrolledCount: number;
  instructor?: {
    name: string;
    role: string;
    avatar: string;
  };
  modules?: {
    title: string;
    lessons: any[];
  }[];
}

interface CourseCatalogProps {
  initialCourses: CourseItem[];
  userEnrolledIds: string[];
  userCompletedIds: string[];
}

export default function CourseCatalog({ initialCourses, userEnrolledIds, userCompletedIds }: CourseCatalogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [sortBy, setSortBy] = useState<"popular" | "rating" | "lessons">("popular");

  const categories = [
    "All",
    "Web Development",
    "Artificial Intelligence",
    "Data Science",
    "Cloud & DevOps",
    "Mobile Development"
  ];

  const levels = ["All", "Beginner", "Intermediate", "Advanced"];

  const filteredCourses = useMemo(() => {
    return initialCourses
      .filter((course) => {
        const matchesSearch = 
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (course.instructor?.name && course.instructor.name.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
        const matchesLevel = selectedLevel === "All" || course.level === selectedLevel;

        return matchesSearch && matchesCategory && matchesLevel;
      })
      .sort((a, b) => {
        if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
        if (sortBy === "popular") return (b.enrolledCount || 0) - (a.enrolledCount || 0);
        if (sortBy === "lessons") {
          const aCount = a.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
          const bCount = b.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
          return bCount - aCount;
        }
        return 0;
      });
  }, [initialCourses, searchTerm, selectedCategory, selectedLevel, sortBy]);

  return (
    <div className="space-y-8">
      
      {/* Search and Filters Bar */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-5">
        
        {/* Top search & sorting row */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full md:flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search courses by title, topic, or instructor name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 h-12 bg-slate-50 border-slate-200 focus:bg-white text-base rounded-xl"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto self-start md:self-auto">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="lessons">Most Lessons</option>
            </select>
          </div>
        </div>

        {/* Category Pills Row */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Filter by Category:</span>
            <span className="text-blue-600 font-semibold">{filteredCourses.length} courses found</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Level Filters */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-medium text-slate-500 mr-2">Level:</span>
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                selectedLevel === lvl
                  ? "bg-slate-900 text-white font-semibold"
                  : "bg-transparent text-slate-600 hover:bg-slate-100"
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300 p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No courses match your criteria</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Try adjusting your search terms, changing the category filter, or clearing the filters to view all courses.
          </p>
          <Button 
            onClick={() => { setSearchTerm(""); setSelectedCategory("All"); setSelectedLevel("All"); }}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => {
            const isEnrolled = userEnrolledIds.includes(course._id.toString());
            const isCompleted = userCompletedIds.includes(course._id.toString());

            const totalLessons = course.modules?.reduce(
              (acc, m) => acc + (m.lessons?.length || 0), 0
            ) || 0;

            const levelBadge = 
              course.level === 'Beginner' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
              course.level === 'Intermediate' ? 'bg-amber-50 text-amber-700 border-amber-200' :
              'bg-purple-50 text-purple-700 border-purple-200';

            return (
              <Card 
                key={course._id.toString()}
                className="group overflow-hidden rounded-2xl border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 flex flex-col bg-white"
              >
                {/* Thumbnail Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                  <img
                    src={course.thumbnail || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80"}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  {/* Level Badge */}
                  <span className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-md border backdrop-blur-md shadow-xs ${levelBadge}`}>
                    {course.level}
                  </span>

                  {/* Enrolled / Completed Pill */}
                  {isCompleted ? (
                    <span className="absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-md bg-emerald-600 text-white shadow-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                    </span>
                  ) : isEnrolled ? (
                    <span className="absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-md bg-blue-600 text-white shadow-xs flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5" /> Enrolled
                    </span>
                  ) : null}

                  {/* Category Pill */}
                  <span className="absolute bottom-3 left-3 text-[11px] font-medium text-white/90 bg-slate-900/80 px-2 py-0.5 rounded">
                    {course.category}
                  </span>

                  {/* Rating */}
                  <span className="absolute bottom-3 right-3 text-[11px] font-semibold text-white/90 flex items-center gap-1 bg-slate-900/80 px-2 py-0.5 rounded">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {course.rating || 4.8}
                    <span className="text-white/60">({course.reviewCount || 100})</span>
                  </span>
                </div>

                {/* Content */}
                <CardContent className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 space-y-4">
                    
                    {/* Meta stats */}
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                        <span>{totalLessons > 0 ? `${totalLessons} Lessons` : "Modular Track"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{course.duration || "6h 30m"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-slate-400" />
                        <span>{course.enrolledCount || 400}+ Students</span>
                      </div>
                    </div>

                    {/* Instructor */}
                    {course.instructor && (
                      <div className="flex items-center gap-2 pt-1 text-xs">
                        <img
                          src={course.instructor.avatar}
                          alt={course.instructor.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="font-medium text-slate-700">{course.instructor.name}</span>
                        <span className="text-slate-400 truncate text-[11px]">• {course.instructor.role}</span>
                      </div>
                    )}

                    {/* CTA Button */}
                    <Button 
                      asChild 
                      className={`w-full text-white font-medium transition-all ${
                        isEnrolled 
                          ? "bg-blue-600 hover:bg-blue-700 shadow-sm" 
                          : "bg-slate-900 hover:bg-blue-600 shadow-sm"
                      }`}
                    >
                      <Link href={`/courses/${course._id.toString()}`}>
                        {isCompleted ? "Review Completed Course" : isEnrolled ? "Continue Learning" : "View Curriculum"}
                        <ArrowRight className="w-4 h-4 ml-1.5" />
                      </Link>
                    </Button>

                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

    </div>
  );
}
