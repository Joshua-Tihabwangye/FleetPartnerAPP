import React, { useState } from "react";
import { Link } from "react-router-dom";

interface Trip {
    id: string;
    label: string;
    day: string;
    time: string;
    routeId: string;
    routeName: string;
    vehicleId: string;
    driver: string;
    students: number;
    status: "Scheduled" | "Assigned" | "In Progress" | "Completed";
}

const tripsData: Trip[] = [
    {
        id: "T-12-M1",
        label: "M1 – AM pickup",
        day: "Mon",
        time: "06:30",
        routeId: "R-12",
        routeName: "Route 12 – Eastside Loop",
        vehicleId: "BUS-12",
        driver: "James Okello",
        students: 38,
        status: "Scheduled"
    },
    {
        id: "T-12-A1",
        label: "A1 – PM dropoff",
        day: "Mon",
        time: "15:15",
        routeId: "R-12",
        routeName: "Route 12 – Eastside Loop",
        vehicleId: "BUS-21",
        driver: "Mary K.",
        students: 36,
        status: "Scheduled"
    },
    {
        id: "T-7-M1",
        label: "M1 – AM pickup",
        day: "Tue",
        time: "06:40",
        routeId: "R-7",
        routeName: "Route 7 – West Ridge",
        vehicleId: "BUS-08",
        driver: "Ali Rashid",
        students: 29,
        status: "Assigned"
    },
    {
        id: "T-7-A1",
        label: "A1 – PM dropoff",
        day: "Tue",
        time: "15:25",
        routeId: "R-7",
        routeName: "Route 7 – West Ridge",
        vehicleId: "BUS-08",
        driver: "Ali Rashid",
        students: 30,
        status: "Assigned"
    },
    {
        id: "T-3-M1",
        label: "M1 – AM pickup",
        day: "Wed",
        time: "06:45",
        routeId: "R-3",
        routeName: "Route 3 – Northern Estates",
        vehicleId: "BUS-03",
        driver: "John Bosco",
        students: 24,
        status: "Scheduled"
    },
    {
        id: "T-12-S1",
        label: "S1 – Sports run",
        day: "Sat",
        time: "08:00",
        routeId: "R-12",
        routeName: "Route 12 – Eastside Loop",
        vehicleId: "BUS-21",
        driver: "James Okello",
        students: 24,
        status: "Scheduled"
    }
];

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function ShuttleTripCalendarPage() {
    const [selectedTripId, setSelectedTripId] = useState<string | null>(tripsData[0]?.id || null);

    const selectedTrip = tripsData.find((t) => t.id === selectedTripId) || null;

    const groupedByDay = weekDays.map((day) => ({
        day,
        trips: tripsData.filter((t) => t.day === day)
    }));

    const getStatusColor = (status: Trip["status"]) => {
        switch (status) {
            case "Scheduled": return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "Assigned": return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "In Progress": return "bg-blue-100 text-blue-700 border-blue-200";
            case "Completed": return "bg-slate-100 text-slate-700 border-slate-200";
            default: return "bg-slate-100 text-slate-700 border-slate-200";
        }
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
                            Trip Calendar
                        </h1>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Visual overview of every trip. See what runs on each day and who is driving which vehicle.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50">
                            This Week
                        </button>
                        <Link
                            to="/school-shuttles/trips/new"
                            className="px-4 py-2 rounded-xl bg-ev-green text-white text-sm font-medium shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition"
                        >
                            + Add Trip
                        </Link>
                    </div>
                </div>
                <div className="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-emerald-500 via-slate-400 to-orange-500 opacity-80" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Trips</p>
                    <p className="text-2xl font-semibold text-slate-900 dark:text-white">{tripsData.length}</p>
                </div>
                <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4">
                    <p className="text-sm text-yellow-700 mb-1">Scheduled</p>
                    <p className="text-2xl font-semibold text-yellow-800">
                        {tripsData.filter(t => t.status === "Scheduled").length}
                    </p>
                </div>
                <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4">
                    <p className="text-sm text-emerald-700 mb-1">Assigned</p>
                    <p className="text-2xl font-semibold text-emerald-800">
                        {tripsData.filter(t => t.status === "Assigned").length}
                    </p>
                </div>
                <div className="bg-slate-100 rounded-xl border border-slate-300 p-4">
                    <p className="text-sm text-slate-600 mb-1">Total Students</p>
                    <p className="text-2xl font-semibold text-slate-800">
                        {tripsData.reduce((sum, t) => sum + t.students, 0)}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Week Calendar */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Week View</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {groupedByDay.map(({ day, trips }) => (
                            <div
                                key={day}
                                className={`p-3 rounded-lg border ${trips.length > 0 ? "border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/30" : "border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800"
                                    }`}
                            >
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">{day}</p>
                                {trips.length === 0 ? (
                                    <p className="text-xs text-slate-400 dark:text-slate-500">No trips</p>
                                ) : (
                                    <div className="space-y-1">
                                        {trips.map((trip) => (
                                            <button
                                                key={trip.id}
                                                onClick={() => setSelectedTripId(trip.id)}
                                                className={`w-full text-left px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${trip.id === selectedTripId
                                                    ? "bg-ev-green text-white"
                                                    : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:border-ev-green"
                                                    }`}
                                            >
                                                🚌 {trip.label} · {trip.time}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Trip List & Detail */}
                <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Upcoming Trips</h3>
                        <span className="px-2 py-0.5 rounded-full bg-ev-green/10 text-ev-green text-xs font-medium">
                            {tripsData.length} configured
                        </span>
                    </div>

                    {/* Trip List */}
                    <div className="space-y-2 max-h-64 overflow-y-auto mb-6">
                        {tripsData.map((trip) => (
                            <button
                                key={trip.id}
                                onClick={() => setSelectedTripId(trip.id)}
                                className={`w-full text-left p-3 rounded-lg border transition-colors ${trip.id === selectedTripId
                                    ? "border-ev-green bg-emerald-50 dark:bg-emerald-900/20"
                                    : "border-slate-200 dark:border-slate-600 hover:border-ev-green"
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-slate-900 dark:text-white">{trip.label}</span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">{trip.day} {trip.time}</span>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                                        {trip.status}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{trip.routeName}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{trip.vehicleId} · {trip.driver}</p>
                            </button>
                        ))}
                    </div>

                    {/* Selected Trip Detail */}
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                        {selectedTrip ? (
                            <div>
                                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Selected Trip</h4>
                                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 mb-4">
                                    <p className="font-semibold text-slate-900 dark:text-white">
                                        {selectedTrip.label} · {selectedTrip.day} {selectedTrip.time}
                                    </p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{selectedTrip.routeName}</p>

                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Vehicle</p>
                                            <p className="font-medium text-slate-900 dark:text-white">🚌 {selectedTrip.vehicleId}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Driver</p>
                                            <p className="font-medium text-slate-900 dark:text-white">👤 {selectedTrip.driver}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Students</p>
                                            <p className="font-medium text-slate-900 dark:text-white">👥 {selectedTrip.students}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Link
                                        to={`/school-shuttles/routes/${selectedTrip.routeId}`}
                                        className="flex-1 px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 text-center"
                                    >
                                        View Route
                                    </Link>
                                    <Link
                                        to={`/school-shuttles/trips/${selectedTrip.id}`}
                                        className="flex-1 px-4 py-2 rounded-xl bg-ev-green text-white text-sm font-medium hover:bg-emerald-600 transition text-center shadow-lg shadow-emerald-500/20"
                                    >
                                        Open Trip Detail →
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500 dark:text-slate-400">Select a trip from the list to see details.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
