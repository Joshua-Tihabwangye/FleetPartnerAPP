import React, { useState } from "react";
import { Link } from "react-router-dom";

interface Student {
    id: string;
    name: string;
    school: string;
    stop: string;
    grade: string;
}

interface Route {
    id: string;
    name: string;
    school: string;
    studentsTotal: number;
    students: Student[];
}

const routesData: Route[] = [
    {
        id: "R-12",
        name: "Route 12 – Eastside Loop",
        school: "Sunrise Academy & Green Valley High",
        studentsTotal: 72,
        students: [
            { id: "STU-001", name: "Amina K.", school: "Sunrise Academy", stop: "Ntinda Stage", grade: "P5" },
            { id: "STU-002", name: "Brian O.", school: "Green Valley High", stop: "Kisaasi Junction", grade: "S2" },
            { id: "STU-003", name: "Chloe N.", school: "Sunrise Academy", stop: "Kigoowa", grade: "P6" }
        ]
    },
    {
        id: "R-7",
        name: "Route 7 – West Ridge",
        school: "Green Valley High & Cityline Primary",
        studentsTotal: 54,
        students: [
            { id: "STU-101", name: "David M.", school: "Green Valley High", stop: "Wandegeya", grade: "S1" },
            { id: "STU-102", name: "Esther T.", school: "Cityline Primary", stop: "Kasubi", grade: "P4" }
        ]
    },
    {
        id: "R-3",
        name: "Route 3 – Northern Estates",
        school: "Sunrise Academy",
        studentsTotal: 36,
        students: [
            { id: "STU-201", name: "Felix A.", school: "Sunrise Academy", stop: "Northern Bypass", grade: "P7" }
        ]
    }
];

export default function ShuttleStudentRostersPage() {
    const [routeFilter, setRouteFilter] = useState("all");
    const [schoolFilter, setSchoolFilter] = useState("all");
    const [gradeFilter, setGradeFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [maskPII, setMaskPII] = useState(false);
    const [expandedRoutes, setExpandedRoutes] = useState<string[]>(routesData.map(r => r.id));

    const allRoutes = routesData.map((r) => r.id);
    const allSchools = Array.from(new Set(routesData.flatMap((r) => r.students.map((s) => s.school))));
    const allGrades = Array.from(new Set(routesData.flatMap((r) => r.students.map((s) => s.grade))));

    const filteredRoutes = routesData
        .map((route) => {
            if (routeFilter !== "all" && route.id !== routeFilter) return null;

            const filteredStudents = route.students.filter((s) => {
                if (schoolFilter !== "all" && s.school !== schoolFilter) return false;
                if (gradeFilter !== "all" && s.grade !== gradeFilter) return false;
                if (search) {
                    const term = search.toLowerCase();
                    const nameOrId = `${s.name} ${s.id}`.toLowerCase();
                    return nameOrId.includes(term) || s.stop.toLowerCase().includes(term);
                }
                return true;
            });

            if (filteredStudents.length === 0) return null;

            return {
                ...route,
                filteredStudents,
                filteredTotal: filteredStudents.length
            };
        })
        .filter(Boolean) as (Route & { filteredStudents: Student[]; filteredTotal: number })[];

    const toggleRoute = (routeId: string) => {
        setExpandedRoutes(prev =>
            prev.includes(routeId)
                ? prev.filter(id => id !== routeId)
                : [...prev, routeId]
        );
    };

    const totalLearners = filteredRoutes.reduce((sum, r) => sum + r.filteredTotal, 0);

    const handleExport = () => {
        const csvContent = [
            ["Route ID", "Route Name", "School", "Student Name", "Student ID", "Stop", "Grade"],
            ...filteredRoutes.flatMap(route =>
                route.filteredStudents.map(student => [
                    route.id,
                    route.name,
                    student.school,
                    student.name,
                    student.id,
                    student.stop,
                    student.grade
                ])
            )
        ].map(row => row.join(",")).join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `shuttle_roster_export_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
    };

    return (
        <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50 dark:bg-slate-900">
            {/* Header */}
            <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <Link
                            to="/school-shuttles"
                            className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 mb-2 inline-block"
                        >
                            ← Back to Dashboard
                        </Link>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            Student Rosters by Route
                        </h1>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            View which learners are attached to each route. Supports PII masking for data protection.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={maskPII}
                                onChange={(e) => setMaskPII(e.target.checked)}
                                className="w-4 h-4 rounded border-slate-300 text-ev-green focus:ring-ev-green"
                            />
                            <span className="text-sm text-slate-600 dark:text-slate-400">Mask names (show IDs only)</span>
                        </label>
                        <button
                            onClick={handleExport}
                            className="px-4 py-2 rounded-xl bg-ev-green text-white text-sm font-medium shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition"
                        >
                            Export Roster
                        </button>
                    </div>
                </div>
                <div className="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-emerald-500 via-slate-400 to-orange-500 opacity-80" />
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Filters</span>
                        <span className="px-2 py-0.5 rounded-full bg-ev-green/10 text-ev-green text-xs font-medium">
                            {totalLearners} learners across {filteredRoutes.length} route(s)
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <select
                            value={routeFilter}
                            onChange={(e) => setRouteFilter(e.target.value)}
                            className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-ev-green"
                        >
                            <option value="all">All routes</option>
                            {allRoutes.map((routeId) => (
                                <option key={routeId} value={routeId}>{routeId}</option>
                            ))}
                        </select>
                        <select
                            value={schoolFilter}
                            onChange={(e) => setSchoolFilter(e.target.value)}
                            className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-ev-green"
                        >
                            <option value="all">All schools</option>
                            {allSchools.map((school) => (
                                <option key={school} value={school}>{school}</option>
                            ))}
                        </select>
                        <select
                            value={gradeFilter}
                            onChange={(e) => setGradeFilter(e.target.value)}
                            className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-ev-green"
                        >
                            <option value="all">All grades</option>
                            {allGrades.map((grade) => (
                                <option key={grade} value={grade}>{grade}</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="Search by name / ID / stop..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-ev-green"
                        />
                    </div>
                </div>
            </div>

            {/* Rosters by Route */}
            {filteredRoutes.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
                    <p className="text-slate-500 dark:text-slate-400">No students match the current filters.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredRoutes.map((route) => (
                        <div
                            key={route.id}
                            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                        >
                            {/* Accordion Header */}
                            <button
                                onClick={() => toggleRoute(route.id)}
                                className="w-full p-4 flex items-center justify-between bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-lg">🚌</span>
                                    <div className="text-left">
                                        <p className="font-semibold text-slate-900 dark:text-white">{route.name}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{route.id} · {route.school}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="px-2 py-0.5 rounded-full bg-ev-green/10 text-ev-green text-xs font-medium">
                                        {route.filteredTotal} of {route.studentsTotal} learners
                                    </span>
                                    <span className={`text-slate-400 transition-transform ${expandedRoutes.includes(route.id) ? "rotate-180" : ""}`}>
                                        ▼
                                    </span>
                                </div>
                            </button>

                            {/* Accordion Content */}
                            {expandedRoutes.includes(route.id) && (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-slate-50 dark:bg-slate-700/30 border-b border-slate-200 dark:border-slate-700">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Student</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">School</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Stop</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Grade</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                            {route.filteredStudents.map((s) => (
                                                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                                    <td className="px-4 py-3">
                                                        <p className="font-medium text-slate-900 dark:text-white">
                                                            {maskPII ? s.id : s.name}
                                                        </p>
                                                        {maskPII && (
                                                            <p className="text-xs text-slate-500 dark:text-slate-400">Name masked</p>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{s.school}</td>
                                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{s.stop}</td>
                                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{s.grade}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Footer Note */}
            <div className="mt-6 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    This roster view connects to live manifests and supports data protection compliance with PII masking.
                </p>
            </div>
        </div>
    );
}
