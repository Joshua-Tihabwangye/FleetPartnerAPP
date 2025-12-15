import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ShuttleTripCreatePage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        routeId: "",
        vehicleId: "",
        driverId: "",
        date: new Date().toISOString().split("T")[0],
        time: "07:00",
        type: "pickup"
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Logic to save would go here
        console.log("Saving trip:", formData);
        navigate("/school-shuttles/calendar");
    };

    return (
        <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50 dark:bg-slate-900">
            {/* Header */}
            <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                <Link to="/school-shuttles/calendar" className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition mb-2 inline-block">
                    ← Back to Calendar
                </Link>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                    Schedule New Trip
                </h1>
            </div>

            <div className="max-w-3xl mx-auto">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Route Selection */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Select Route
                                </label>
                                <select
                                    required
                                    value={formData.routeId}
                                    onChange={(e) => setFormData({ ...formData, routeId: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-ev-green focus:border-transparent outline-none"
                                >
                                    <option value="">-- Select Route --</option>
                                    <option value="R-001">R-001: Morning Pickup (North)</option>
                                    <option value="R-002">R-002: Afternoon Dropoff (South)</option>
                                </select>
                            </div>

                            {/* Trip Type */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Trip Type
                                </label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-ev-green focus:border-transparent outline-none"
                                >
                                    <option value="pickup">Morning Pickup</option>
                                    <option value="dropoff">Afternoon Dropoff</option>
                                    <option value="field_trip">Field Trip</option>
                                </select>
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-ev-green focus:border-transparent outline-none"
                                />
                            </div>

                            {/* Time */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Start Time
                                </label>
                                <input
                                    type="time"
                                    required
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-ev-green focus:border-transparent outline-none"
                                />
                            </div>

                            {/* Vehicle */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Assign Vehicle
                                </label>
                                <select
                                    required
                                    value={formData.vehicleId}
                                    onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-ev-green focus:border-transparent outline-none"
                                >
                                    <option value="">-- Select Vehicle --</option>
                                    <option value="BUS-01">BUS-01 (Capacity: 30)</option>
                                    <option value="BUS-02">BUS-02 (Capacity: 45)</option>
                                </select>
                            </div>

                            {/* Driver */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Assign Driver
                                </label>
                                <select
                                    required
                                    value={formData.driverId}
                                    onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-ev-green focus:border-transparent outline-none"
                                >
                                    <option value="">-- Select Driver --</option>
                                    <option value="DRV-01">John Doe</option>
                                    <option value="DRV-02">Jane Smith</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => navigate("/school-shuttles/calendar")}
                                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 rounded-lg bg-ev-green text-white font-medium hover:bg-emerald-600 transition shadow-lg shadow-emerald-500/20"
                            >
                                Schedule Trip
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
