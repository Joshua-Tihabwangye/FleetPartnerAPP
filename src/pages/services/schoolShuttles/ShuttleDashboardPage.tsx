import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart, PieChart, Sparkline, LineChart, ProgressRing } from "../../../components/ui/Charts";

export default function ShuttleDashboardPage() {
  const location = useLocation();
  const [activeRuns, setActiveRuns] = useState(0);

  // Period selectors for each metric card
  const [activeRoutesPeriod, setActiveRoutesPeriod] = useState("today");
  const [studentsPeriod, setStudentsPeriod] = useState("today");
  const [vehiclesPeriod, setVehiclesPeriod] = useState("today");
  const [attendancePeriod, setAttendancePeriod] = useState("today");

  useEffect(() => {
    // Simulate active runs count
    setActiveRuns(3);
  }, []);

  // Key Metrics with individual period state
  const keyMetrics = [
    {
      label: "Active Routes",
      value: "6",
      change: "+1",
      color: "emerald",
      sparkline: [4, 5, 5, 6, 6, 6, 6],
      icon: "🚌",
      period: activeRoutesPeriod,
      setPeriod: setActiveRoutesPeriod
    },
    {
      label: "Total Students",
      value: "142",
      change: "+8",
      color: "blue",
      sparkline: [120, 125, 130, 135, 138, 140, 142],
      icon: "👥",
      period: studentsPeriod,
      setPeriod: setStudentsPeriod
    },
    {
      label: "Active Vehicles",
      value: "6",
      change: "100%",
      color: "emerald",
      sparkline: [5, 5, 6, 6, 6, 6, 6],
      icon: "🚗",
      period: vehiclesPeriod,
      setPeriod: setVehiclesPeriod
    },
    {
      label: "Avg Attendance",
      value: "94%",
      change: "+2%",
      color: "orange",
      sparkline: [88, 90, 91, 92, 93, 94, 94],
      icon: "✅",
      period: attendancePeriod,
      setPeriod: setAttendancePeriod
    }
  ];

  // Performance Stats - NOW LIGHT SOLID COLORS
  const performanceStats = [
    { label: "On-Time Performance", value: 87, color: "#10b981", bgClass: "bg-emerald-50", borderClass: "border-emerald-200", textClass: "text-emerald-700" },
    { label: "Route Efficiency", value: 92, color: "#64748b", bgClass: "bg-slate-100", borderClass: "border-slate-300", textClass: "text-slate-700" },
    { label: "Parent Satisfaction", value: 89, color: "#f97316", bgClass: "bg-orange-50", borderClass: "border-orange-200", textClass: "text-orange-700" },
    { label: "Safety Score", value: 96, color: "#10b981", bgClass: "bg-emerald-50", borderClass: "border-emerald-200", textClass: "text-emerald-700" }
  ];

  // Attendance trend data
  const attendanceTrendData = [88, 90, 89, 92, 91, 93, 94, 92, 94, 95, 94, 96];
  const attendanceTrendLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Route performance data
  const routePerformance = [
    { label: "Route A", value: 28, color: "#10b981" },
    { label: "Route B", value: 22, color: "#3b82f6" },
    { label: "Route C", value: 18, color: "#f59e0b" },
    { label: "Route D", value: 15, color: "#8b5cf6" },
    { label: "Route E", value: 12, color: "#ec4899" },
    { label: "Route F", value: 10, color: "#06b6d4" }
  ];

  // Status breakdown
  const statusBreakdown = [
    { label: "Active", value: 142, color: "#10b981" },
    { label: "Pending", value: 8, color: "#f59e0b" },
    { label: "Inactive", value: 3, color: "#ef4444" }
  ];

  // Weekly trips data
  const weeklyTrips = [
    { label: "Mon", value: 142 },
    { label: "Tue", value: 138 },
    { label: "Wed", value: 145 },
    { label: "Thu", value: 140 },
    { label: "Fri", value: 148 },
    { label: "Sat", value: 0 },
    { label: "Sun", value: 0 }
  ];

  // Active runs
  const activeRunsData = [
    {
      id: 1,
      route: "Morning Route A",
      driver: "David Mukasa",
      students: 24,
      progress: 65,
      status: "in-progress",
      eta: "08:45 AM"
    },
    {
      id: 2,
      route: "Morning Route B",
      driver: "Grace Nambi",
      students: 18,
      progress: 40,
      status: "in-progress",
      eta: "09:00 AM"
    },
    {
      id: 3,
      route: "Afternoon Route A",
      driver: "John Okello",
      students: 15,
      progress: 0,
      status: "scheduled",
      eta: "04:30 PM"
    }
  ];

  // Recent activity
  const recentActivity = [
    { icon: "✅", title: "Route completed", subtitle: "Morning Route A • 24 students • On time", time: "5 min ago", type: "success" },
    { icon: "⚠️", title: "Late pickup", subtitle: "Route B • Stop 3 • 5 min delay", time: "15 min ago", type: "warning" },
    { icon: "📋", title: "New student added", subtitle: "Emily Nakato • Route A", time: "1 hour ago", type: "info" },
    { icon: "🎉", title: "Perfect attendance", subtitle: "Route C • 100% this week", time: "2 hours ago", type: "success" }
  ];

  // Alerts
  const alerts = [
    { type: "warning", message: "2 routes running behind schedule", count: 2 },
    { type: "info", message: "3 new student applications pending", count: 3 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-progress": return "bg-blue-100 text-blue-700 border-blue-200";
      case "scheduled": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "completed": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default: return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "success": return "bg-emerald-50 border-emerald-200";
      case "warning": return "bg-yellow-50 border-yellow-200";
      case "info": return "bg-blue-50 border-blue-200";
      default: return "bg-slate-50 border-slate-200";
    }
  };

  // Check if a quick action link is the current page
  const isCurrentPage = (path: string) => location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link to="/dashboard" className="text-slate-400 hover:text-slate-600 transition text-sm">
                ← Back to Dashboard
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
              School Shuttles Dashboard
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Monitor and manage school shuttle operations in real-time
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to="/school-shuttles/operations"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-ev-green transition"
            >
              🚌 Operations Board
            </Link>
            <Link
              to="/school-shuttles/routes/create"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-ev-green text-white text-sm font-medium shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition"
            >
              + New Route
            </Link>
          </div>
        </div>
        <div className="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-emerald-500 via-slate-400 to-orange-500 opacity-80" />
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map((alert, idx) => (
            <Link
              key={idx}
              to={alert.type === "warning" ? "/school-shuttles/operations" : "/school-shuttles/students"}
              className={`p-4 rounded-xl border cursor-pointer hover:shadow-md transition-shadow ${alert.type === "warning"
                ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700"
                : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700"
                }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {alert.type === "warning" ? "⚠️" : "ℹ️"}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{alert.message}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    {alert.count} item{alert.count !== 1 ? "s" : ""} require attention
                  </p>
                </div>
                <span className="text-sm text-slate-500 dark:text-slate-400">→</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Key Metrics Grid - with visible period dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {keyMetrics.map((metric, idx) => {
          const colors: Record<string, string> = {
            emerald: "#10b981",
            blue: "#3b82f6",
            purple: "#8b5cf6",
            orange: "#f59e0b"
          };
          const borderColors: Record<string, string> = {
            emerald: "border-emerald-200",
            blue: "border-blue-200",
            purple: "border-purple-200",
            orange: "border-orange-200"
          };
          return (
            <div
              key={idx}
              className={`bg-white dark:bg-slate-800 rounded-xl border ${borderColors[metric.color]} p-4 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{metric.icon}</span>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{metric.label}</div>
                </div>
                {/* Visible Period Dropdown */}
                <select
                  value={metric.period}
                  onChange={(e) => metric.setPeriod(e.target.value)}
                  className="text-xs border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg px-2 py-1 cursor-pointer focus:ring-ev-green focus:border-ev-green outline-none"
                >
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>
              <div className="flex items-end justify-between mb-2">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{metric.value}</div>
                <div
                  className={`text-xs font-medium px-2 py-1 rounded-full ${metric.color === "emerald"
                    ? "bg-emerald-100 text-emerald-600"
                    : metric.color === "blue"
                      ? "bg-blue-100 text-blue-600"
                      : metric.color === "purple"
                        ? "bg-purple-100 text-purple-600"
                        : "bg-orange-100 text-orange-600"
                    }`}
                >
                  {metric.change}
                </div>
              </div>
              <Sparkline data={metric.sparkline} color={colors[metric.color]} height={32} />
            </div>
          );
        })}
      </div>

      {/* Performance Metrics - LIGHT SOLID COLORS (no gradients) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {performanceStats.map((stat, idx) => (
          <div
            key={idx}
            className={`${stat.bgClass} rounded-xl border ${stat.borderClass} p-4 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`text-xs ${stat.textClass} font-medium uppercase tracking-wider`}>{stat.label}</div>
              <select className="text-[10px] border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded px-1 py-0.5 cursor-pointer outline-none">
                <option>Current</option>
                <option>This Week</option>
                <option>This Month</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div className={`text-2xl font-bold ${stat.textClass}`}>{stat.value}%</div>
              <ProgressRing
                percent={stat.value}
                size={50}
                strokeWidth={6}
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
        {/* Attendance Trend */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Attendance Trend</h3>
            <select className="text-xs border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg px-2 py-1 cursor-pointer focus:ring-ev-green focus:border-ev-green outline-none">
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>
          <LineChart
            data={attendanceTrendData}
            labels={attendanceTrendLabels}
            height={150}
            color="#10b981"
            showArea={true}
          />
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Average: 92%</span>
            <span className="text-emerald-600 font-medium">↑ +4% this month</span>
          </div>
        </div>

        {/* Route Performance */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Students per Route</h3>
            <select className="text-xs border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg px-2 py-1 cursor-pointer focus:ring-ev-green focus:border-ev-green outline-none">
              <option>Current</option>
            </select>
          </div>
          <BarChart data={routePerformance} height={150} showValues={true} />
        </div>
      </div>

      {/* Active Runs & Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Active Runs */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Active Shuttle Runs</h3>
            <Link
              to="/school-shuttles/operations"
              className="text-sm text-ev-green hover:text-emerald-700 font-medium"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {activeRunsData.map((run) => (
              <div
                key={run.id}
                className={`p-4 rounded-lg border ${getStatusColor(run.status)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{run.route}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{run.driver} • {run.students} students</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-white/80 dark:bg-slate-800/80">
                    {run.status.replace("-", " ")}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-600 dark:text-slate-400">Progress</span>
                    <span className="text-xs font-medium text-slate-900 dark:text-slate-100">{run.progress}%</span>
                  </div>
                  <div className="w-full bg-white/50 dark:bg-slate-700/50 rounded-full h-2">
                    <div
                      className="bg-current rounded-full h-2 transition-all"
                      style={{ width: `${run.progress}%` }}
                    />
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-600 dark:text-slate-400">ETA: {run.eta}</span>
                  <Link
                    to={`/school-shuttles/routes/${run.id}/track`}
                    className="text-xs text-ev-green hover:text-emerald-700 font-medium"
                  >
                    Track Live →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Student Status</h3>
            <select className="text-xs border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg px-2 py-1 cursor-pointer focus:ring-ev-green focus:border-ev-green outline-none">
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
          <PieChart data={statusBreakdown} size={180} donut={true} showLabels={true} />
        </div>
      </div>

      {/* Weekly Trips & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Weekly Trips */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Weekly Trips</h3>
            <select className="text-xs border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg px-2 py-1 cursor-pointer focus:ring-ev-green focus:border-ev-green outline-none">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          <BarChart data={weeklyTrips} height={150} showValues={true} />
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Total: 713 trips</span>
            <span className="text-emerald-600 font-medium">↑ +5% vs last week</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border ${getActivityColor(activity.type)}`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">{activity.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{activity.title}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{activity.subtitle}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions - with green ring for current page */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Link
            to="/school-shuttles/calendar"
            className={`p-4 rounded-lg border transition-colors text-center ${isCurrentPage("/school-shuttles/calendar")
              ? "border-ev-green ring-2 ring-ev-green bg-emerald-50 dark:bg-emerald-900/20"
              : "border-slate-200 dark:border-slate-600 hover:border-ev-green hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
              }`}
          >
            <div className="text-2xl mb-2">📅</div>
            <div className="text-sm font-medium text-slate-900 dark:text-white">Trip Calendar</div>
          </Link>
          <Link
            to="/school-shuttles/routes"
            className={`p-4 rounded-lg border transition-colors text-center ${isCurrentPage("/school-shuttles/routes")
              ? "border-ev-green ring-2 ring-ev-green bg-emerald-50 dark:bg-emerald-900/20"
              : "border-slate-200 dark:border-slate-600 hover:border-ev-green hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
              }`}
          >
            <div className="text-2xl mb-2">🚌</div>
            <div className="text-sm font-medium text-slate-900 dark:text-white">Routes</div>
          </Link>
          <Link
            to="/school-shuttles/students"
            className={`p-4 rounded-lg border transition-colors text-center ${isCurrentPage("/school-shuttles/students")
              ? "border-ev-green ring-2 ring-ev-green bg-blue-50 dark:bg-blue-900/20"
              : "border-slate-200 dark:border-slate-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              }`}
          >
            <div className="text-2xl mb-2">👥</div>
            <div className="text-sm font-medium text-slate-900 dark:text-white">Students</div>
          </Link>
          <Link
            to="/school-shuttles/operations"
            className={`p-4 rounded-lg border transition-colors text-center ${isCurrentPage("/school-shuttles/operations")
              ? "border-ev-green ring-2 ring-ev-green bg-purple-50 dark:bg-purple-900/20"
              : "border-slate-200 dark:border-slate-600 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              }`}
          >
            <div className="text-2xl mb-2">📊</div>
            <div className="text-sm font-medium text-slate-900 dark:text-white">Ops Board</div>
          </Link>
          <Link
            to="/school-shuttles/attendants"
            className={`p-4 rounded-lg border transition-colors text-center ${isCurrentPage("/school-shuttles/attendants")
              ? "border-ev-green ring-2 ring-ev-green bg-orange-50 dark:bg-orange-900/20"
              : "border-slate-200 dark:border-slate-600 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20"
              }`}
          >
            <div className="text-2xl mb-2">👮</div>
            <div className="text-sm font-medium text-slate-900 dark:text-white">Attendants</div>
          </Link>
          <Link
            to="/school-shuttles/rosters"
            className={`p-4 rounded-lg border transition-colors text-center ${isCurrentPage("/school-shuttles/rosters")
              ? "border-ev-green ring-2 ring-ev-green bg-slate-50 dark:bg-slate-800"
              : "border-slate-200 dark:border-slate-600 hover:border-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
          >
            <div className="text-2xl mb-2">📋</div>
            <div className="text-sm font-medium text-slate-900 dark:text-white">Rosters</div>
          </Link>
          <Link
            to="/school-shuttles/safety"
            className={`p-4 rounded-lg border transition-colors text-center ${isCurrentPage("/school-shuttles/safety")
              ? "border-ev-green ring-2 ring-ev-green bg-red-50 dark:bg-red-900/20"
              : "border-slate-200 dark:border-slate-600 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              }`}
          >
            <div className="text-2xl mb-2">🛡️</div>
            <div className="text-sm font-medium text-slate-900 dark:text-white">Safety</div>
          </Link>
          <Link
            to="/school-shuttles/performance"
            className={`p-4 rounded-lg border transition-colors text-center ${isCurrentPage("/school-shuttles/performance")
              ? "border-ev-green ring-2 ring-ev-green bg-emerald-50 dark:bg-emerald-900/20"
              : "border-slate-200 dark:border-slate-600 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
              }`}
          >
            <div className="text-2xl mb-2">📈</div>
            <div className="text-sm font-medium text-slate-900 dark:text-white">Performance</div>
          </Link>
          <Link
            to="/school-shuttles/payments"
            className={`p-4 rounded-lg border transition-colors text-center ${isCurrentPage("/school-shuttles/payments")
              ? "border-ev-green ring-2 ring-ev-green bg-emerald-50 dark:bg-emerald-900/20"
              : "border-slate-200 dark:border-slate-600 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
              }`}
          >
            <div className="text-2xl mb-2">💰</div>
            <div className="text-sm font-medium text-slate-900 dark:text-white">Payments</div>
          </Link>
          <Link
            to="/school-shuttles/bulk-reminders"
            className={`p-4 rounded-lg border transition-colors text-center ${isCurrentPage("/school-shuttles/bulk-reminders")
              ? "border-ev-green ring-2 ring-ev-green bg-orange-50 dark:bg-orange-900/20"
              : "border-slate-200 dark:border-slate-600 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20"
              }`}
          >
            <div className="text-2xl mb-2">📧</div>
            <div className="text-sm font-medium text-slate-900 dark:text-white">Reminders</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
