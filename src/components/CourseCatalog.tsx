"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  Star, 
  Clock, 
  BookOpen, 
  ArrowRight, 
  Check, 
  Layers, 
  Command, 
  SlidersHorizontal 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
      
      {/* 2026 Technical Filter Command Console */}
      <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        
        {/* Search & Sort row */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative w-full md:flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search by track name, technology, or instructor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 bg-zinc-950/80 border-zinc-800 focus:border-zinc-700 text-xs rounded-lg text-zinc-200 placeholder:text-zinc-500"
            />
            {searchTerm ? (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-zinc-400 hover:text-zinc-200 bg-zinc-800 px-1.5 py-0.5 rounded"
              >
                ESC
              </button>
            ) : (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-zinc-500 border border-zinc-800 px-1.5 py-0.5 rounded pointer-events-none">
                ⌘K
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto self-start md:self-auto">
            <span className="mono-tag text-zinc-500 whitespace-nowrap">SORT</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-10 px-3 rounded-lg bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-zinc-700"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="lessons">Lesson Density</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-md text-xs transition-all ${
                selectedCategory === cat
                  ? "bg-zinc-100 text-zinc-950 font-semibold"
                  : "bg-zinc-950/60 text-zinc-400 border border-zinc-800 hover:text-zinc-200 hover:bg-zinc-800/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Level Filters */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-850/80 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="mono-tag text-zinc-500 mr-1.5">DIFFICULTY</span>
            {levels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-2.5 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  selectedLevel === lvl
                    ? "bg-zinc-800 text-zinc-100 border border-zinc-700"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <span className="mono-tag text-zinc-500">
            {filteredCourses.length} {filteredCourses.length === 1 ? "RESULT" : "RESULTS"}
          </span>
        </div>

      </div>

      {/* Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-20 rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 p-8 space-y-4">
          <SlidersHorizontal className="w-8 h-8 text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-zinc-200">No matching curricula found</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Try adjusting your search query or reset the filter settings.
          </p>
          <Button 
            onClick={() => { setSearchTerm(""); setSelectedCategory("All"); setSelectedLevel("All"); }}
            size="sm"
            className="bg-zinc-100 text-zinc-950 hover:bg-zinc-200 text-xs"
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const isEnrolled = userEnrolledIds.includes(course._id.toString());
            const isCompleted = userCompletedIds.includes(course._id.toString());

            const totalLessons = course.modules?.reduce(
              (acc, m) => acc + (m.lessons?.length || 0), 0
            ) || 0;

            const levelDot = 
              course.level === 'Beginner' ? 'bg-emerald-400' :
              course.level === 'Intermediate' ? 'bg-amber-400' : 'bg-sky-400';

            return (
              <div 
                key={course._id.toString()}
                className="obsidian-card rounded-xl overflow-hidden flex flex-col justify-between group"
              >
                {/* Thumbnail Image */}
                <div>
                  <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
                    <img
                      src={course.thumbnail || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80"}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300 grayscale-20 contrast-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111114] via-transparent to-transparent" />

                    {/* Level Pill */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-950/80 border border-zinc-800 text-zinc-300 mono-tag">
                      <span className={`w-1.5 h-1.5 rounded-full ${levelDot}`}></span>
                      {course.level}
                    </div>

                    {/* Status Pill */}
                    {isCompleted ? (
                      <span className="absolute top-3 right-3 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/90 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                        <Check className="w-3 h-3" /> COMPLETED
                      </span>
                    ) : isEnrolled ? (
                      <span className="absolute top-3 right-3 text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900/90 text-zinc-300 border border-zinc-700">
                        ENROLLED
                      </span>
                    ) : null}

                    {/* Category */}
                    <span className="absolute bottom-3 left-3 text-zinc-300 mono-tag bg-zinc-950/80 px-2 py-0.5 rounded border border-zinc-850">
                      {course.category}
                    </span>

                    {/* Rating */}
                    <span className="absolute bottom-3 right-3 text-zinc-300 mono-tag flex items-center gap-1 bg-zinc-950/80 px-2 py-0.5 rounded border border-zinc-850">
                      <Star className="w-3 h-3 text-zinc-300 fill-zinc-300" /> {course.rating || 4.8}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-2">
                    <h3 className="text-base font-bold text-white group-hover:text-zinc-200 transition-colors line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>
                </div>

                {/* Footer strip */}
                <div className="p-5 pt-0 border-t border-zinc-850/80 mt-4 space-y-3">
                  
                  {/* Metadata */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pt-3">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
                      {totalLessons > 0 ? `${totalLessons} Lessons` : "Core Modules"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      {course.duration}
                    </span>
                    <span>{course.enrolledCount || 400}+ enrolled</span>
                  </div>

                  {/* Instructor */}
                  {course.instructor && (
                    <div className="flex items-center gap-2 text-xs text-zinc-300">
                      <img
                        src={course.instructor.avatar}
                        alt="Instructor"
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="text-xs text-zinc-300 font-medium">{course.instructor.name}</span>
                    </div>
                  )}

                  {/* CTA */}
                  <Button 
                    asChild 
                    size="sm"
                    className={`w-full text-xs font-semibold rounded-lg transition-all ${
                      isEnrolled 
                        ? "bg-zinc-100 text-zinc-950 hover:bg-zinc-200" 
                        : "bg-zinc-900 border border-zinc-800 text-zinc-200 hover:bg-zinc-800 hover:text-white"
                    }`}
                  >
                    <Link href={`/courses/${course._id.toString()}`}>
                      {isCompleted ? "Review Curriculum" : isEnrolled ? "Resume Track" : "Inspect Track"}
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Link>
                  </Button>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
