import React from "react";
import { Link } from "react-router-dom";

export default function DashboardOverviewPage() {
  const stats = [
    { label: "Vehicles online", value: "128", change: "+12", color: "emerald" },
    { label: "Active drivers", value: "94", change: "+5", color: "blue" },
    { label: "Trips today", value: "1,420", change: "+8%", color: "purple" },
    { label: "Net revenue", value: "UGX 12.4M", change: "+15%", color: "green" }
  ];

  return (
    <div className="min-h-[calc(100vh-56px)] px-4 sm:px-6 lg:px-10 py-6 bg-slate-50">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">Dashboard overview</h1>
        <p className="text-sm text-slate-600">
          Real-time fleet operations and performance metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="text-xs text-slate-500 mb-1">{stat.label}</div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-semibold text-slate-900">{stat.value}</div>
              <div className={`text-xs font-medium text-${stat.color}-600`}>
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-cream rounded-xl border border-slate-200 p-6 shadow-card hover:shadow-card-hover card-hover-lift">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/vehicles/new"
              className="flex flex-col items-center justify-center p-4 rounded-lg border border-slate-200 bg-white shadow-sm hover:border-ev-green hover:bg-emerald-50 hover:shadow-md transition-all"
            >
              <span className="text-2xl mb-2">🚙</span>
              <span className="text-xs font-medium text-slate-700">Add vehicle</span>
            </Link>
            <Link
              to="/drivers/new"
              className="flex flex-col items-center justify-center p-4 rounded-lg border border-slate-200 bg-white shadow-sm hover:border-ev-green hover:bg-emerald-50 hover:shadow-md transition-all"
            >
              <span className="text-2xl mb-2">👤</span>
              <span className="text-xs font-medium text-slate-700">Add driver</span>
            </Link>
            <Link
              to="/dispatch/new"
              className="flex flex-col items-center justify-center p-4 rounded-lg border border-slate-200 bg-white shadow-sm hover:border-ev-green hover:bg-emerald-50 hover:shadow-md transition-all"
            >
              <span className="text-2xl mb-2">📲</span>
              <span className="text-xs font-medium text-slate-700">New dispatch</span>
            </Link>
            <Link
              to="/live-map"
              className="flex flex-col items-center justify-center p-4 rounded-lg border border-slate-200 bg-white shadow-sm hover:border-ev-green hover:bg-emerald-50 hover:shadow-md transition-all"
            >
              <span className="text-2xl mb-2">🗺️</span>
              <span className="text-xs font-medium text-slate-700">Live map</span>
            </Link>
          </div>
        </div>

        <div className="bg-cream rounded-xl border border-slate-200 p-6 shadow-card hover:shadow-card-hover card-hover-lift">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent activity</h2>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0">
                <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-xs">
                  🚗
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-900">Trip completed</div>
                  <div className="text-xs text-slate-500">2 minutes ago</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
