import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BarChart, PieChart, Sparkline, LineChart, ProgressRing } from "../../components/ui/Charts";

export default function AmbulanceDashboardPage() {
  const [dateRange, setDateRange] = useState<"today" | "week" | "month">("today");

  // Key Metrics
  const keyMetrics = [
    { 
      label: "Active Cases", 
      value: "6", 
      change: "+2", 
      color: "red", 
      sparkline: [3, 4, 4, 5, 5, 6, 6],
      icon: "🚑"
    },
    { 
      label: "Total Cases", 
      value: "142", 
      change: "+18", 
      color: "blue", 
      sparkline: [120, 125, 130, 135, 138, 140, 142],
      icon: "📋"
    },
    { 
      label: "Avg Response Time", 
      value: "8.5 min", 
      change: "-1.2 min", 
      color: "emerald", 
      sparkline: [10.2, 9.8, 9.5, 9.2, 8.9, 8.7, 8.5],
      icon: "⏱️"
    },
    { 
      label: "Success Rate", 
      value: "94%", 
      change: "+2%", 
      color: "purple", 
      sparkline: [90, 91, 92, 92, 93, 93, 94],
      icon: "✅"
    }
  ];

  // Revenue data (if applicable)
  const revenueData: Record<"today" | "week" | "month", { value: string; change: string }> = {
    today: { value: "UGX 1.2M", change: "+8%" },
    week: { value: "UGX 8.5M", change: "+12%" },
    month: { value: "UGX 32.4M", change: "+15%" }
  };

  // Case priority breakdown
  const casePriority = [
    { label: "High", value: 28, color: "#ef4444" },
    { label: "Medium", value: 65, color: "#f59e0b" },
    { label: "Low", value: 49, color: "#10b981" }
  ];

  // Case status breakdown
  const caseStatus = [
    { label: "Completed", value: 118, color: "#10b981" },
    { label: "In Progress", value: 6, color: "#3b82f6" },
    { label: "Pending", value: 12, color: "#f59e0b" },
    { label: "Cancelled", value: 6, color: "#ef4444" }
  ];

  // Weekly cases trend
  const weeklyCases = [
    { label: "Mon", value: 18 },
    { label: "Tue", value: 22 },
    { label: "Wed", value: 20 },
    { label: "Thu", value: 25 },
    { label: "Fri", value: 28 },
    { label: "Sat", value: 15 },
    { label: "Sun", value: 12 }
  ];

  // Response time trend
  const responseTimeData = [10.5, 10.2, 9.8, 9.5, 9.2, 8.9, 8.7, 8.5, 8.3, 8.2, 8.4, 8.5];
  const responseTimeLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Active cases
  const activeCases = [
    { id: "AMB-001", priority: "high", location: "Kampala Central", status: "in-progress", time: "2 min ago" },
    { id: "AMB-002", priority: "medium", location: "Entebbe", status: "assigned", time: "5 min ago" },
    { id: "AMB-003", priority: "low", location: "Jinja", status: "in-progress", time: "10 min ago" }
  ];

  // Performance metrics
  const performanceMetrics = [
    { label: "Response Time", value: 92, color: "#10b981", bg: "from-emerald-500 to-teal-600" },
    { label: "Case Resolution", value: 88, color: "#3b82f6", bg: "from-blue-500 to-cyan-600" },
    { label: "Patient Satisfaction", value: 91, color: "#f59e0b", bg: "from-orange-500 to-amber-600" },
    { label: "Equipment Readiness", value: 96, color: "#8b5cf6", bg: "from-purple-500 to-indigo-600" }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-700 border-red-200";
      case "medium": return "bg-orange-100 text-orange-700 border-orange-200";
      case "low": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default: return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      {/* Header */}
      <div className="mb-6 pb-6 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-pink-600 to-rose-600 mb-1">
              Ambulance & EMS Dashboard
            </h1>
            <p className="text-sm text-slate-600">
              Monitor emergency medical services and response operations
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to="/ambulance/dispatch"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-ev-green transition"
            >
              🚑 Dispatch Board
            </Link>
            <Link
              to="/ambulance/cases"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-ev-green to-emerald-600 text-white text-sm font-medium shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition"
            >
              📋 View Cases
            </Link>
          </div>
        </div>
        <div className="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 opacity-80" />
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {keyMetrics.map((metric, idx) => {
          const colors: Record<string, string> = {
            red: "#ef4444",
            blue: "#3b82f6",
            emerald: "#10b981",
            purple: "#8b5cf6"
          };
          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{metric.icon}</span>
                  <div className="text-xs text-slate-500">{metric.label}</div>
                </div>
                <div
                  className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                    metric.color === "red"
                      ? "bg-red-100 text-red-600"
                      : metric.color === "blue"
                      ? "bg-blue-100 text-blue-600"
                      : metric.color === "emerald"
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-purple-100 text-purple-600"
                  }`}
                >
                  {metric.change}
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-2">{metric.value}</div>
              <Sparkline data={metric.sparkline} color={colors[metric.color]} height={32} />
            </div>
          );
        })}
      </div>

      {/* Revenue Card */}
      <div className="mb-6">
        <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-red-100 mb-1">Total Revenue</div>
              <div className="text-3xl font-bold">{revenueData[dateRange].value}</div>
            </div>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as "today" | "week" | "month")}
              className="text-xs bg-white/20 border border-white/30 rounded-lg px-3 py-1.5 text-white cursor-pointer hover:bg-white/30"
            >
              <option value="today" className="text-slate-800">Today</option>
              <option value="week" className="text-slate-800">This Week</option>
              <option value="month" className="text-slate-800">This Month</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-red-100">↑ {revenueData[dateRange].change}</span>
            <span className="text-xs text-red-200">vs last period</span>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {performanceMetrics.map((stat, idx) => (
          <div
            key={idx}
            className={`bg-gradient-to-br ${stat.bg} rounded-xl p-4 shadow-lg text-white`}
          >
            <div className="text-xs text-white/80 mb-2">{stat.label}</div>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stat.value}%</div>
              <ProgressRing
                percent={stat.value}
                size={50}
                strokeWidth={6}
                color="rgba(255,255,255,0.9)"
                bgColor="rgba(255,255,255,0.2)"
                textColor="transparent"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Response Time Trend */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Average Response Time (Minutes)</h3>
          <LineChart
            data={responseTimeData}
            labels={responseTimeLabels}
            height={150}
            color="#ef4444"
            showArea={true}
          />
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-600">Average: 9.1 min</span>
            <span className="text-emerald-600 font-medium">↓ -1.2 min this month</span>
          </div>
        </div>

        {/* Weekly Cases */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Weekly Cases</h3>
          <BarChart data={weeklyCases} height={150} showValues={true} />
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-600">Total: 140 cases</span>
            <span className="text-emerald-600 font-medium">↑ +8% vs last week</span>
          </div>
        </div>
      </div>

      {/* Status Breakdowns & Active Cases */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Case Priority */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Case Priority</h3>
          <PieChart data={casePriority} size={180} donut={true} showLabels={true} />
        </div>

        {/* Case Status */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Case Status</h3>
          <PieChart data={caseStatus} size={180} donut={true} showLabels={true} />
        </div>

        {/* Active Cases */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Active Cases</h3>
            <Link
              to="/ambulance/dispatch"
              className="text-sm text-ev-green hover:text-ev-green-dark font-medium"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {activeCases.map((caseItem) => (
              <Link
                key={caseItem.id}
                to={`/ambulance/cases/${caseItem.id}`}
                className={`block p-3 rounded-lg border ${getPriorityColor(caseItem.priority)}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-slate-900">{caseItem.id}</p>
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-white/80">
                    {caseItem.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{caseItem.location}</p>
                <p className="text-xs text-slate-500 mt-1">{caseItem.time}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/ambulance/dispatch"
            className="p-4 rounded-lg border border-slate-200 hover:border-red-500 hover:bg-red-50 transition-colors text-center"
          >
            <div className="text-2xl mb-2">🚑</div>
            <div className="text-sm font-medium text-slate-900">Dispatch Board</div>
          </Link>
          <Link
            to="/ambulance/cases"
            className="p-4 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
          >
            <div className="text-2xl mb-2">📋</div>
            <div className="text-sm font-medium text-slate-900">View Cases</div>
          </Link>
          <Link
            to="/compliance"
            className="p-4 rounded-lg border border-slate-200 hover:border-purple-500 hover:bg-purple-50 transition-colors text-center"
          >
            <div className="text-2xl mb-2">📊</div>
            <div className="text-sm font-medium text-slate-900">Compliance</div>
          </Link>
          <Link
            to="/vehicles"
            className="p-4 rounded-lg border border-slate-200 hover:border-orange-500 hover:bg-orange-50 transition-colors text-center"
          >
            <div className="text-2xl mb-2">🚙</div>
            <div className="text-sm font-medium text-slate-900">Ambulances</div>
          </Link>
        </div>
      </div>
    </div>
  );
}

