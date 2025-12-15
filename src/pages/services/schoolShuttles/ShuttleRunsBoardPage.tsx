import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function ShuttleRunsBoardPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const shuttleRuns = [
    {
      id: 1,
      routeName: "Morning Route A - Kampala Central",
      driver: "David Mukasa",
      vehicle: "UAA 300K (Bus)",
      status: "in-progress",
      students: 24,
      totalStops: 8,
      completedStops: 3,
      currentLocation: "Kololo",
      estimatedCompletion: "08:45 AM"
    },
    {
      id: 2,
      routeName: "Morning Route B - Nakasero",
      driver: "Grace Nambi",
      vehicle: "UAA 301K (Bus)",
      status: "scheduled",
      students: 18,
      totalStops: 6,
      completedStops: 0,
      currentLocation: "Starting point",
      estimatedCompletion: "09:00 AM"
    },
    {
      id: 3,
      routeName: "Afternoon Route A - Return",
      driver: "John Okello",
      vehicle: "UAA 302K (Van)",
      status: "scheduled",
      students: 15,
      totalStops: 7,
      completedStops: 0,
      currentLocation: "School",
      estimatedCompletion: "04:30 PM"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-progress": return "bg-blue-100 text-blue-700";
      case "scheduled": return "bg-yellow-100 text-yellow-700";
      case "completed": return "bg-emerald-100 text-emerald-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <Link
              to="/school-shuttles"
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 mb-2 inline-block"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">School Shuttle Operations</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Monitor and manage shuttle runs in real-time</p>
          </div>

        </div>
      </div>

      {/* Date Selector */}
      <div className="mb-6 flex items-center gap-4">
        <label className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700">Date:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
          />
        </label>
        <div className="flex gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-xs font-medium text-blue-700">
            {shuttleRuns.filter(r => r.status === 'in-progress').length} In Progress
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-yellow-50 border border-yellow-200 text-xs font-medium text-yellow-700">
            {shuttleRuns.filter(r => r.status === 'scheduled').length} Scheduled
          </div>
        </div>
      </div>

      {/* Shuttle Runs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {shuttleRuns.map((run) => (
          <div
            key={run.id}
            className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 mb-1">{run.routeName}</h3>
                <p className="text-sm text-slate-600">{run.vehicle}</p>
              </div>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(run.status)}`}>
                {run.status.replace('-', ' ').toUpperCase()}
              </span>
            </div>

            {/* Driver & Students */}
            <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs text-slate-500">Driver</span>
                <p className="font-medium text-slate-900">{run.driver}</p>
              </div>
              <div>
                <span className="text-xs text-slate-500">Students</span>
                <p className="font-medium text-slate-900">{run.students} students</p>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700">Route Progress</span>
                <span className="text-xs text-slate-600">{run.completedStops}/{run.totalStops} stops</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-ev-green rounded-full h-2 transition-all"
                  style={{ width: `${(run.completedStops / run.totalStops) * 100}%` }}
                />
              </div>
            </div>

            {/* Current Location */}
            <div className="mb-4">
              <span className="text-xs text-slate-500">Current Location</span>
              <p className="font-medium text-slate-900">📍 {run.currentLocation}</p>
            </div>

            {/* ETA */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div>
                <span className="text-xs text-slate-500">Estimated Completion</span>
                <p className="font-semibold text-slate-900">{run.estimatedCompletion}</p>
              </div>
              <Link
                to={`/school-shuttles/routes/${run.id}/track`}
                className="px-3 py-1.5 rounded-lg bg-ev-green text-white text-xs font-medium hover:bg-ev-green-dark"
              >
                Track Live
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
