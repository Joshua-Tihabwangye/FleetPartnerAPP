import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BarChart, PieChart, Sparkline, LineChart, ProgressRing } from "../../components/ui/Charts";

export default function AmbulanceDashboardPage() {
  const [dateRange, setDateRange] = useState<"today" | "week" | "month">("today");
  const [responseTimePeriod, setResponseTimePeriod] = useState("year");
  const [weeklyCasesPeriod, setWeeklyCasesPeriod] = useState("week");
  const [casePriorityPeriod, setCasePriorityPeriod] = useState("all");
  const [caseStatusPeriod, setCaseStatusPeriod] = useState("all");

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
      color: "orange",
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
      color: "emerald",
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
    { label: "Medium", value: 65, color: "#f97316" },
    { label: "Low", value: 49, color: "#10b981" }
  ];

  // Case status breakdown
  const caseStatus = [
    { label: "Completed", value: 118, color: "#10b981" },
    { label: "In Progress", value: 6, color: "#f97316" },
    { label: "Pending", value: 12, color: "#fb923c" },
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

  // Performance metrics - Light Solid Colors (no Average dropdown)
  const performanceMetrics = [
    { label: "Response Time", value: 92, color: "#10b981", borderColor: "border-emerald-200", bgColor: "bg-emerald-50", textColor: "text-emerald-700" },
    { label: "Case Resolution", value: 88, color: "#3b82f6", borderColor: "border-blue-200", bgColor: "bg-blue-50", textColor: "text-blue-700" },
    { label: "Patient Satisfaction", value: 91, color: "#f97316", borderColor: "border-orange-200", bgColor: "bg-orange-50", textColor: "text-orange-700" },
    { label: "Equipment Readiness", value: 96, color: "#8b5cf6", borderColor: "border-purple-200", bgColor: "bg-purple-50", textColor: "text-purple-700" }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-50 text-red-700 border-red-200";
      case "medium": return "bg-orange-50 text-orange-700 border-orange-200";
      case "low": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default: return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      {/* Header */}
      <div className="mb-6 pb-6 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link to="/dashboard" className="text-slate-400 hover:text-slate-600 transition text-sm">
                ← Back to Dashboard
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-medium shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition"
            >
              📋 View Cases
            </Link>
          </div>
        </div>
        <div className="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-red-500 via-orange-500 to-emerald-500 opacity-80" />
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {keyMetrics.map((metric, idx) => {
          let borderColor = "border-slate-200";
          let sparkColor = "#64748b";
          let changeBg = "bg-slate-100 text-slate-600";

          if (metric.color === 'red') {
            borderColor = "border-red-200";
            sparkColor = "#ef4444";
            changeBg = "bg-red-100 text-red-600";
          } else if (metric.color === 'orange') {
            borderColor = "border-orange-200";
            sparkColor = "#f97316";
            changeBg = "bg-orange-100 text-orange-600";
          } else if (metric.color === 'emerald') {
            borderColor = "border-emerald-200";
            sparkColor = "#10b981";
            changeBg = "bg-emerald-100 text-emerald-600";
          }

          return (
            <div
              key={idx}
              className={`bg-white rounded-xl border ${borderColor} p-4 shadow-sm hover:shadow-md transition-all`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{metric.icon}</span>
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{metric.label}</div>
                </div>
                <select className="text-xs border border-slate-200 bg-slate-50 text-slate-600 rounded-lg px-2 py-1 cursor-pointer focus:ring-ev-green focus:border-ev-green outline-none">
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                  <option value="all">All Time</option>
                </select>
              </div>
              <div className="flex items-end justify-between mb-2">
                <div className="text-2xl font-bold text-slate-900">{metric.value}</div>
                <div className={`text-xs font-medium px-1.5 py-0.5 rounded ${changeBg}`}>
                  {metric.change}
                </div>
              </div>
              <Sparkline data={metric.sparkline} color={sparkColor} height={32} />
            </div>
          );
        })}
      </div>

      {/* Performance Metrics - NO Average dropdown, just title */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {performanceMetrics.map((stat, idx) => (
          <div
            key={idx}
            className={`${stat.bgColor} rounded-xl border ${stat.borderColor} p-4 shadow-sm hover:shadow-md transition-all`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`text-xs ${stat.textColor} font-medium uppercase tracking-wider`}>{stat.label}</div>
              <select className="text-[10px] border border-slate-200 bg-white text-slate-500 rounded px-1 py-0.5 cursor-pointer outline-none">
                <option value="current">Current</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}%</div>
              <ProgressRing
                percent={stat.value}
                size={50}
                strokeWidth={4}
                color={stat.color}
                bgColor="#e2e8f0"
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Average Response Time (Minutes)</h3>
            <select
              value={responseTimePeriod}
              onChange={(e) => setResponseTimePeriod(e.target.value)}
              className="text-xs border border-slate-200 bg-slate-50 text-slate-600 rounded-lg px-2 py-1 cursor-pointer focus:ring-ev-green focus:border-ev-green outline-none"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Weekly Cases</h3>
            <select
              value={weeklyCasesPeriod}
              onChange={(e) => setWeeklyCasesPeriod(e.target.value)}
              className="text-xs border border-slate-200 bg-slate-50 text-slate-600 rounded-lg px-2 py-1 cursor-pointer focus:ring-ev-green focus:border-ev-green outline-none"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Case Priority</h3>
            <select
              value={casePriorityPeriod}
              onChange={(e) => setCasePriorityPeriod(e.target.value)}
              className="text-xs border border-slate-200 bg-slate-50 text-slate-600 rounded-lg px-2 py-1 cursor-pointer focus:ring-ev-green focus:border-ev-green outline-none"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
          <PieChart data={casePriority} size={180} donut={true} showLabels={true} />
        </div>

        {/* Case Status */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Case Status</h3>
            <select
              value={caseStatusPeriod}
              onChange={(e) => setCaseStatusPeriod(e.target.value)}
              className="text-xs border border-slate-200 bg-slate-50 text-slate-600 rounded-lg px-2 py-1 cursor-pointer focus:ring-ev-green focus:border-ev-green outline-none"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
          <PieChart data={caseStatus} size={180} donut={true} showLabels={true} />
        </div>

        {/* Active Cases */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Active Cases</h3>
            <Link
              to="/ambulance/dispatch"
              className="text-sm text-ev-green hover:text-emerald-700 font-medium"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {activeCases.map((caseItem) => (
              <Link
                key={caseItem.id}
                to={`/ambulance/cases/${caseItem.id}`}
                className={`block p-3 rounded-lg border ${getPriorityColor(caseItem.priority)} transition hover:shadow-sm`}
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
