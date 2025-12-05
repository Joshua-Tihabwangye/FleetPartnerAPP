import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function ToursListPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const tours = [
    { id: 1, name: "Kampala City Tour", vehicle: "UAA 123A", status: "active", bookings: 12, capacity: 20 },
    { id: 2, name: "Safari Adventure", vehicle: "UAA 124B", status: "scheduled", bookings: 8, capacity: 15 },
    { id: 3, name: "Cultural Heritage Tour", vehicle: "UAA 125C", status: "completed", bookings: 18, capacity: 20 }
  ];

  return (
    <div className="min-h-[calc(100vh-56px)] px-4 sm:px-6 lg:px-10 py-6 bg-slate-50">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Tours & charters</h1>
          <p className="text-sm text-slate-600">Manage tour packages and charter services</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/tours/bookings"
            className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            View bookings
          </Link>
          <Link
            to="/tours/create"
            className="px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark"
          >
            + Create Tour
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tours by name..."
          className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
        />
      </div>

      {/* Tours Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tours.map((tour) => (
          <Link
            key={tour.id}
            to={`/tours/${tour.id}`}
            className="bg-white rounded-xl border border-slate-200 p-6 hover:border-ev-green hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">{tour.name}</h3>
                <div className="text-sm text-slate-600">Vehicle: {tour.vehicle}</div>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${tour.status === "active"
                    ? "bg-emerald-100 text-emerald-700"
                    : tour.status === "scheduled"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
              >
                {tour.status}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Bookings</span>
                <span className="font-medium text-slate-900">{tour.bookings}/{tour.capacity}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-ev-green h-2 rounded-full"
                  style={{ width: `${(tour.bookings / tour.capacity) * 100}%` }}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
