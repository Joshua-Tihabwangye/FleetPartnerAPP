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
    { label: "Violations", value: 8, color: "#f97316" }, // Orange
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

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      {/* Header */}
      <div className="mb-6 pb-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link to="/dashboard" className="text-slate-400 hover:text-slate-600 transition">
                ← Back to Dashboard
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
              Compliance Dashboard
            </h1>
            <p className="text-sm text-slate-600">Monitor fleet compliance and safety metrics</p>
          </div>
          <Link
            to="/compliance/incidents"
            className="px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-medium shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition"
          >
            📋 View Incidents
          </Link>
        </div>
        <div className="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-ev-green via-emerald-400 to-orange-400 opacity-80" />
      </div>

      {/* Stats Grid with Sparklines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, idx) => {
          // Use solid light colors with borders instead of gradients
          const styles = {
            bg: "bg-white",
            border: idx % 2 === 0 ? "border-emerald-200" : "border-orange-200",
            label: "text-slate-500",
            sparkColor: idx % 2 === 0 ? "#10b981" : "#f97316"
          };

          return (
            <div key={idx} className={`bg-white rounded-xl border ${styles.border} p-4 shadow-sm hover:shadow-md transition-all`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`text-xs ${styles.label} font-medium uppercase tracking-wider`}>{stat.label}</div>
                {/* Mock dropdown for period selection per card as requested */}
                <select className="text-[10px] border-none bg-slate-50 text-slate-500 rounded p-0.5 cursor-pointer focus:ring-0 outline-none">
                  <option>Today</option>
                  <option>Week</option>
                  <option>Month</option>
                </select>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <div className={`text-xs font-semibold px-1.5 py-0.5 rounded-md ${stat.status === 'good' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                  {stat.change}
                </div>
              </div>
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
            <div className="flex gap-2">
              <select className="text-xs border border-slate-200 rounded-lg px-2 py-1 text-slate-600 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                <option>Last 6 Months</option>
                <option>This Year</option>
              </select>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-medium self-center">-75% ↓</span>
            </div>
          </div>
          <BarChart data={monthlyIncidents} height={150} showValues={true} />
        </div>

        {/* Incidents by Type */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Incidents by Type</h3>
              <p className="text-xs text-slate-500">This year's breakdown</p>
            </div>
            <select className="text-xs border border-slate-200 rounded-lg px-2 py-1 text-slate-600 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
              <option>This Year</option>
              <option>All Time</option>
            </select>
          </div>
          <div className="flex justify-center">
            <PieChart data={incidentsByType} size={140} donut={true} showLabels={true} />
          </div>
        </div>
      </div>

      {/* Compliance Metrics - UPDATED TO COMPANY COLORS (Orange/Green) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white border border-emerald-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Document Compliance</h3>
              <p className="text-xs text-slate-400">Fleet documentation status</p>
            </div>
            <select className="text-[10px] border border-slate-100 rounded px-1 py-0.5 text-slate-400 bg-white outline-none">
              <option>Current</option>
            </select>
          </div>
          <div className="flex flex-col items-center">
            <ProgressRing percent={92} size={90} color="#10b981" textColor="#0f172a" bgColor="#e2e8f0" />
            <div className="mt-3 text-center">
              <div className="text-xs text-slate-500 uppercase tracking-widest font-medium">Valid Documents</div>
              <div className="text-lg font-bold text-slate-900">118 / 128</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-orange-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Driver Training</h3>
              <p className="text-xs text-slate-400">Certification status</p>
            </div>
            <select className="text-[10px] border border-slate-100 rounded px-1 py-0.5 text-slate-400 bg-white outline-none">
              <option>Current</option>
            </select>
          </div>
          <div className="flex flex-col items-center">
            <ProgressRing percent={78} size={90} color="#f97316" textColor="#0f172a" bgColor="#e2e8f0" />
            <div className="mt-3 text-center">
              <div className="text-xs text-slate-500 uppercase tracking-widest font-medium">Certified Drivers</div>
              <div className="text-lg font-bold text-slate-900">73 / 94</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-emerald-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Vehicle Inspections</h3>
              <p className="text-xs text-slate-400">Up-to-date inspections</p>
            </div>
            <select className="text-[10px] border border-slate-100 rounded px-1 py-0.5 text-slate-400 bg-white outline-none">
              <option>Current</option>
            </select>
          </div>
          <div className="flex flex-col items-center">
            <ProgressRing percent={95} size={90} color="#10b981" textColor="#0f172a" bgColor="#e2e8f0" />
            <div className="mt-3 text-center">
              <div className="text-xs text-slate-500 uppercase tracking-widest font-medium">Inspected</div>
              <div className="text-lg font-bold text-slate-900">122 / 128</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-orange-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Insurance Status</h3>
              <p className="text-xs text-slate-400">Active policies</p>
            </div>
            <select className="text-[10px] border border-slate-100 rounded px-1 py-0.5 text-slate-400 bg-white outline-none">
              <option>Current</option>
            </select>
          </div>
          <div className="flex flex-col items-center">
            <ProgressRing percent={100} size={90} color="#f97316" textColor="#0f172a" bgColor="#e2e8f0" />
            <div className="mt-3 text-center">
              <div className="text-xs text-slate-500 uppercase tracking-widest font-medium">Insured Vehicles</div>
              <div className="text-lg font-bold text-slate-900">128 / 128</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/compliance/incidents"
          className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-orange-300 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-slate-900 group-hover:text-orange-600 transition">Incidents</h2>
            <span className="text-2xl group-hover:scale-110 transition-transform">⚠️</span>
          </div>
          <p className="text-sm text-slate-600">View and manage incident reports</p>
        </Link>
        <Link
          to="/ambulance/cases"
          className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-slate-900 group-hover:text-emerald-600 transition">Ambulance Cases</h2>
            <span className="text-2xl group-hover:scale-110 transition-transform">🚨</span>
          </div>
          <p className="text-sm text-slate-600">Track EMS cases and responses</p>
        </Link>
      </div>
    </div>
  );
}
