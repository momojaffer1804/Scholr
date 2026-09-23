"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Plus, BookOpen, Trash2, ArrowRight, Loader2 } from "lucide-react";
import { createCourse, deleteCourse } from "@/lib/actions/courses";
import { useFilterStore } from "@/lib/store/useFilterStore";
import { useToastStore } from "@/lib/store/useToastStore";

interface CourseItem {
  id: string;
  code: string;
  name: string;
  instructor: string;
  credits: number;
  progress: number;
  _count?: {
    assignments: number;
  };
}

export function CourseList({ initialCourses }: { initialCourses: CourseItem[] }) {
  const [courses, setCourses] = React.useState<CourseItem[]>(initialCourses);
  const [prevInitial, setPrevInitial] = React.useState<CourseItem[]>(initialCourses);
  
  // Zustand Filter Store
  const { courseSearch, setCourseSearch } = useFilterStore();
  const { addToast } = useToastStore();

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // Form State
  const [code, setCode] = React.useState("");
  const [name, setName] = React.useState("");
  const [instructor, setInstructor] = React.useState("");
  const [credits, setCredits] = React.useState("3.0");
  const [progress, setProgress] = React.useState("0");

  const [formError, setFormError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  if (prevInitial !== initialCourses) {
    setPrevInitial(initialCourses);
    setCourses(initialCourses);
  }

  const filteredCourses = courses.filter((c) => {
    if (!courseSearch.trim()) return true;
    const q = courseSearch.toLowerCase();
    return (
      c.code.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.instructor.toLowerCase().includes(q)
    );
  });

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!code.trim() || !name.trim() || !instructor.trim() || !credits) {
      setFormError("Code, name, instructor, and credits are required.");
      return;
    }

    setIsSubmitting(true);
    const res = await createCourse({
      code: code.trim(),
      name: name.trim(),
      instructor: instructor.trim(),
      credits: parseFloat(credits),
      progress: parseInt(progress || "0", 10),
    });
    setIsSubmitting(false);

    if (res.error) {
      setFormError(res.error);
      addToast(res.error, "error");
    } else if (res.course) {
      setCode("");
      setName("");
      setInstructor("");
      setCredits("3.0");
      setProgress("0");
      setIsModalOpen(false);
      setCourses([res.course, ...courses]);
      addToast(`Course ${res.course.code} created successfully`, "success");
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this course?")) return;

    const previousCourses = courses;
    setCourses((prev) => prev.filter((c) => c.id !== id));

    const res = await deleteCourse(id);
    if (!res.success) {
      setCourses(previousCourses);
      addToast("Unable to delete course.", "error");
    } else {
      addToast("Course deleted successfully.", "info");
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by code, title, or instructor..."
            value={courseSearch}
            onChange={(e) => setCourseSearch(e.target.value)}
            aria-label="Search courses"
            className="w-full pl-9 pr-3 py-2 text-xs border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-400"
          />
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-purple-700 hover:bg-purple-800 dark:bg-purple-600 dark:hover:bg-purple-500 text-white transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-400"
        >
          <Plus className="w-4 h-4" />
          Add Course
        </button>
      </div>

      {/* Courses List Grid */}
      {filteredCourses.length === 0 ? (
        <div className="p-8 border border-dashed border-zinc-300 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/40 text-center">
          <BookOpen className="w-8 h-8 mx-auto text-zinc-400 mb-2" />
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1">
            NO COURSES FOUND
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {courseSearch
              ? `No courses found matching "${courseSearch}".`
              : "You have not registered any academic courses yet."}
          </p>
          {courseSearch && (
            <button
              type="button"
              onClick={() => setCourseSearch("")}
              className="mt-3 text-xs font-mono text-purple-700 dark:text-purple-400 underline cursor-pointer"
            >
              Clear Search Query
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="group relative p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-purple-300 dark:hover:border-purple-800 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold tracking-widest text-purple-700 dark:text-purple-400 uppercase">
                    {course.code}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                      {course.credits} CREDITS
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleDelete(course.id, e)}
                      title="Delete Course"
                      aria-label={`Delete ${course.name}`}
                      className="p-1 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <Link href={`/courses/${course.id}`} className="block focus:outline-none">
                  <h3 className="font-serif text-lg font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">
                    {course.name}
                  </h3>
                </Link>

                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 font-sans">
                  Instructor: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{course.instructor}</span>
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
                  <span className="text-zinc-500 dark:text-zinc-400">Progress</span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">{course.progress}%</span>
                </div>
                <div
                  className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 overflow-hidden border border-zinc-200 dark:border-zinc-700/60"
                  role="progressbar"
                  aria-valuenow={course.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="h-full bg-purple-700 dark:bg-purple-500 transition-all duration-300"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-400">
                    {course._count?.assignments || 0} ASSIGNMENTS
                  </span>
                  <Link
                    href={`/courses/${course.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 hover:underline"
                  >
                    View Details
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Course Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 shadow-xl">
            <h2 className="font-serif text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">
              Add New Course
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
              Enter academic course code, module name, instructor, and credits.
            </p>

            {formError && (
              <div className="mb-4 p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/80 text-red-700 dark:text-red-300 text-xs font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label htmlFor="course-code" className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
                  Course Code *
                </label>
                <input
                  id="course-code"
                  type="text"
                  placeholder="e.g. AI401"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-400"
                />
              </div>

              <div>
                <label htmlFor="course-name" className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
                  Course Name *
                </label>
                <input
                  id="course-name"
                  type="text"
                  placeholder="e.g. Machine Learning"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-400"
                />
              </div>

              <div>
                <label htmlFor="course-instructor" className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
                  Instructor *
                </label>
                <input
                  id="course-instructor"
                  type="text"
                  placeholder="e.g. Dr. Sharma"
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="course-credits" className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
                    Credits *
                  </label>
                  <input
                    id="course-credits"
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="10"
                    value={credits}
                    onChange={(e) => setCredits(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-400"
                  />
                </div>
                <div>
                  <label htmlFor="course-progress" className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
                    Progress (%)
                  </label>
                  <input
                    id="course-progress"
                    type="number"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={(e) => setProgress(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider border border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-purple-700 hover:bg-purple-800 dark:bg-purple-600 dark:hover:bg-purple-500 text-white transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Course"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
