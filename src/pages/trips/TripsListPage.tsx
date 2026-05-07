import React, { useState } from "react";
import { Link } from "react-router-dom";

interface Trip {
  id: number;
  tripId: string;
  driver: string;
  vehicle: string;
  status: "completed" | "in-progress" | "cancelled" | "scheduled" | "unassigned";
  amount: number;
  date: string;
  // New fields
  pickup: string;
  dropoff: string;
  startTime: string;
  endTime: string;
  serviceType: "ride" | "delivery" | "shuttle" | "ems";
  paymentStatus: "pending" | "paid" | "disputed";
}

export default function TripsListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeKpi, setActiveKpi] = useState<string | null>(null);

  const trips: Trip[] = [
    { id: 1, tripId: "TR-001", driver: "John Doe", vehicle: "UAA 123A", status: "completed", amount: 15000, date: "2024-01-15", pickup: "Garden City Mall", dropoff: "Entebbe Airport", startTime: "09:30", endTime: "10:45", serviceType: "ride", paymentStatus: "paid" },
    { id: 2, tripId: "TR-002", driver: "Jane Smith", vehicle: "UAA 124B", status: "in-progress", amount: 12000, date: "2024-01-15", pickup: "Acacia Mall", dropoff: "Kololo", startTime: "11:00", endTime: "-", serviceType: "ride", paymentStatus: "pending" },
    { id: 3, tripId: "TR-003", driver: "Mike Johnson", vehicle: "UAA 125C", status: "cancelled", amount: 0, date: "2024-01-14", pickup: "Nakasero", dropoff: "Ntinda", startTime: "08:15", endTime: "08:20", serviceType: "delivery", paymentStatus: "pending" },
    { id: 4, tripId: "TR-004", driver: "Sarah Wilson", vehicle: "UAA 126D", status: "scheduled", amount: 25000, date: "2024-01-16", pickup: "Kampala Central", dropoff: "Jinja Road", startTime: "14:00", endTime: "-", serviceType: "shuttle", paymentStatus: "pending" },
    { id: 5, tripId: "TR-005", driver: "-", vehicle: "-", status: "unassigned", amount: 18000, date: "2024-01-15", pickup: "Muyenga", dropoff: "Bugolobi", startTime: "15:30", endTime: "-", serviceType: "ride", paymentStatus: "pending" },
    { id: 6, tripId: "TR-006", driver: "David Brown", vehicle: "UAA 127E", status: "completed", amount: 45000, date: "2024-01-14", pickup: "Mulago Hospital", dropoff: "Nakawa", startTime: "06:30", endTime: "07:15", serviceType: "ems", paymentStatus: "paid" },
    { id: 7, tripId: "TR-007", driver: "Emily Davis", vehicle: "UAA 128F", status: "in-progress", amount: 8500, date: "2024-01-15", pickup: "Kisementi", dropoff: "Wandegeya", startTime: "12:45", endTime: "-", serviceType: "delivery", paymentStatus: "pending" },
    { id: 8, tripId: "TR-008", driver: "-", vehicle: "-", status: "unassigned", amount: 22000, date: "2024-01-15", pickup: "Naalya", dropoff: "Kyanja", startTime: "16:00", endTime: "-", serviceType: "ride", paymentStatus: "pending" },
  ];

  // KPI calculations
  const kpis = [
    { id: "today", label: "Trips today", value: trips.filter(t => t.date === "2024-01-15").length, color: "bg-slate-100 text-slate-700 hover:bg-slate-200" },
    { id: "in-progress", label: "In-progress", value: trips.filter(t => t.status === "in-progress").length, color: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
    { id: "unassigned", label: "Unassigned", value: trips.filter(t => t.status === "unassigned").length, color: "bg-amber-100 text-amber-700 hover:bg-amber-200" },
    { id: "cancelled", label: "Exceptions", value: trips.filter(t => t.status === "cancelled").length, color: "bg-red-100 text-red-700 hover:bg-red-200" },
    { id: "pending", label: "Pending payout", value: trips.filter(t => t.paymentStatus === "pending" && t.status === "completed").length, color: "bg-purple-100 text-purple-700 hover:bg-purple-200" },
  ];

  // Filter based on active KPI
  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.tripId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.vehicle.toLowerCase().includes(searchQuery.toLowerCase());

    if (!activeKpi) return matchesSearch;

    switch (activeKpi) {
      case "today": return matchesSearch && trip.date === "2024-01-15";
      case "in-progress": return matchesSearch && trip.status === "in-progress";
      case "unassigned": return matchesSearch && trip.status === "unassigned";
      case "cancelled": return matchesSearch && trip.status === "cancelled";
      case "pending": return matchesSearch && trip.paymentStatus === "pending" && trip.status === "completed";
      default: return matchesSearch;
    }
  });

  const statusStyles: Record<string, string> = {
    completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    "in-progress": "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
    scheduled: "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
    unassigned: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  };

  const paymentStyles: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    paid: "bg-emerald-100 text-emerald-700",
    disputed: "bg-red-100 text-red-700",
  };

  const serviceIcons: Record<string, string> = {
    ride: "🚗",
    delivery: "📦",
    shuttle: "🚌",
    ems: "🚑",
  };

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Trips & deliveries</h1>
          <p className="text-sm text-slate-600">View and manage all trips and deliveries</p>
        </div>
        <Link
          to="/dispatch/new"
          className="w-full sm:w-auto text-center px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark transition-colors shadow-md shadow-emerald-500/20"
        >
          + New dispatch
        </Link>
      </div>

      {/* KPI Summary Strip */}
      <div className="mb-6 flex flex-wrap gap-2">
        {kpis.map((kpi) => (
          <button
            key={kpi.id}
            onClick={() => setActiveKpi(activeKpi === kpi.id ? null : kpi.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeKpi === kpi.id
                ? "ring-2 ring-ev-green ring-offset-2"
                : ""
              } ${kpi.color}`}
          >
            <span className="font-bold">{kpi.value}</span>
            <span className="ml-1.5">{kpi.label}</span>
          </button>
        ))}
        {activeKpi && (
          <button
            onClick={() => setActiveKpi(null)}
            className="px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100"
          >
            ✕ Clear filter
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search trips by ID, driver, vehicle..."
            className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
          />
        </div>
        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
          <button className="flex-1 sm:flex-none px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50">
            Filter
          </button>
          <button className="flex-1 sm:flex-none px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50">
            Export
          </button>
        </div>
      </div>

      {/* Trips Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Trip ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Driver
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredTrips.map((trip) => (
                <tr key={trip.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">{trip.tripId}</div>
                    <div className="text-xs text-slate-500">{trip.date}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-slate-900 max-w-[180px] truncate" title={trip.pickup}>
                      {trip.pickup}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 max-w-[180px] truncate" title={trip.dropoff}>
                      <span>→</span> {trip.dropoff}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-600">
                    <div>{trip.startTime}</div>
                    <div className="text-slate-400">→ {trip.endTime}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm" title={trip.serviceType}>
                      {serviceIcons[trip.serviceType]} {trip.serviceType.charAt(0).toUpperCase() + trip.serviceType.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">
                    {trip.driver}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">
                    {trip.vehicle}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[trip.status]}`}>
                      {trip.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${paymentStyles[trip.paymentStatus]}`}>
                      {trip.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900">
                    UGX {trip.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/trips/${trip.id}`}
                      className="text-ev-green hover:text-ev-green-dark"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
