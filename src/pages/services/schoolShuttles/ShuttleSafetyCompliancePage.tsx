import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LineChart, BarChart } from "../../../components/ui/Charts";

interface HighRiskRoute {
    id: string;
    label: string;
    incidentsLast90: number;
    schools: string[];
}

interface DriverWithIncidents {
    id: string;
    name: string;
    incidentsLast90: number;
    primaryRoute: string;
}

const incidentsOverTime = [
    { month: "Jan", low: 3, medium: 4, high: 1 },
    { month: "Feb", low: 4, medium: 3, high: 2 },
    { month: "Mar", low: 5, medium: 2, high: 1 },
    { month: "Apr", low: 2, medium: 3, high: 2 },
    { month: "May", low: 3, medium: 4, high: 3 },
    { month: "Jun", low: 1, medium: 2, high: 1 },
    { month: "Jul", low: 2, medium: 1, high: 0 },
    { month: "Aug", low: 3, medium: 2, high: 1 },
    { month: "Sep", low: 4, medium: 3, high: 2 },
    { month: "Oct", low: 2, medium: 4, high: 1 },
    { month: "Nov", low: 1, medium: 2, high: 0 },
    { month: "Dec", low: 2, medium: 1, high: 1 }
];

const incidentsByRoute = [
    { label: "R-12", value: 9 },
    { label: "R-7", value: 7 },
    { label: "R-3", value: 5 },
    { label: "R-15", value: 2 }
];

const highRiskRoutes: HighRiskRoute[] = [
    { id: "R-12", label: "R-12 – Eastside Loop", incidentsLast90: 9, schools: ["Sunrise Academy"] },
    { id: "R-7", label: "R-7 – West Ridge", incidentsLast90: 7, schools: ["Green Valley High", "Cityline Primary"] }
];

const driversMultipleIncidents: DriverWithIncidents[] = [
    { id: "DRV-012", name: "James Okello", incidentsLast90: 4, primaryRoute: "R-12" },
    { id: "DRV-007", name: "Sarah Kintu", incidentsLast90: 3, primaryRoute: "R-7" }
];

export default function ShuttleSafetyCompliancePage() {
    const [periodFilter, setPeriodFilter] = useState("6months");

    // Calculate totals for incidents
    const lowIncidents = incidentsOverTime.reduce((sum, m) => sum + m.low, 0);
    const mediumIncidents = incidentsOverTime.reduce((sum, m) => sum + m.medium, 0);
    const highIncidents = incidentsOverTime.reduce((sum, m) => sum + m.high, 0);
    const totalIncidents = lowIncidents + mediumIncidents + highIncidents;

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
                            Safety & Compliance Dashboard
                        </h1>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Fleet-wide view of safety performance. Track incident trends and identify high-risk areas.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            value={periodFilter}
                            onChange={(e) => setPeriodFilter(e.target.value)}
                            className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-ev-green"
                        >
                            <option value="30days">Last 30 Days</option>
                            <option value="3months">Last 3 Months</option>
                            <option value="6months">Last 6 Months</option>
                            <option value="year">This Year</option>
                        </select>
                        <button className="px-4 py-2 rounded-xl bg-ev-green text-white text-sm font-medium shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition">
                            Export Report
                        </button>
                    </div>
                </div>
                <div className="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-emerald-500 via-orange-500 to-red-500 opacity-80" />
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Incidents</p>
                    <p className="text-2xl font-semibold text-slate-900 dark:text-white">{totalIncidents}</p>
                </div>
                <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4">
                    <p className="text-sm text-emerald-700 mb-1">Low Severity</p>
                    <p className="text-2xl font-semibold text-emerald-800">{lowIncidents}</p>
                </div>
                <div className="bg-orange-50 rounded-xl border border-orange-200 p-4">
                    <p className="text-sm text-orange-700 mb-1">Medium Severity</p>
                    <p className="text-2xl font-semibold text-orange-800">{mediumIncidents}</p>
                </div>
                <div className="bg-red-50 rounded-xl border border-red-200 p-4">
                    <p className="text-sm text-red-700 mb-1">High Severity</p>
                    <p className="text-2xl font-semibold text-red-800">{highIncidents}</p>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Incidents Over Time */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Incidents Over Time</h3>
                    <LineChart
                        data={incidentsOverTime.map(m => m.low + m.medium + m.high)}
                        labels={incidentsOverTime.map(m => m.month)}
                        height={180}
                        color="#f97316"
                        showArea={true}
                    />
                    <div className="mt-4 flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">12-month trend</span>
                        <span className="text-emerald-600 font-medium">↓ 12% vs previous period</span>
                    </div>
                </div>

                {/* Incidents by Route */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Incidents by Route</h3>
                    <BarChart data={incidentsByRoute} height={180} showValues={true} />
                    <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                        Identify high-risk routes and combine with feedback from drivers and schools.
                    </p>
                </div>
            </div>

            {/* High Risk Areas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* High Risk Routes */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">⚠️ High Risk Routes</h3>
                    <div className="space-y-3">
                        {highRiskRoutes.map((route) => (
                            <div
                                key={route.id}
                                className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-semibold text-slate-900 dark:text-white">{route.label}</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            {route.incidentsLast90} incidents in last 90 days
                                        </p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <span className="text-xs text-slate-500 dark:text-slate-400">Schools:</span>
                                            {route.schools.map((school) => (
                                                <span key={school} className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-xs text-slate-600 dark:text-slate-300">
                                                    {school}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => alert(`Reviewing route ${route.id}...`)}
                                        className="px-3 py-1.5 rounded-lg border border-red-300 bg-white text-sm font-medium text-red-700 hover:bg-red-50"
                                    >
                                        Review
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Drivers with Multiple Incidents */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">👤 Drivers with Multiple Incidents</h3>
                    <div className="space-y-3">
                        {driversMultipleIncidents.map((driver) => (
                            <div
                                key={driver.id}
                                className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-semibold text-slate-900 dark:text-white">{driver.name}</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            {driver.id} · Primary route {driver.primaryRoute}
                                        </p>
                                        <p className="text-sm text-orange-700 dark:text-orange-400 mt-1">
                                            {driver.incidentsLast90} incidents in last 90 days
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => alert(`Assigning training to ${driver.name}...`)}
                                        className="px-3 py-1.5 rounded-lg border border-orange-300 bg-white text-sm font-medium text-orange-700 hover:bg-orange-50"
                                    >
                                        Assign Training
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Action Insights */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">💡 Turning Insights into Action</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    This dashboard is designed to shift safety from reactive to proactive. Combine the data above with
                    feedback from schools, drivers and parents to prioritise interventions.
                </p>
                <div className="flex flex-wrap gap-2">
                    <Link
                        to="/school-shuttles/attendants"
                        className="px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                        View Attendants
                    </Link>
                    <Link
                        to="/school-shuttles/routes"
                        className="px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                        Manage Routes
                    </Link>
                    <Link
                        to="/drivers"
                        className="px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                        View Drivers
                    </Link>
                </div>
            </div>
        </div>
    );
}
