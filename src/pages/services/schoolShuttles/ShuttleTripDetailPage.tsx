import React from "react";
import { Link, useParams } from "react-router-dom";

export default function ShuttleTripDetailPage() {
    const { tripId } = useParams();

    // Mock data - in a real app, fetch based on tripId
    const trip = {
        id: tripId,
        route: "R-001: Morning Pickup (North)",
        status: "scheduled",
        date: "2025-12-16",
        time: "07:00",
        vehicle: "BUS-01",
        driver: "John Doe",
        attendant: "Sarah Connor",
        studentsCount: 28,
        type: "Pickup"
    };

    return (
        <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50 dark:bg-slate-900">
            {/* Header */}
            <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <Link to="/school-shuttles/calendar" className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition mb-2 inline-block">
                            ← Back to Calendar
                        </Link>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            Trip Details: {trip.id}
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 border border-blue-200">
                                {trip.status}
                            </span>
                        </h1>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 transition">
                            Edit Trip
                        </button>
                        <button className="px-4 py-2 rounded-xl bg-ev-green text-white font-medium hover:bg-emerald-600 transition shadow-lg shadow-emerald-500/20">
                            Start Trip
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Trip Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Route</p>
                                <div className="font-medium text-slate-900 dark:text-white">{trip.route}</div>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Date & Time</p>
                                <div className="font-medium text-slate-900 dark:text-white">{trip.date} at {trip.time}</div>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Type</p>
                                <div className="font-medium text-slate-900 dark:text-white">{trip.type}</div>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Students</p>
                                <div className="font-medium text-slate-900 dark:text-white">{trip.studentsCount} Assigend</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Assigned Resources</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600">
                                <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Vehicle</p>
                                <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    🚌 {trip.vehicle}
                                </div>
                            </div>
                            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600">
                                <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Driver</p>
                                <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    👤 {trip.driver}
                                </div>
                            </div>
                            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600">
                                <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Attendant</p>
                                <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    👮 {trip.attendant}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar / Map Placeholder */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm h-64 flex items-center justify-center bg-slate-50">
                        <div className="text-center text-slate-400">
                            <span className="text-4xl">🗺️</span>
                            <p className="mt-2 text-sm">Route Map Preview</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Quick Actions</h3>
                        <div className="space-y-2">
                            <button className="w-full py-2 px-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-300 transition">
                                📄 View Student Manifest
                            </button>
                            <button className="w-full py-2 px-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-300 transition">
                                ⚠️ Report Incident
                            </button>
                            <button className="w-full py-2 px-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-300 transition">
                                🖨️ Print Trip Sheet
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
