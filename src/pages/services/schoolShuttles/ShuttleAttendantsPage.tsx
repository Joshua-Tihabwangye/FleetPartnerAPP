import React, { useState } from "react";
import { Link } from "react-router-dom";

interface Attendant {
    id: string;
    name: string;
    primaryRoutes: string[];
    topSchools: string[];
    trainingStatus: "Fully trained" | "Partially trained" | "In onboarding" | "Needs attention";
    region: string;
    incidentCount: number;
    modules: {
        childSafety: string;
        emergencyResponse: string;
        specialNeeds: string;
    };
}

const attendantsData: Attendant[] = [
    {
        id: "ATT-001",
        name: "Faith Nanyonga",
        primaryRoutes: ["Route 12 – Eastside Loop"],
        topSchools: ["Sunrise Academy"],
        trainingStatus: "Fully trained",
        region: "East",
        incidentCount: 0,
        modules: {
            childSafety: "Completed",
            emergencyResponse: "Completed",
            specialNeeds: "In progress"
        }
    },
    {
        id: "ATT-002",
        name: "Grace Tumwine",
        primaryRoutes: ["Route 7 – West Ridge", "Special – Sports"],
        topSchools: ["Green Valley High", "Cityline Primary"],
        trainingStatus: "Partially trained",
        region: "West",
        incidentCount: 1,
        modules: {
            childSafety: "Completed",
            emergencyResponse: "Overdue refresher",
            specialNeeds: "Not started"
        }
    },
    {
        id: "ATT-003",
        name: "Josephine Mbabazi",
        primaryRoutes: ["Route 3 – Northern Estates"],
        topSchools: ["Sunrise Academy"],
        trainingStatus: "In onboarding",
        region: "North",
        incidentCount: 0,
        modules: {
            childSafety: "In progress",
            emergencyResponse: "Not started",
            specialNeeds: "Not started"
        }
    }
];

export default function ShuttleAttendantsPage() {
    const [trainingFilter, setTrainingFilter] = useState("all");
    const [regionFilter, setRegionFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [selectedId, setSelectedId] = useState<string | null>(attendantsData[0]?.id || null);

    const filtered = attendantsData.filter((a) => {
        if (trainingFilter === "full" && a.trainingStatus !== "Fully trained") return false;
        if (trainingFilter === "partial" && a.trainingStatus === "Fully trained") return false;
        if (trainingFilter === "needs" && a.trainingStatus === "Fully trained") return false;
        if (regionFilter !== "all" && a.region !== regionFilter) return false;
        if (search) {
            const term = search.toLowerCase();
            return (
                a.name.toLowerCase().includes(term) ||
                a.id.toLowerCase().includes(term) ||
                a.topSchools.some((s) => s.toLowerCase().includes(term))
            );
        }
        return true;
    });

    const selected = attendantsData.find((a) => a.id === selectedId) || filtered[0] || null;

    const getTrainingStatusColor = (status: string) => {
        switch (status) {
            case "Fully trained": return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "Partially trained": return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "In onboarding": return "bg-blue-100 text-blue-700 border-blue-200";
            case "Needs attention": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-slate-100 text-slate-700 border-slate-200";
        }
    };

    const getModuleStatusColor = (status: string) => {
        switch (status) {
            case "Completed": return "bg-emerald-100 text-emerald-700";
            case "In progress": return "bg-yellow-100 text-yellow-700";
            case "Overdue refresher": return "bg-red-100 text-red-700";
            case "Not started": return "bg-slate-100 text-slate-600";
            default: return "bg-slate-100 text-slate-600";
        }
    };

    const completionScore = selected
        ? Math.round(
            [selected.modules.childSafety, selected.modules.emergencyResponse, selected.modules.specialNeeds].filter(
                (m) => m === "Completed"
            ).length * (100 / 3)
        )
        : 0;

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
                            Bus Attendants
                        </h1>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Manage bus attendants who look after learners on board. Track their training status and assign them to routes.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            to="/school-shuttles/attendants/new"
                            className="px-4 py-2 rounded-xl bg-ev-green text-white text-sm font-medium shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition"
                        >
                            + Add Attendant
                        </Link>
                    </div>
                </div>
                <div className="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-emerald-500 via-slate-400 to-orange-500 opacity-80" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Attendants</p>
                    <p className="text-2xl font-semibold text-slate-900 dark:text-white">{attendantsData.length}</p>
                </div>
                <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4">
                    <p className="text-sm text-emerald-700 mb-1">Fully Trained</p>
                    <p className="text-2xl font-semibold text-emerald-800">
                        {attendantsData.filter(a => a.trainingStatus === "Fully trained").length}
                    </p>
                </div>
                <div className="bg-orange-50 rounded-xl border border-orange-200 p-4">
                    <p className="text-sm text-orange-700 mb-1">In Training</p>
                    <p className="text-2xl font-semibold text-orange-800">
                        {attendantsData.filter(a => a.trainingStatus !== "Fully trained").length}
                    </p>
                </div>
                <div className="bg-slate-100 rounded-xl border border-slate-300 p-4">
                    <p className="text-sm text-slate-600 mb-1">Total Incidents</p>
                    <p className="text-2xl font-semibold text-slate-800">
                        {attendantsData.reduce((sum, a) => sum + a.incidentCount, 0)}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* List */}
                <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                    {/* Filters */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                {filtered.length} of {attendantsData.length} attendants
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <select
                                value={trainingFilter}
                                onChange={(e) => setTrainingFilter(e.target.value)}
                                className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-ev-green"
                            >
                                <option value="all">All statuses</option>
                                <option value="full">Fully trained</option>
                                <option value="partial">Partially / onboarding</option>
                                <option value="needs">Needs attention</option>
                            </select>
                            <select
                                value={regionFilter}
                                onChange={(e) => setRegionFilter(e.target.value)}
                                className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-ev-green"
                            >
                                <option value="all">All regions</option>
                                <option value="East">East</option>
                                <option value="West">West</option>
                                <option value="North">North</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Search by name or school..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-ev-green"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Attendant</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Routes</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Schools</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Training</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Incidents</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {filtered.map((a) => (
                                    <tr
                                        key={a.id}
                                        onClick={() => setSelectedId(a.id)}
                                        className={`cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${a.id === selected?.id ? "bg-emerald-50 dark:bg-emerald-900/20" : ""
                                            }`}
                                    >
                                        <td className="px-4 py-4">
                                            <p className="font-medium text-slate-900 dark:text-white">{a.name}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{a.id} · Region {a.region}</p>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400">
                                            {a.primaryRoutes.length} route{a.primaryRoutes.length === 1 ? "" : "s"}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {a.topSchools.map((school) => (
                                                    <span key={school} className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-xs text-slate-600 dark:text-slate-300">
                                                        {school}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTrainingStatusColor(a.trainingStatus)}`}>
                                                {a.trainingStatus}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <span className={`font-semibold ${a.incidentCount > 0 ? "text-red-600" : "text-emerald-600"}`}>
                                                {a.incidentCount}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                                            No attendants match the current filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Detail Panel */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                    {selected ? (
                        <>
                            <div className="mb-4">
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{selected.name}</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{selected.id} · Region {selected.region}</p>
                            </div>

                            <div className="mb-4">
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Training Completion</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{completionScore}%</span>
                                    <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                        <div
                                            className="bg-ev-green rounded-full h-2 transition-all"
                                            style={{ width: `${completionScore}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3 mb-4">
                                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Child Safety</p>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getModuleStatusColor(selected.modules.childSafety)}`}>
                                        {selected.modules.childSafety}
                                    </span>
                                </div>
                                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Emergency Response</p>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getModuleStatusColor(selected.modules.emergencyResponse)}`}>
                                        {selected.modules.emergencyResponse}
                                    </span>
                                </div>
                                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Special Needs Support</p>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getModuleStatusColor(selected.modules.specialNeeds)}`}>
                                        {selected.modules.specialNeeds}
                                    </span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Primary Routes</h3>
                                <div className="space-y-1">
                                    {selected.primaryRoutes.map((route) => (
                                        <p key={route} className="text-sm text-slate-600 dark:text-slate-400">• {route}</p>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-4">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Incident History</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {selected.incidentCount === 0
                                        ? "No recorded incidents involving this attendant."
                                        : `${selected.incidentCount} incident(s) on record. View details for more information.`}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => alert("Simulated: Assigning route to attendant...")}
                                    className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600"
                                >
                                    Assign to Routes
                                </button>
                                <button
                                    onClick={() => alert("Simulated: Marking training as updated...")}
                                    className="flex-1 px-4 py-2 rounded-lg border border-orange-300 bg-orange-50 text-sm font-medium text-orange-700 hover:bg-orange-100"
                                >
                                    Update Training
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-slate-500 dark:text-slate-400">Select an attendant from the table to see details.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
