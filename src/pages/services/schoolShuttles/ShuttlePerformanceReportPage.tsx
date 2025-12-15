import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BarChart } from "../../../components/ui/Charts";

interface Trip {
    id: string;
    date: string;
    time: string;
    school: string;
    route: string;
    driver: string;
    vehicle: string;
    scheduled: string;
    actual: string;
    status: "On time" | "Late" | "Missed";
    delayMinutes: number | null;
}

const performanceSummary = [
    { label: "Mon", value: 42 },
    { label: "Tue", value: 40 },
    { label: "Wed", value: 45 },
    { label: "Thu", value: 39 },
    { label: "Fri", value: 44 }
];

const tripsSeed: Trip[] = [
    {
        id: "TRIP-001",
        date: "2025-06-02",
        time: "06:30",
        school: "Sunrise Academy",
        route: "R-12 – Eastside Loop",
        driver: "James Okello",
        vehicle: "BUS-12",
        scheduled: "06:30",
        actual: "06:32",
        status: "On time",
        delayMinutes: 2
    },
    {
        id: "TRIP-002",
        date: "2025-06-02",
        time: "06:40",
        school: "Green Valley High",
        route: "R-7 – West Ridge",
        driver: "Sarah Kintu",
        vehicle: "BUS-07",
        scheduled: "06:40",
        actual: "06:53",
        status: "Late",
        delayMinutes: 13
    },
    {
        id: "TRIP-003",
        date: "2025-06-02",
        time: "06:45",
        school: "Cityline Primary",
        route: "R-3 – Northern Estates",
        driver: "John Bosco",
        vehicle: "BUS-03",
        scheduled: "06:45",
        actual: "--",
        status: "Missed",
        delayMinutes: null
    },
    {
        id: "TRIP-004",
        date: "2025-06-03",
        time: "06:30",
        school: "Sunrise Academy",
        route: "R-12 – Eastside Loop",
        driver: "James Okello",
        vehicle: "BUS-12",
        scheduled: "06:30",
        actual: "06:31",
        status: "On time",
        delayMinutes: 1
    },
    {
        id: "TRIP-005",
        date: "2025-06-03",
        time: "06:40",
        school: "Green Valley High",
        route: "R-7 – West Ridge",
        driver: "Sarah Kintu",
        vehicle: "BUS-07",
        scheduled: "06:40",
        actual: "06:46",
        status: "Late",
        delayMinutes: 6
    }
];

export default function ShuttlePerformanceReportPage() {
    const [fromDate, setFromDate] = useState("2025-06-02");
    const [toDate, setToDate] = useState("2025-06-03");
    const [schoolFilter, setSchoolFilter] = useState("all");
    const [routeFilter, setRouteFilter] = useState("all");
    const [driverFilter, setDriverFilter] = useState("all");

    const schools = Array.from(new Set(tripsSeed.map((t) => t.school)));
    const routes = Array.from(new Set(tripsSeed.map((t) => t.route)));
    const drivers = Array.from(new Set(tripsSeed.map((t) => t.driver)));

    const filteredTrips = tripsSeed.filter((t) => {
        if (fromDate && t.date < fromDate) return false;
        if (toDate && t.date > toDate) return false;
        if (schoolFilter !== "all" && t.school !== schoolFilter) return false;
        if (routeFilter !== "all" && t.route !== routeFilter) return false;
        if (driverFilter !== "all" && t.driver !== driverFilter) return false;
        return true;
    });

    const onTimeCount = filteredTrips.filter(t => t.status === "On time").length;
    const lateCount = filteredTrips.filter(t => t.status === "Late").length;
    const missedCount = filteredTrips.filter(t => t.status === "Missed").length;
    const onTimeRate = filteredTrips.length > 0 ? Math.round((onTimeCount / filteredTrips.length) * 100) : 0;

    const getStatusColor = (status: Trip["status"]) => {
        switch (status) {
            case "On time": return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "Late": return "bg-orange-100 text-orange-700 border-orange-200";
            case "Missed": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-slate-100 text-slate-700 border-slate-200";
        }
    };

    const handleExportCsv = () => {
        const csvContent = [
            ["Trip", "Date", "Time", "School", "Route", "Driver", "Vehicle", "Status", "Delay (min)"],
            ...filteredTrips.map(t => [t.id, t.date, t.time, t.school, t.route, t.driver, t.vehicle, t.status, t.delayMinutes || ""])
        ].map(row => row.join(",")).join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `performance_report_${new Date().toISOString().split("T")[0]}.csv`;
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
                            On-Time Performance Report
                        </h1>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Analyse on-time, late and missed trips. Track service reliability and identify coaching opportunities.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleExportCsv}
                            className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Export CSV
                        </button>
                        <button className="px-4 py-2 rounded-xl bg-ev-green text-white text-sm font-medium shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition">
                            Export PDF
                        </button>
                    </div>
                </div>
                <div className="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-emerald-500 via-orange-500 to-red-500 opacity-80" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4">
                    <p className="text-sm text-emerald-700 mb-1">On-Time Rate</p>
                    <p className="text-2xl font-semibold text-emerald-800">{onTimeRate}%</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">On Time Trips</p>
                    <p className="text-2xl font-semibold text-emerald-600">{onTimeCount}</p>
                </div>
                <div className="bg-orange-50 rounded-xl border border-orange-200 p-4">
                    <p className="text-sm text-orange-700 mb-1">Late Trips</p>
                    <p className="text-2xl font-semibold text-orange-800">{lateCount}</p>
                </div>
                <div className="bg-red-50 rounded-xl border border-red-200 p-4">
                    <p className="text-sm text-red-700 mb-1">Missed Trips</p>
                    <p className="text-2xl font-semibold text-red-800">{missedCount}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Filters */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Filters</h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <label className="block">
                                <span className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">From Date</span>
                                <input
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                                />
                            </label>
                            <label className="block">
                                <span className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">To Date</span>
                                <input
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                                />
                            </label>
                        </div>
                        <label className="block">
                            <span className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">School</span>
                            <select
                                value={schoolFilter}
                                onChange={(e) => setSchoolFilter(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                            >
                                <option value="all">All schools</option>
                                {schools.map((s) => (<option key={s} value={s}>{s}</option>))}
                            </select>
                        </label>
                        <label className="block">
                            <span className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Route</span>
                            <select
                                value={routeFilter}
                                onChange={(e) => setRouteFilter(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                            >
                                <option value="all">All routes</option>
                                {routes.map((r) => (<option key={r} value={r}>{r}</option>))}
                            </select>
                        </label>
                        <label className="block">
                            <span className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Driver</span>
                            <select
                                value={driverFilter}
                                onChange={(e) => setDriverFilter(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                            >
                                <option value="all">All drivers</option>
                                {drivers.map((d) => (<option key={d} value={d}>{d}</option>))}
                            </select>
                        </label>
                    </div>
                    <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                        {filteredTrips.length} trips match filters
                    </p>
                </div>

                {/* Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Weekly On-Time Trips</h3>
                    <BarChart data={performanceSummary} height={200} showValues={true} />
                    <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                        Aim for 95%+ on-time trips. Persistent late/missed patterns should trigger deeper analysis.
                    </p>
                </div>
            </div>

            {/* Trip Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Trip-by-Trip Breakdown</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Trip</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Date/Time</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">School</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Route</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Driver/Vehicle</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Status</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Delay</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {filteredTrips.map((trip) => (
                                <tr key={trip.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{trip.id}</td>
                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{trip.date} {trip.time}</td>
                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">🏫 {trip.school}</td>
                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">🚌 {trip.route}</td>
                                    <td className="px-4 py-3">
                                        <p className="text-sm text-slate-900 dark:text-white">👤 {trip.driver}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{trip.vehicle}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                                            {trip.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right text-sm text-slate-600 dark:text-slate-400">
                                        {trip.delayMinutes === null ? "--" : `${trip.delayMinutes} min`}
                                    </td>
                                </tr>
                            ))}
                            {filteredTrips.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                                        No trips match the current filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
