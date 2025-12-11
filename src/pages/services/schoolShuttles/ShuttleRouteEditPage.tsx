import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toastManager } from "../../../utils/toastManager";

export default function ShuttleRouteEditPage() {
    const { routeId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "Morning Route A - Kampala Central",
        description: "Main morning pickup route covering Kololo, Kamwokya, and Nakawa areas",
        departureTime: "06:30",
        arrivalTime: "08:30",
        days: "weekdays",
        customDays: [], // Array to store selected days when "custom" is chosen
        vehicle: "UAA 300K",
        driver: "David Mukasa",
        stops: [
            { id: 1, location: "Kololo Main Gate", time: "06:30", students: 8 },
            { id: 2, location: "Kamwokya Junction", time: "06:50", students: 6 },
            { id: 3, location: "Ntinda Shopping Center", time: "07:10", students: 5 },
            { id: 4, location: "Nakawa Market", time: "07:30", students: 4 },
            { id: 5, location: "Bugolobi Flats", time: "07:50", students: 3 },
            { id: 6, location: "School - St. Mary's", time: "08:30", students: 0 }
        ]
    });

    const daysOfWeek = [
        { value: 'monday', label: 'Monday' },
        { value: 'tuesday', label: 'Tuesday' },
        { value: 'wednesday', label: 'Wednesday' },
        { value: 'thursday', label: 'Thursday' },
        { value: 'friday', label: 'Friday' },
        { value: 'saturday', label: 'Saturday' },
        { value: 'sunday', label: 'Sunday' }
    ];

    const handleDayToggle = (day) => {
        const newCustomDays = formData.customDays.includes(day)
            ? formData.customDays.filter(d => d !== day)
            : [...formData.customDays, day];
        setFormData({ ...formData, customDays: newCustomDays });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        toastManager.show("Route updated successfully!", "success");
        navigate(`/school-shuttles/routes/${routeId}`);
    };

    const handleAddStop = () => {
        const newStop = {
            id: formData.stops.length + 1,
            location: "",
            time: "",
            students: 0
        };
        setFormData({ ...formData, stops: [...formData.stops, newStop] });
    };

    const handleRemoveStop = (index) => {
        const newStops = formData.stops.filter((_, i) => i !== index);
        setFormData({ ...formData, stops: newStops });
    };

    const handleStopChange = (index, field, value) => {
        const newStops = [...formData.stops];
        newStops[index][field] = value;
        setFormData({ ...formData, stops: newStops });
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
                    <h1 className="text-2xl font-semibold text-slate-900">Edit Route</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h2>
                        <div className="space-y-4">
                            <label className="block">
                                <span className="text-sm font-medium text-slate-700 mb-1 block">Route Name *</span>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                                    required
                                />
                            </label>
                            <label className="block">
                                <span className="text-sm font-medium text-slate-700 mb-1 block">Description</span>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Schedule */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Schedule</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <label className="block">
                                <span className="text-sm font-medium text-slate-700 mb-1 block">Departure Time *</span>
                                <input
                                    type="time"
                                    value={formData.departureTime}
                                    onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                                    required
                                />
                            </label>
                            <label className="block">
                                <span className="text-sm font-medium text-slate-700 mb-1 block">Arrival Time *</span>
                                <input
                                    type="time"
                                    value={formData.arrivalTime}
                                    onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                                    required
                                />
                            </label>
                            <label className="block">
                                <span className="text-sm font-medium text-slate-700 mb-1 block">Days *</span>
                                <select
                                    value={formData.days}
                                    onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                                    required
                                >
                                    <option value="weekdays">Monday - Friday</option>
                                    <option value="daily">Daily</option>
                                    <option value="custom">Custom</option>
                                </select>
                            </label>
                        </div>

                        {/* Custom Day Picker */}
                        {formData.days === 'custom' && (
                            <div className="mt-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
                                <span className="text-sm font-medium text-slate-700 mb-3 block">Select Pickup Days *</span>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {daysOfWeek.map((day) => (
                                        <label
                                            key={day.value}
                                            className="flex items-center gap-2 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.customDays.includes(day.value)}
                                                onChange={() => handleDayToggle(day.value)}
                                                className="w-4 h-4 text-ev-green border-slate-300 rounded focus:ring-2 focus:ring-ev-green"
                                            />
                                            <span className="text-sm text-slate-700">{day.label}</span>
                                        </label>
                                    ))}
                                </div>
                                {formData.customDays.length > 0 && (
                                    <div className="mt-3 text-xs text-slate-600">
                                        Selected: {formData.customDays.map(d => daysOfWeek.find(day => day.value === d)?.label).join(', ')}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Assignments */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Assignments</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="block">
                                <span className="text-sm font-medium text-slate-700 mb-1 block">Vehicle *</span>
                                <select
                                    value={formData.vehicle}
                                    onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                                    required
                                >
                                    <option value="UAA 300K">UAA 300K - Toyota Coaster Bus</option>
                                    <option value="UAA 301K">UAA 301K - Nissan Civilian</option>
                                    <option value="UAA 302K">UAA 302K - Mercedes Sprinter</option>
                                </select>
                            </label>
                            <label className="block">
                                <span className="text-sm font-medium text-slate-700 mb-1 block">Driver *</span>
                                <select
                                    value={formData.driver}
                                    onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                                    required
                                >
                                    <option value="David Mukasa">David Mukasa</option>
                                    <option value="Grace Nambi">Grace Nambi</option>
                                    <option value="John Okello">John Okello</option>
                                </select>
                            </label>
                        </div>
                    </div>

                    {/* Route Stops */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-slate-900">Route Stops</h2>
                            <button
                                type="button"
                                onClick={handleAddStop}
                                className="px-3 py-1.5 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark"
                            >
                                + Add Stop
                            </button>
                        </div>
                        <div className="space-y-3">
                            {formData.stops.map((stop, index) => (
                                <div key={stop.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                                    <span className="w-8 h-8 rounded-full bg-ev-green text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                                        {index + 1}
                                    </span>
                                    <input
                                        type="text"
                                        value={stop.location}
                                        onChange={(e) => handleStopChange(index, 'location', e.target.value)}
                                        placeholder="Location"
                                        className="flex-1 px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                                        required
                                    />
                                    <input
                                        type="time"
                                        value={stop.time}
                                        onChange={(e) => handleStopChange(index, 'time', e.target.value)}
                                        className="w-32 px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                                        required
                                    />
                                    {index > 0 && index < formData.stops.length - 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveStop(index)}
                                            className="px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm hover:bg-red-100"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3">
                        <Link
                            to={`/school-shuttles/routes/${routeId}`}
                            className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="px-6 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
