import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BarChart, PieChart, Sparkline, LineChart, ProgressRing } from "../../../components/ui/Charts";

export default function ShuttleDashboardPage() {
  const [dateRange, setDateRange] = useState<"today" | "week" | "month">("today");
  const [activeRuns, setActiveRuns] = useState(0);

  useEffect(() => {
    // Simulate active runs count
    setActiveRuns(3);
  }, []);

  // Key Metrics
  const keyMetrics = [
    { 
      label: "Active Routes", 
      value: "6", 
      change: "+1", 
      color: "emerald", 
      sparkline: [4, 5, 5, 6, 6, 6, 6],
      icon: "🚌"
    },
    { 
      label: "Total Students", 
      value: "142", 
      change: "+8", 
      color: "blue", 
      sparkline: [120, 125, 130, 135, 138, 140, 142],
      icon: "👥"
    },
    { 
      label: "Active Vehicles", 
      value: "6", 
      change: "100%", 
      color: "purple", 
      sparkline: [5, 5, 6, 6, 6, 6, 6],
      icon: "🚗"
    },
    { 
      label: "Avg Attendance", 
      value: "94%", 
      change: "+2%", 
      color: "orange", 
      sparkline: [88, 90, 91, 92, 93, 94, 94],
      icon: "✅"
    }
  ];

  // Performance Stats
  const performanceStats = [
    { label: "On-Time Performance", value: 87, color: "#10b981", bg: "from-emerald-500 to-teal-600" },
    { label: "Route Efficiency", value: 92, color: "#3b82f6", bg: "from-blue-500 to-cyan-600" },
    { label: "Parent Satisfaction", value: 89, color: "#f59e0b", bg: "from-orange-500 to-amber-600" },
    { label: "Safety Score", value: 96, color: "#8b5cf6", bg: "from-purple-500 to-indigo-600" }
  ];

  // Revenue data
  const revenueData: Record<"today" | "week" | "month", { value: string; change: string }> = {
    today: { value: "UGX 2.4M", change: "+12%" },
    week: { value: "UGX 16.8M", change: "+8%" },
    month: { value: "UGX 68.5M", change: "+15%" }
  };

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

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      {/* Header */}
      <div className="mb-6 pb-6 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-1">
              School Shuttles Dashboard
            </h1>
            <p className="text-sm text-slate-600">
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-ev-green to-emerald-600 text-white text-sm font-medium shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition"
            >
              + New Route
            </Link>
          </div>
        </div>
        <div className="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-80" />
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map((alert, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border ${
                alert.type === "warning"
                  ? "bg-yellow-50 border-yellow-200"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {alert.type === "warning" ? "⚠️" : "ℹ️"}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{alert.message}</p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {alert.count} item{alert.count !== 1 ? "s" : ""} require attention
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {keyMetrics.map((metric, idx) => {
          const colors: Record<string, string> = {
            emerald: "#10b981",
            blue: "#3b82f6",
            purple: "#8b5cf6",
            orange: "#f59e0b"
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
                    metric.color === "emerald"
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
              <div className="text-2xl font-bold text-slate-900 mb-2">{metric.value}</div>
              <Sparkline data={metric.sparkline} color={colors[metric.color]} height={32} />
            </div>
          );
        })}
      </div>

      {/* Revenue Card */}
      <div className="mb-6">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-emerald-100 mb-1">Total Revenue</div>
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
            <span className="text-sm text-emerald-100">↑ {revenueData[dateRange].change}</span>
            <span className="text-xs text-emerald-200">vs last period</span>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {performanceStats.map((stat, idx) => (
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
        {/* Attendance Trend */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Attendance Trend</h3>
          <LineChart
            data={attendanceTrendData}
            labels={attendanceTrendLabels}
            height={150}
            color="#10b981"
            showArea={true}
          />
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-600">Average: 92%</span>
            <span className="text-emerald-600 font-medium">↑ +4% this month</span>
          </div>
        </div>

        {/* Route Performance */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Students per Route</h3>
          <BarChart data={routePerformance} height={150} showValues={true} />
        </div>
      </div>

      {/* Active Runs & Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Active Runs */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Active Shuttle Runs</h3>
            <Link
              to="/school-shuttles/operations"
              className="text-sm text-ev-green hover:text-ev-green-dark font-medium"
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
                    <p className="font-semibold text-slate-900">{run.route}</p>
                    <p className="text-xs text-slate-600">{run.driver} • {run.students} students</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-white/80">
                    {run.status.replace("-", " ")}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-600">Progress</span>
                    <span className="text-xs font-medium text-slate-900">{run.progress}%</span>
                  </div>
                  <div className="w-full bg-white/50 rounded-full h-2">
                    <div
                      className="bg-current rounded-full h-2 transition-all"
                      style={{ width: `${run.progress}%` }}
                    />
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-600">ETA: {run.eta}</span>
                  <Link
                    to={`/school-shuttles/routes/${run.id}/track`}
                    className="text-xs text-ev-green hover:text-ev-green-dark font-medium"
                  >
                    Track Live →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Student Status</h3>
          <PieChart data={statusBreakdown} size={180} donut={true} showLabels={true} />
        </div>
      </div>

      {/* Weekly Trips & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Weekly Trips */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Weekly Trips</h3>
          <BarChart data={weeklyTrips} height={150} showValues={true} />
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-600">Total: 713 trips</span>
            <span className="text-emerald-600 font-medium">↑ +5% vs last week</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border ${getActivityColor(activity.type)}`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">{activity.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{activity.subtitle}</p>
                    <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/school-shuttles/routes"
            className="p-4 rounded-lg border border-slate-200 hover:border-ev-green hover:bg-emerald-50 transition-colors text-center"
          >
            <div className="text-2xl mb-2">🚌</div>
            <div className="text-sm font-medium text-slate-900">View Routes</div>
          </Link>
          <Link
            to="/school-shuttles/students"
            className="p-4 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
          >
            <div className="text-2xl mb-2">👥</div>
            <div className="text-sm font-medium text-slate-900">Manage Students</div>
          </Link>
          <Link
            to="/school-shuttles/operations"
            className="p-4 rounded-lg border border-slate-200 hover:border-purple-500 hover:bg-purple-50 transition-colors text-center"
          >
            <div className="text-2xl mb-2">📊</div>
            <div className="text-sm font-medium text-slate-900">Operations Board</div>
          </Link>
          <Link
            to="/school-shuttles/bulk-reminders"
            className="p-4 rounded-lg border border-slate-200 hover:border-orange-500 hover:bg-orange-50 transition-colors text-center"
          >
            <div className="text-2xl mb-2">📧</div>
            <div className="text-sm font-medium text-slate-900">Send Reminders</div>
          </Link>
        </div>
      </div>
    </div>
  );
}

