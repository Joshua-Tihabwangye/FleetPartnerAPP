import React from "react";

export default function TrainingCentrePage() {
  const courses = [
    { id: 1, title: "Fleet Management Basics", description: "Learn the fundamentals of fleet operations", duration: "2 hours", status: "available" },
    { id: 2, title: "Driver Safety Training", description: "Essential safety protocols for drivers", duration: "3 hours", status: "available" },
    { id: 3, title: "EV Vehicle Maintenance", description: "Maintenance best practices for electric vehicles", duration: "4 hours", status: "available" }
  ];

  return (
    <div className="min-h-[calc(100vh-56px)] px-4 sm:px-6 lg:px-10 py-6 bg-slate-50">
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
            className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="mb-4">
              <div className="text-3xl mb-2">🎓</div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{course.title}</h3>
              <p className="text-sm text-slate-600 mb-3">{course.description}</p>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span>Duration: {course.duration}</span>
                <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                  {course.status}
                </span>
              </div>
            </div>
            <button className="w-full px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark">
              Start course
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
