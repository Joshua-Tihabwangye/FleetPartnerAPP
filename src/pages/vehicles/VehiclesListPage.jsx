import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function VehiclesListPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const vehicles = [
    { id: 1, plate: "UAA 123A", model: "Tesla Model 3", status: "active", driver: "John Doe", mileage: 12500 },
    { id: 2, plate: "UAA 124B", model: "Nissan Leaf", status: "maintenance", driver: "Jane Smith", mileage: 8900 },
    { id: 3, plate: "UAA 125C", model: "BYD E6", status: "active", driver: "Mike Johnson", mileage: 15200 }
  ];

  return (
    <div className="min-h-[calc(100vh-56px)] px-4 sm:px-6 lg:px-10 py-6 bg-slate-50">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Vehicles</h1>
          <p className="text-sm text-slate-600">Manage your fleet vehicles and their status</p>
        </div>
        <Link
          to="/vehicles/new"
          className="px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark transition-colors"
        >
          + Add vehicle
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vehicles by plate, model..."
            className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50">
            Filter
          </button>
          <button className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50">
            Export
          </button>
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((vehicle) => (
          <Link
            key={vehicle.id}
            to={`/vehicles/${vehicle.id}`}
            className="bg-white rounded-xl border border-slate-200 p-6 hover:border-ev-green hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-lg font-semibold text-slate-900 mb-1">{vehicle.plate}</div>
                <div className="text-sm text-slate-600">{vehicle.model}</div>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  vehicle.status === "active"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {vehicle.status}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Driver</span>
                <span className="font-medium text-slate-900">{vehicle.driver}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Mileage</span>
                <span className="font-medium text-slate-900">{vehicle.mileage.toLocaleString()} km</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
              <Link
                to={`/vehicles/${vehicle.id}/maintenance`}
                className="flex-1 text-center px-3 py-1.5 rounded-lg bg-slate-50 text-xs font-medium text-slate-700 hover:bg-slate-100"
                onClick={(e) => e.stopPropagation()}
              >
                Maintenance
              </Link>
              <Link
                to={`/vehicles/${vehicle.id}/documents`}
                className="flex-1 text-center px-3 py-1.5 rounded-lg bg-slate-50 text-xs font-medium text-slate-700 hover:bg-slate-100"
                onClick={(e) => e.stopPropagation()}
              >
                Documents
              </Link>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
