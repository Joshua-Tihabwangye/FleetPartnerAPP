import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function ShuttleRoutesListPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const routes = [
    { id: 1, name: "Route A - Kampala Central", vehicle: "UAA 123A", students: 25, status: "active" },
    { id: 2, name: "Route B - Entebbe", vehicle: "UAA 124B", students: 18, status: "active" },
    { id: 3, name: "Route C - Jinja", vehicle: "UAA 125C", students: 30, status: "scheduled" }
  ];

  return (
    <div className="min-h-[calc(100vh-56px)] px-4 sm:px-6 lg:px-10 py-6 bg-slate-50">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">School shuttle routes</h1>
          <p className="text-sm text-slate-600">Manage school shuttle routes and operations</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/school-shuttles/operations"
            className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Operations
          </Link>
          <Link
            to="/school-shuttles/students"
            className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Students
          </Link>
          <Link
            to="/school-shuttles/routes/create"
            className="px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark"
          >
            + Add Route
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search routes by name..."
          className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
        />
      </div>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {routes.map((route) => (
          <Link
            key={route.id}
            to={`/school-shuttles/routes/${route.id}`}
            className="bg-white rounded-xl border border-slate-200 p-6 hover:border-ev-green hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">{route.name}</h3>
                <div className="text-sm text-slate-600">Vehicle: {route.vehicle}</div>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${route.status === "active"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-blue-100 text-blue-700"
                  }`}
              >
                {route.status}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Students</span>
                <span className="font-medium text-slate-900">{route.students}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
