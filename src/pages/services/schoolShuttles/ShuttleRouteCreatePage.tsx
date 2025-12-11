import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toastManager } from "../../../utils/toastManager";

export default function ShuttleRouteCreatePage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        school: "",
        pickupTime: "",
        dropoffTime: "",
        vehicle: "",
        driver: "",
        capacity: "",
        daysOfWeek: [] as string[],
        stops: [{ name: "", time: "" }]
    });

    const daysOptions = ["Mon", "Tue", "Wed", "Thu", "Fri"];

    const handleDayToggle = (day: string) => {
        setFormData(prev => ({
            ...prev,
            daysOfWeek: prev.daysOfWeek.includes(day)
                ? prev.daysOfWeek.filter(d => d !== day)
                : [...prev.daysOfWeek, day]
        }));
    };

    const addStop = () => {
        setFormData(prev => ({
            ...prev,
            stops: [...prev.stops, { name: "", time: "" }]
        }));
    };

    const removeStop = (index: number) => {
        setFormData(prev => ({
            ...prev,
            stops: prev.stops.filter((_, i) => i !== index)
        }));
    };

    const updateStop = (index: number, field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            stops: prev.stops.map((stop, i) =>
                i === index ? { ...stop, [field]: value } : stop
            )
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Save to localStorage
        const existingRoutes = JSON.parse(localStorage.getItem("shuttle_routes") || "[]");
        const newRoute = {
            id: Date.now(),
            ...formData,
            status: "active",
            studentsCount: 0,
            createdAt: new Date().toISOString()
        };
        localStorage.setItem("shuttle_routes", JSON.stringify([...existingRoutes, newRoute]));

        toastManager.show("Shuttle route created successfully!", "success");
        navigate("/school-shuttles/routes");
    };

    return (
        <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
            <div className="w-full">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        to="/school-shuttles/routes"
                        className="text-sm text-slate-600 hover:text-slate-900 mb-2 inline-block"
                    >
                        ← Back to Routes
                    </Link>
                    <h1 className="text-2xl font-semibold text-slate-900 mb-1">Create Shuttle Route</h1>
                    <p className="text-sm text-slate-600">Set up a new school shuttle route</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {/* Basic Info */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-slate-900 mb-4">Route Details</h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <label className="block sm:col-span-2">
                                    <span className="text-sm font-medium text-slate-700 mb-1 block">Route Name *</span>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-ev-green focus:outline-none"
                                        placeholder="e.g., Kololo Morning Route"
                                        required
                                    />
                                </label>

                                <label className="block sm:col-span-2">
                                    <span className="text-sm font-medium text-slate-700 mb-1 block">School *</span>
                                    <input
                                        type="text"
                                        value={formData.school}
                                        onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-ev-green focus:outline-none"
                                        placeholder="e.g., Kampala International School"
                                        required
                                    />
                                </label>

                                <label className="block">
                                    <span className="text-sm font-medium text-slate-700 mb-1 block">Morning Pickup Time</span>
                                    <input
                                        type="time"
                                        value={formData.pickupTime}
                                        onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-ev-green focus:outline-none"
                                    />
                                </label>

                                <label className="block">
                                    <span className="text-sm font-medium text-slate-700 mb-1 block">Afternoon Dropoff Time</span>
                                    <input
                                        type="time"
                                        value={formData.dropoffTime}
                                        onChange={(e) => setFormData({ ...formData, dropoffTime: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-ev-green focus:outline-none"
                                    />
                                </label>

                                <label className="block">
                                    <span className="text-sm font-medium text-slate-700 mb-1 block">Vehicle *</span>
                                    <select
                                        value={formData.vehicle}
                                        onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-ev-green focus:outline-none"
                                        required
                                    >
                                        <option value="">Select vehicle...</option>
                                        <option value="UAA 126D">UAA 126D - Toyota Coaster EV</option>
                                        <option value="UAA 127E">UAA 127E - BYD K7 Electric Bus</option>
                                        <option value="UAA 128F">UAA 128F - Yutong E12</option>
                                    </select>
                                </label>

                                <label className="block">
                                    <span className="text-sm font-medium text-slate-700 mb-1 block">Driver *</span>
                                    <select
                                        value={formData.driver}
                                        onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-ev-green focus:outline-none"
                                        required
                                    >
                                        <option value="">Select driver...</option>
                                        <option value="James Ssemakula">James Ssemakula</option>
                                        <option value="Grace Namuddu">Grace Namuddu</option>
                                        <option value="Robert Kizza">Robert Kizza</option>
                                    </select>
                                </label>

                                <label className="block">
                                    <span className="text-sm font-medium text-slate-700 mb-1 block">Capacity *</span>
                                    <input
                                        type="number"
                                        value={formData.capacity}
                                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-ev-green focus:outline-none"
                                        placeholder="e.g., 30"
                                        min="1"
                                        required
                                    />
                                </label>

                                <div className="block">
                                    <span className="text-sm font-medium text-slate-700 mb-2 block">Operating Days</span>
                                    <div className="flex flex-wrap gap-2">
                                        {daysOptions.map((day) => (
                                            <label
                                                key={day}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition ${formData.daysOfWeek.includes(day)
                                                    ? "bg-ev-green text-white"
                                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={formData.daysOfWeek.includes(day)}
                                                    onChange={() => handleDayToggle(day)}
                                                    className="sr-only"
                                                />
                                                {day}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stops */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-slate-900">Route Stops</h2>
                                <button
                                    type="button"
                                    onClick={addStop}
                                    className="text-sm text-ev-green hover:text-ev-green-dark font-medium"
                                >
                                    + Add Stop
                                </button>
                            </div>

                            <div className="space-y-3">
                                {formData.stops.map((stop, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-ev-green text-white text-xs flex items-center justify-center">
                                            {index + 1}
                                        </span>
                                        <input
                                            type="text"
                                            value={stop.name}
                                            onChange={(e) => updateStop(index, "name", e.target.value)}
                                            className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-ev-green focus:outline-none"
                                            placeholder="Stop location"
                                        />
                                        <input
                                            type="time"
                                            value={stop.time}
                                            onChange={(e) => updateStop(index, "time", e.target.value)}
                                            className="w-28 px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-ev-green focus:outline-none"
                                        />
                                        {formData.stops.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeStop(index)}
                                                className="text-red-500 hover:text-red-600"
                                            >
                                                🗑️
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <Link
                            to="/school-shuttles/routes"
                            className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="px-6 py-2 rounded-lg bg-gradient-to-r from-ev-green to-emerald-600 text-white text-sm font-medium hover:opacity-90 transition"
                        >
                            Create Route
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
