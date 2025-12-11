import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

export default function ShuttleTrackLivePage() {
    const { routeId } = useParams();
    const [currentLocation, setCurrentLocation] = useState("Kamwokya Junction");
    const [progress, setProgress] = useState(40);

    const route = {
        id: routeId,
        name: "Morning Route A - Kampala Central",
        driver: "David Mukasa",
        vehicle: "UAA 300K",
        stops: [
            { id: 1, name: "Kololo Main Gate", status: "completed", time: "06:30 AM", actual: "06:32 AM" },
            { id: 2, name: "Kamwokya Junction", status: "current", time: "06:50 AM", actual: "In progress" },
            { id: 3, name: "Ntinda Shopping Center", status: "upcoming", time: "07:10 AM", actual: "-" },
            { id: 4, name: "Nakawa Market", status: "upcoming", time: "07:30 AM", actual: "-" },
            { id: 5, name: "Bugolobi Flats", status: "upcoming", time: "07:50 AM", actual: "-" },
            { id: 6, name: "School - St. Mary's", status: "upcoming", time: "08:30 AM", actual: "-" }
        ],
        students: 26,
        onboard: 8,
        eta: "08:35 AM"
    };

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => (prev < 100 ? prev + 0.5 : prev));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "current":
                return "bg-blue-100 text-blue-700 border-blue-200";
            case "upcoming":
                return "bg-slate-100 text-slate-600 border-slate-200";
            default:
                return "bg-slate-100 text-slate-600 border-slate-200";
        }
    };

    return (
        <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
            <div className="w-full">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        to={`/school-shuttles/routes/${routeId}`}
                        className="text-sm text-slate-600 hover:text-slate-900 mb-2 inline-block"
                    >
                        ← Back to route details
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-slate-900 mb-2">{route.name}</h1>
                            <p className="text-sm text-slate-600">Live tracking for {route.driver} · {route.vehicle}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-sm font-medium text-emerald-700">Live</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Stats */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4">
                        <p className="text-sm text-slate-600 mb-1">Students Onboard</p>
                        <p className="text-2xl font-semibold text-slate-900">{route.onboard}/{route.students}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 p-4">
                        <p className="text-sm text-slate-600 mb-1">Current Location</p>
                        <p className="text-lg font-semibold text-slate-900">📍 {currentLocation}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 p-4">
                        <p className="text-sm text-slate-600 mb-1">Estimated Arrival</p>
                        <p className="text-2xl font-semibold text-emerald-600">{route.eta}</p>
                    </div>
                </div>

                {/* Map Placeholder */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                    <div className="aspect-video rounded-lg bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-4xl mb-2">🗺️</div>
                            <p className="text-sm font-medium text-slate-900">Live GPS Map</p>
                            <p className="text-xs text-slate-600 mt-1">Real-time vehicle location tracking</p>
                            <div className="mt-4 flex items-center justify-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                <span className="text-xs text-slate-600">Vehicle currently moving</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-semibold text-slate-900">Route Progress</h2>
                        <span className="text-sm font-semibold text-ev-green">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
                        <div
                            className="bg-ev-green rounded-full h-3 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-xs text-slate-600">Stop 2 of {route.stops.length} · On schedule</p>
                </div>

                {/* Stops Timeline */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Route Timeline</h2>
                    <div className="space-y-3">
                        {route.stops.map((stop, index) => (
                            <div
                                key={stop.id}
                                className={`flex items-center gap-4 p-4 rounded-lg border ${getStatusColor(stop.status)}`}
                            >
                                <div className="flex items-center gap-3 flex-1">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${stop.status === "completed"
                                            ? "bg-emerald-500 text-white"
                                            : stop.status === "current"
                                                ? "bg-blue-500 text-white"
                                                : "bg-slate-300 text-slate-600"
                                            }`}
                                    >
                                        {stop.status === "completed" ? "✓" : index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-900">{stop.name}</p>
                                        <p className="text-sm text-slate-600">
                                            Scheduled: {stop.time}
                                            {stop.status === "current" && " · In progress"}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span
                                        className={`px-3 py-1 text-xs font-medium rounded-full ${stop.status === "completed"
                                            ? "bg-emerald-100 text-emerald-700"
                                            : stop.status === "current"
                                                ? "bg-blue-100 text-blue-700"
                                                : "bg-slate-100 text-slate-600"
                                            }`}
                                    >
                                        {stop.status === "completed"
                                            ? `Actual: ${stop.actual}`
                                            : stop.status === "current"
                                                ? "Current"
                                                : "Upcoming"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Driver Contact */}
                <div className="mt-6 bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-600">Driver Contact</p>
                        <p className="font-semibold text-slate-900">{route.driver} · +256 700 444 555</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark">
                            📞 Call Driver
                        </button>
                        <button className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50">
                            💬 Message
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
