import React from "react";
import { Link } from "react-router-dom";

export default function ComplianceDashboardPage() {
  const stats = [
    { label: "Active licenses", value: "94", status: "good" },
    { label: "Expiring soon", value: "3", status: "warning" },
    { label: "Incidents this month", value: "2", status: "info" },
    { label: "Compliance score", value: "98%", status: "good" }
  ];

  return (
    <div className="min-h-[calc(100vh-56px)] px-4 sm:px-6 lg:px-10 py-6 bg-slate-50">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">Compliance dashboard</h1>
        <p className="text-sm text-slate-600">Monitor fleet compliance and safety metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="text-xs text-slate-500 mb-1">{stat.label}</div>
            <div className="text-2xl font-semibold text-slate-900">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/compliance/incidents"
          className="bg-white rounded-xl border border-slate-200 p-6 hover:border-ev-green hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-slate-900">Incidents</h2>
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-sm text-slate-600">View and manage incident reports</p>
        </Link>
        <Link
          to="/ambulance/cases"
          className="bg-white rounded-xl border border-slate-200 p-6 hover:border-ev-green hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-slate-900">Ambulance cases</h2>
            <span className="text-2xl">🚨</span>
          </div>
          <p className="text-sm text-slate-600">Track EMS cases and responses</p>
        </Link>
      </div>
    </div>
  );
}
