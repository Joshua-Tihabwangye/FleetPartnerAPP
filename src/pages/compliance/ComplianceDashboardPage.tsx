import React from "react";
import { Link } from "react-router-dom";
import { PieChart, ProgressRing, BarChart, Sparkline } from "../../components/ui/Charts";

export default function ComplianceDashboardPage() {
  const stats = [
    { label: "Active licenses", value: "94", status: "good", change: "+2", sparkline: [88, 89, 90, 91, 92, 93, 94] },
    { label: "Expiring soon", value: "3", status: "warning", change: "→", sparkline: [5, 4, 6, 3, 4, 3, 3] },
    { label: "Incidents this month", value: "2", status: "info", change: "-3", sparkline: [8, 6, 5, 4, 3, 2, 2] },
    { label: "Compliance score", value: "98%", status: "good", change: "+2%", sparkline: [92, 94, 95, 96, 97, 98, 98] }
  ];

  // Chart data
  const incidentsByType = [
    { label: "Accidents", value: 5, color: "#ef4444" },
    { label: "Violations", value: 8, color: "#f59e0b" },
    { label: "Complaints", value: 3, color: "#3b82f6" },
    { label: "Other", value: 2, color: "#8b5cf6" },
  ];

  const monthlyIncidents = [
    { label: "Jul", value: 8 },
    { label: "Aug", value: 6 },
    { label: "Sep", value: 5 },
    { label: "Oct", value: 4 },
    { label: "Nov", value: 3 },
    { label: "Dec", value: 2 },
  ];

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "good": return { bg: "from-emerald-500 to-teal-600", sparkColor: "rgba(255,255,255,0.6)" };
      case "warning": return { bg: "from-amber-500 to-orange-600", sparkColor: "rgba(255,255,255,0.6)" };
      case "info": return { bg: "from-blue-500 to-indigo-600", sparkColor: "rgba(255,255,255,0.6)" };
      default: return { bg: "from-slate-500 to-slate-600", sparkColor: "rgba(255,255,255,0.6)" };
    }
  };

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      {/* Header */}
      <div className="mb-6 pb-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 mb-1">
              Compliance Dashboard
            </h1>
            <p className="text-sm text-slate-600">Monitor fleet compliance and safety metrics</p>
          </div>
          <Link
            to="/compliance/incidents"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-ev-green to-emerald-600 text-white text-sm font-medium shadow-lg shadow-emerald-500/20"
          >
            📋 View Incidents
          </Link>
        </div>
        <div className="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-ev-green via-emerald-400 to-orange-400 opacity-80" />
      </div>

      {/* Stats Grid with Sparklines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, idx) => {
          const styles = getStatusStyles(stat.status);
          return (
            <div key={idx} className={`bg-gradient-to-br ${styles.bg} rounded-xl p-4 shadow-lg text-white`}>
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-white/80">{stat.label}</div>
                <div className="text-xs font-medium bg-white/20 px-1.5 py-0.5 rounded">{stat.change}</div>
              </div>
              <div className="text-2xl font-bold mb-2">{stat.value}</div>
              <Sparkline data={stat.sparkline} color={styles.sparkColor} height={32} />
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Incidents Trend */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Incident Trend</h3>
              <p className="text-xs text-slate-500">Monthly incidents over the past 6 months</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-medium">-75% ↓</span>
          </div>
          <BarChart data={monthlyIncidents} height={150} showValues={true} />
        </div>

        {/* Incidents by Type */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Incidents by Type</h3>
            <p className="text-xs text-slate-500">This year's breakdown</p>
          </div>
          <div className="flex justify-center">
            <PieChart data={incidentsByType} size={140} donut={true} showLabels={true} />
          </div>
        </div>
      </div>

      {/* Compliance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 shadow-lg text-white">
          <div className="mb-4">
            <h3 className="text-sm font-semibold">Document Compliance</h3>
            <p className="text-xs text-slate-400">Fleet documentation status</p>
          </div>
          <div className="flex flex-col items-center">
            <ProgressRing percent={92} size={90} color="#10b981" textColor="#ffffff" bgColor="#475569" />
            <div className="mt-3 text-center">
              <div className="text-xs text-slate-400">Valid Documents</div>
              <div className="text-lg font-bold">118 / 128</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 shadow-lg text-white">
          <div className="mb-4">
            <h3 className="text-sm font-semibold">Driver Training</h3>
            <p className="text-xs text-slate-400">Certification status</p>
          </div>
          <div className="flex flex-col items-center">
            <ProgressRing percent={78} size={90} color="#3b82f6" textColor="#ffffff" bgColor="#475569" />
            <div className="mt-3 text-center">
              <div className="text-xs text-slate-400">Certified Drivers</div>
              <div className="text-lg font-bold">73 / 94</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 shadow-lg text-white">
          <div className="mb-4">
            <h3 className="text-sm font-semibold">Vehicle Inspections</h3>
            <p className="text-xs text-slate-400">Up-to-date inspections</p>
          </div>
          <div className="flex flex-col items-center">
            <ProgressRing percent={95} size={90} color="#f59e0b" textColor="#ffffff" bgColor="#475569" />
            <div className="mt-3 text-center">
              <div className="text-xs text-slate-400">Inspected</div>
              <div className="text-lg font-bold">122 / 128</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 shadow-lg text-white">
          <div className="mb-4">
            <h3 className="text-sm font-semibold">Insurance Status</h3>
            <p className="text-xs text-slate-400">Active policies</p>
          </div>
          <div className="flex flex-col items-center">
            <ProgressRing percent={100} size={90} color="#22c55e" textColor="#ffffff" bgColor="#475569" />
            <div className="mt-3 text-center">
              <div className="text-xs text-slate-400">Insured Vehicles</div>
              <div className="text-lg font-bold">128 / 128</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/compliance/incidents"
          className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border border-red-200 p-6 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-slate-900 group-hover:text-red-600 transition">Incidents</h2>
            <span className="text-2xl group-hover:scale-110 transition-transform">⚠️</span>
          </div>
          <p className="text-sm text-slate-600">View and manage incident reports</p>
        </Link>
        <Link
          to="/ambulance/cases"
          className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200 p-6 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-slate-900 group-hover:text-purple-600 transition">Ambulance Cases</h2>
            <span className="text-2xl group-hover:scale-110 transition-transform">🚨</span>
          </div>
          <p className="text-sm text-slate-600">Track EMS cases and responses</p>
        </Link>
      </div>
    </div>
  );
}
