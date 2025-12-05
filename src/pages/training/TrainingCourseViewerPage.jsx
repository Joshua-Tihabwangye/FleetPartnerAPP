import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toastManager } from "../../utils/toastManager";

export default function TrainingCourseViewerPage() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [currentModule, setCurrentModule] = useState(0);
    const [completedModules, setCompletedModules] = useState([]);

    React.useEffect(() => {
        const storedProgress = JSON.parse(localStorage.getItem(`training_progress_${courseId}`) || "[]");
        setCompletedModules(storedProgress);
    }, [courseId]);

    const course = {
        id: courseId,
        title: "Fleet Management Basics",
        description: "Learn the fundamentals of fleet operations",
        duration: "2 hours",
        modules: [
            {
                id: 1,
                title: "Introduction to Fleet Management",
                content: "Fleet management is the process of organizing and coordinating work vehicles to improve efficiency, reduce costs, and ensure compliance with regulations. In this module, you'll learn the core principles of effective fleet management.",
                duration: "20 min"
            },
            {
                id: 2,
                title: "Vehicle Maintenance Best Practices",
                content: "Regular maintenance is crucial for fleet safety and longevity. This module covers preventive maintenance schedules, inspection procedures, and common maintenance issues to watch for.",
                duration: "30 min"
            },
            {
                id: 3,
                title: "Driver Safety and Compliance",
                content: "Ensuring driver safety and regulatory compliance is paramount. Learn about driver training, safety protocols, and legal requirements for fleet operations.",
                duration: "25 min"
            },
            {
                id: 4,
                title: "Cost Management and Optimization",
                content: "Discover strategies to reduce operational costs while maintaining service quality. Topics include fuel management, route optimization, and vehicle lifecycle management.",
                duration: "30 min"
            },
            {
                id: 5,
                title: "Final Assessment",
                content: "Test your knowledge with a comprehensive assessment covering all modules.",
                duration: "15 min"
            }
        ]
    };

    const currentModuleData = course.modules[currentModule];
    const progress = ((completedModules.length) / course.modules.length) * 100;

    const handleCompleteModule = () => {
        if (!completedModules.includes(currentModule)) {
            const newCompleted = [...completedModules, currentModule];
            setCompletedModules(newCompleted);
            localStorage.setItem(`training_progress_${courseId}`, JSON.stringify(newCompleted));
        }

        if (currentModule < course.modules.length - 1) {
            setCurrentModule(currentModule + 1);
        } else {
            toastManager.show("Course completed successfully! Certificate awarded.", "success");
            setTimeout(() => navigate("/training"), 2000);
        }
    };

    return (
        <div className="min-h-[calc(100vh-56px)] px-4 sm:px-6 lg:px-10 py-6 bg-slate-50">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        to="/training"
                        className="text-sm text-slate-600 hover:text-slate-900 mb-2 inline-block"
                    >
                        ← Back to training centre
                    </Link>
                    <h1 className="text-2xl font-semibold text-slate-900 mb-2">{course.title}</h1>
                    <p className="text-sm text-slate-600">{course.description}</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-6 bg-white rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">Course Progress</span>
                        <span className={`text-sm font-semibold ${progress === 100 ? 'text-emerald-600' : 'text-ev-green'}`}>
                            {Math.round(progress)}% {progress === 100 && '(Completed)'}
                        </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                            className="bg-ev-green rounded-full h-2 transition-all"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Modules Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl border border-slate-200 p-4">
                            <h2 className="text-sm font-semibold text-slate-900 mb-3">Course Modules</h2>
                            <div className="space-y-2">
                                {course.modules.map((module, idx) => (
                                    <button
                                        key={module.id}
                                        onClick={() => setCurrentModule(idx)}
                                        className={`w-full text-left p-3 rounded-lg transition-colors ${currentModule === idx
                                            ? "bg-ev-green text-white"
                                            : completedModules.includes(idx)
                                                ? "bg-emerald-50 text-emerald-700"
                                                : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            {completedModules.includes(idx) && (
                                                <span className="text-sm">✓</span>
                                            )}
                                            <span className="text-xs font-medium">Module {idx + 1}</span>
                                        </div>
                                        <p className="text-xs leading-tight">{module.title}</p>
                                        <p className="text-xs mt-1 opacity-75">{module.duration}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Module Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-xl border border-slate-200 p-8">
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="px-2 py-1 rounded-full bg-ev-green text-white text-xs font-medium">
                                        Module {currentModule + 1}
                                    </span>
                                    <span className="text-xs text-slate-500">{currentModuleData.duration}</span>
                                </div>
                                <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                                    {currentModuleData.title}
                                </h2>
                            </div>

                            {/* Module Content */}
                            <div className="prose max-w-none mb-8">
                                <p className="text-slate-700 leading-relaxed">
                                    {currentModuleData.content}
                                </p>

                                {/* Mock interactive content */}
                                <div className="mt-6 p-6 rounded-lg bg-blue-50 border border-blue-200">
                                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Key Takeaways</h3>
                                    <ul className="list-disc list-inside text-blue-800 space-y-1">
                                        <li>Understanding core fleet management principles</li>
                                        <li>Implementing best practices in your operations</li>
                                        <li>Maintaining compliance with regulations</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                                <button
                                    onClick={() => currentModule > 0 && setCurrentModule(currentModule - 1)}
                                    disabled={currentModule === 0}
                                    className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    ← Previous Module
                                </button>
                                <button
                                    onClick={handleCompleteModule}
                                    className="px-6 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark"
                                >
                                    {currentModule === course.modules.length - 1 ? "Complete Course" : "Next Module →"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
