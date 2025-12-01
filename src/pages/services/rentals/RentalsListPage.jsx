import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function RentalsListPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const rentals = [
    { id: 1, bookingId: "RNT-001", customer: "John Customer", vehicle: "UAA 123A", status: "active", startDate: "2024-01-15", endDate: "2024-01-20" },
    { id: 2, bookingId: "RNT-002", customer: "Jane Client", vehicle: "UAA 124B", status: "upcoming", startDate: "2024-01-18", endDate: "2024-01-25" },
    { id: 3, bookingId: "RNT-003", customer: "Mike User", vehicle: "UAA 125C", status: "completed", startDate: "2024-01-10", endDate: "2024-01-14" }
  ];

  return (
    <div className="min-h-[calc(100vh-56px)] px-4 sm:px-6 lg:px-10 py-6 bg-slate-50">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Rental bookings</h1>
          <p className="text-sm text-slate-600">Manage car rental bookings and reservations</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/rentals/catalog"
            className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Catalog
          </Link>
          <Link
            to="/settings/rentals"
            className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Settings
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search bookings by ID, customer, vehicle..."
          className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
        />
      </div>

      {/* Rentals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rentals.map((rental) => (
          <Link
            key={rental.id}
            to={`/rentals/${rental.id}`}
            className="bg-white rounded-xl border border-slate-200 p-6 hover:border-ev-green hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-lg font-semibold text-slate-900 mb-1">{rental.bookingId}</div>
                <div className="text-sm text-slate-600">{rental.customer}</div>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  rental.status === "active"
                    ? "bg-emerald-100 text-emerald-700"
                    : rental.status === "upcoming"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {rental.status}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Vehicle</span>
                <span className="font-medium text-slate-900">{rental.vehicle}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Start date</span>
                <span className="font-medium text-slate-900">{rental.startDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">End date</span>
                <span className="font-medium text-slate-900">{rental.endDate}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
