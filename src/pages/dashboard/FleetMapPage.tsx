import React, { useState } from "react";

export default function FleetMapPage() {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filters = [
    { id: "all", label: "All vehicles", count: 128 },
    { id: "active", label: "Active trips", count: 45 },
    { id: "idle", label: "Idle", count: 83 }
  ];

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-10 py-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white mb-1">Live fleet map</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Real-time vehicle locations and status</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600">
              🔄 Refresh
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark shadow-sm">
              ⚙️ Settings
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedFilter === filter.id
                  ? "bg-ev-green text-white shadow-md shadow-emerald-500/20"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative bg-slate-200 dark:bg-slate-950">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="text-6xl">🗺️</div>
            <div>
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-1">Map view</h3>
              <p className="text-sm text-slate-500 dark:text-slate-500">
                Integrate your map provider (Google Maps, Mapbox, etc.)
              </p>
            </div>
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200">
            +
          </button>
          <button className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200">
            −
          </button>
          <button className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200">
            🧭
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="absolute right-0 top-0 bottom-0 w-80 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 shadow-lg p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Vehicle list</h2>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-ev-green dark:hover:border-ev-green hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-slate-900 dark:text-slate-200">Vehicle {i}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                  Active
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Driver: John Doe</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Location: Kampala</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
