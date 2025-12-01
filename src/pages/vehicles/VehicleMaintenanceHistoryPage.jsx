import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function VehicleMaintenanceHistoryPage() {
  const { vehicleId } = useParams();
  const [showForm, setShowForm] = useState(false);

  const maintenanceRecords = [
    { id: 1, type: "Oil change", date: "2024-01-10", mileage: 12000, cost: 50000, status: "completed" },
    { id: 2, type: "Tire rotation", date: "2024-01-05", mileage: 11500, cost: 30000, status: "completed" },
    { id: 3, type: "Battery check", date: "2024-01-15", mileage: 12500, cost: 20000, status: "scheduled" }
  ];

  return (
    <div className="min-h-[calc(100vh-56px)] px-4 sm:px-6 lg:px-10 py-6 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to={`/vehicles/${vehicleId}`}
            className="text-sm text-slate-600 hover:text-slate-900 mb-2 inline-block"
          >
            ← Back to vehicle
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 mb-2">Maintenance history</h1>
              <p className="text-sm text-slate-600">Track all maintenance records for this vehicle</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark"
            >
              + Schedule maintenance
            </button>
          </div>
        </div>

        {/* Maintenance Records */}
        <div className="space-y-4">
          {maintenanceRecords.map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">{record.type}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span>Date: {record.date}</span>
                    <span>Mileage: {record.mileage.toLocaleString()} km</span>
                    <span>Cost: UGX {record.cost.toLocaleString()}</span>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    record.status === "completed"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {record.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
