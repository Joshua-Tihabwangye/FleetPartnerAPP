import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toastManager } from "../../utils/toastManager";

export default function VehicleEditPage() {
    const { vehicleId } = useParams();
    const navigate = useNavigate();

    // Mock data - in production, fetch from API
    const [formData, setFormData] = useState({
        plate: "UAA 123A",
        model: "Tesla Model 3",
        year: "2023",
        type: "sedan",
        capacity: "5",
        color: "White",
        vin: "5YJ3E1EA8KF000001",
        status: "active"
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Save to localStorage
        const vehicles = JSON.parse(localStorage.getItem("vehicles") || "[]");
        const index = vehicles.findIndex(v => v.id === vehicleId);
        if (index !== -1) {
            vehicles[index] = { ...vehicles[index], ...formData };
            localStorage.setItem("vehicles", JSON.stringify(vehicles));
        }

        toastManager.show("Vehicle updated successfully!", "success");
        navigate(`/vehicles/${vehicleId}`);
    };

    return (
        <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
            <div className="w-full">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        to={`/vehicles/${vehicleId}`}
                        className="text-sm text-slate-600 hover:text-slate-900 mb-2 inline-block"
                    >
                        ← Back to vehicle details
                    </Link>
                    <h1 className="text-2xl font-semibold text-slate-900">Edit Vehicle</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="block">
                                <span className="text-sm font-medium text-slate-700 mb-1 block">License Plate *</span>
                                <input
                                    type="text"
                                    value={formData.plate}
                                    onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                                    required
                                />
                            </label>

                            <label className="block">
                                <span className="text-sm font-medium text-slate-700 mb-1 block">Model *</span>
                                <input
                                    type="text"
                                    value={formData.model}
                                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                                    required
                                />
                            </label>

                            <label className="block">
                                <span className="text-sm font-medium text-slate-700 mb-1 block">Year *</span>
                                <input
                                    type="number"
                                    value={formData.year}
                                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                    min="2000"
                                    max="2030"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                                    required
                                />
                            </label>

                            <label className="block">
                                <span className="text-sm font-medium text-slate-700 mb-1 block">VIN *</span>
                                <input
                                    type="text"
                                    value={formData.vin}
                                    onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                                    required
                                />
                            </label>

                            <label className="block">
                                <span className="text-sm font-medium text-slate-700 mb-1 block">Type *</span>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                                    required
                                >
                                    <option value="sedan">Sedan</option>
                                    <option value="suv">SUV</option>
                                    <option value="van">Van</option>
                                    <option value="bus">Bus</option>
                                    <option value="truck">Truck</option>
                                </select>
                            </label>

                            <label className="block">
                                <span className="text-sm font-medium text-slate-700 mb-1 block">Capacity *</span>
                                <input
                                    type="number"
                                    value={formData.capacity}
                                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                    min="1"
                                    max="50"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                                    required
                                />
                            </label>

                            <label className="block">
                                <span className="text-sm font-medium text-slate-700 mb-1 block">Color *</span>
                                <input
                                    type="text"
                                    value={formData.color}
                                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                                    required
                                />
                            </label>

                            <label className="block">
                                <span className="text-sm font-medium text-slate-700 mb-1 block">Status *</span>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                                    required
                                >
                                    <option value="active">Active</option>
                                    <option value="maintenance">Maintenance</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </label>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3">
                        <Link
                            to={`/vehicles/${vehicleId}`}
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
