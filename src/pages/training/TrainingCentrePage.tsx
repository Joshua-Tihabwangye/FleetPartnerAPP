import React from "react";
import { Link } from "react-router-dom";


interface CourseProgress {
  completed: number;
  total: number;
  percentage: number;
  status: "completed" | "in-progress" | "available";
}

export default function TrainingCentrePage() {
  const [courseProgress, setCourseProgress] = React.useState<Record<number, CourseProgress>>({});

  React.useEffect(() => {
    // Load progress for all courses
    const progress: Record<number, CourseProgress> = {};
    [1, 2, 3].forEach(courseId => {
      const storedProgress = JSON.parse(localStorage.getItem(`training_progress_${courseId}`) || "[]");
      const totalModules = 5; // Assuming 5 modules per course
      const completedCount = storedProgress.length;
      const percentage = (completedCount / totalModules) * 100;

      progress[courseId] = {
        completed: completedCount,
        total: totalModules,
        percentage: Math.round(percentage),
        status: percentage === 100 ? "completed" : percentage > 0 ? "in-progress" : "available"
      };
    });
    setCourseProgress(progress);
  }, []);

  const courses = [
    { id: 1, title: "Fleet Management Basics", description: "Learn the fundamentals of fleet operations", duration: "2 hours" },
    { id: 2, title: "Driver Safety Training", description: "Essential safety protocols for drivers", duration: "3 hours" },
    { id: 3, title: "EV Vehicle Maintenance", description: "Maintenance best practices for electric vehicles", duration: "4 hours" }
  ];

  const getStatusBadge = (courseId: number) => {
    const progress = courseProgress[courseId];
    if (!progress) return null;

    if (progress.status === "completed") {
      return (
        <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
          ✓ Completed
        </span>
      );
    } else if (progress.status === "in-progress") {
      return (
        <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
          In Progress ({progress.percentage}%)
        </span>
      );
    }
    return (
      <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
        Available
      </span>
    );
  };

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">Training centre</h1>
        <p className="text-sm text-slate-600">Access training courses and resources for your fleet team</p>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow h-full flex flex-col"
          >
            <div className="mb-4 flex-1">
              <div className="flex items-start justify-between mb-2">
                <div className="text-3xl">🎓</div>
                {getStatusBadge(course.id)}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{course.title}</h3>
              <p className="text-sm text-slate-600 mb-3">{course.description}</p>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span>Duration: {course.duration}</span>
              </div>
              {courseProgress[course.id] && courseProgress[course.id].percentage > 0 && courseProgress[course.id].percentage < 100 && (
                <div className="mt-3">
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div
                      className="bg-ev-green rounded-full h-1.5 transition-all"
                      style={{ width: `${courseProgress[course.id].percentage}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
            <Link
              to={`/training/course/${course.id}`}
              className="block w-full px-4 py-2 mt-auto rounded-lg bg-emerald-500 text-white text-sm font-medium text-center hover:bg-emerald-600 transition-colors"
            >
              {courseProgress[course.id]?.status === "completed" ? "Review Course" : courseProgress[course.id]?.status === "in-progress" ? "Continue Course" : "Start Course"}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
