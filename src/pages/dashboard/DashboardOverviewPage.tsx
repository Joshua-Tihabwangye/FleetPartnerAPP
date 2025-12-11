import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function DashboardOverviewPage() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<"today" | "week" | "month">("today");
  const [messagesCount, setMessagesCount] = useState(0);
  const [lastMessageSubject, setLastMessageSubject] = useState("No messages");

  // Load messages count from localStorage
  useEffect(() => {
    const messages = JSON.parse(localStorage.getItem("support_messages") || "[]");
    setMessagesCount(messages.length);
    // Set last message subject if messages exist
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      setLastMessageSubject(lastMessage.subject || "Invoice query");
    } else {
      // Default subjects for demo
      setLastMessageSubject("Vehicle onboarding");
    }
  }, []);

  // Revenue data based on date range
  const revenueData: Record<"today" | "week" | "month", { value: string; change: string }> = {
    today: { value: "UGX 12.4M", change: "+15%" },
    week: { value: "UGX 78.2M", change: "+12%" },
    month: { value: "UGX 324.5M", change: "+18%" }
  };

  const stats = [
    { label: "Vehicles online", value: "128", change: "+12", color: "emerald" },
    { label: "Active drivers", value: "94", change: "+5", color: "blue" },
    { label: "Trips today", value: "1,420", change: "+8%", color: "purple" }
  ];

  // Alert data
  const alerts = {
    offlineVehicles: { count: 7, hours: 4 },
    highCancellations: { count: 3, drivers: ["John M.", "Sarah K.", "Mike T."] },
    pendingIncidents: { count: 2, type: "ambulance" }
  };

  // Recent activity - highlighting exceptions
  const recentActivity = [
    { icon: "⚠️", title: "Driver suspended", subtitle: "John M. • Multiple violations", time: "5 min ago", type: "exception" },
    { icon: "📋", title: "Contract expiring", subtitle: "Fleet lease #2341 • Expires Dec 15", time: "1 hour ago", type: "exception" },
    { icon: "🎉", title: "Big booking confirmed", subtitle: "Corporate event • 12 vehicles", time: "2 hours ago", type: "exception" }
  ];

  // Driver compliance stats
  const driverCompliance = {
    completed: 78,
    courseName: "Safety Course"
  };

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-6 bg-slate-50">
      {/* Enhanced Header */}
      <div className="mb-6 pb-6 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 mb-1">
              Dashboard Overview
            </h1>
            <p className="text-sm text-slate-600">
              Real-time fleet operations and performance metrics
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/live-map"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-ev-green transition"
            >
              🗺️ Live Fleet Map
            </Link>
            <Link
              to="/dispatch/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-ev-green to-emerald-600 text-white text-sm font-medium shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition"
            >
              + New Dispatch
            </Link>
          </div>
        </div>
        <div className="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-ev-green via-emerald-400 to-orange-400 opacity-80" />
      </div>

      {/* Stats Grid - First Row */}
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

        {/* Net Revenue with Date Range */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs text-slate-500">Net revenue</div>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="text-[10px] bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 text-slate-600 cursor-pointer hover:bg-slate-50"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-semibold text-slate-900">{revenueData[dateRange].value}</div>
            <div className="text-xs font-medium text-green-600">
              {revenueData[dateRange].change}
            </div>
          </div>
        </div>
      </div>

      {/* NEEDS ATTENTION Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">🚨</span>
          <h2 className="text-lg font-semibold text-slate-900">Needs Attention</h2>
          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium">
            {alerts.offlineVehicles.count + alerts.highCancellations.count + alerts.pendingIncidents.count} items
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Live Fleet Map Snapshot */}
          <div
            onClick={() => navigate('/live-map')}
            className="lg:col-span-1 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 p-4 shadow-sm hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400">Live Fleet Map</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  LIVE
                </span>
              </div>
              {/* Mini Map Preview / Heatmap */}
              <div className="h-24 bg-slate-700/50 rounded-lg flex items-center justify-center mb-3 relative overflow-hidden">
                {/* Simulated heatmap dots */}
                <div className="absolute inset-0">
                  <div className="absolute top-4 left-6 w-3 h-3 rounded-full bg-emerald-500/60 blur-sm" />
                  <div className="absolute top-8 left-12 w-4 h-4 rounded-full bg-emerald-400/50 blur-sm" />
                  <div className="absolute top-6 right-8 w-3 h-3 rounded-full bg-yellow-500/50 blur-sm" />
                  <div className="absolute bottom-6 left-8 w-2 h-2 rounded-full bg-emerald-500/70 blur-sm" />
                  <div className="absolute bottom-4 right-6 w-3 h-3 rounded-full bg-emerald-500/50 blur-sm" />
                  <div className="absolute top-10 left-20 w-2 h-2 rounded-full bg-red-500/50 blur-sm" />
                </div>
                <span className="text-3xl z-10">🗺️</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">128 vehicles active</span>
                <span className="text-emerald-400 group-hover:translate-x-1 transition-transform">View →</span>
              </div>
            </div>
          </div>

          {/* Offline Vehicles Alert */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-xl">
                ⚠️
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-amber-900 mb-1">Offline Vehicles</div>
                <div className="text-2xl font-bold text-amber-700">{alerts.offlineVehicles.count}</div>
                <div className="text-xs text-amber-600 mt-1">
                  Offline for {alerts.offlineVehicles.hours}+ hours
                </div>
              </div>
            </div>
            <Link to="/vehicles?filter=offline" className="mt-3 block text-xs text-amber-700 hover:text-amber-900 font-medium">
              View details →
            </Link>
          </div>

          {/* High Cancellations Alert */}
          <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl border border-red-200 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-xl">
                🚫
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-red-900 mb-1">High Cancellations</div>
                <div className="text-2xl font-bold text-red-700">{alerts.highCancellations.count} drivers</div>
                <div className="text-xs text-red-600 mt-1">
                  {alerts.highCancellations.drivers.slice(0, 2).join(", ")}...
                </div>
              </div>
            </div>
            <Link to="/drivers?filter=high-cancellation" className="mt-3 block text-xs text-red-700 hover:text-red-900 font-medium">
              Review drivers →
            </Link>
          </div>

          {/* Pending Incidents Alert */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-xl">
                🚨
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-purple-900 mb-1">Pending Incidents</div>
                <div className="text-2xl font-bold text-purple-700">{alerts.pendingIncidents.count}</div>
                <div className="text-xs text-purple-600 mt-1">
                  Ambulance cases awaiting review
                </div>
              </div>
            </div>
            <Link to="/ambulance/cases?status=pending" className="mt-3 block text-xs text-purple-700 hover:text-purple-900 font-medium">
              Review cases →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-cream rounded-xl border border-slate-200 p-6 shadow-card hover:shadow-card-hover card-hover-lift">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-3">
            <Link
              to="/vehicles/create"
              className="flex flex-col items-center justify-center p-4 rounded-lg border border-slate-200 bg-white shadow-sm hover:border-ev-green hover:bg-emerald-50 hover:shadow-md transition-all"
            >
              <span className="text-2xl mb-2">🚙</span>
              <span className="text-xs font-medium text-slate-700 text-center">Add vehicle</span>
            </Link>
            <Link
              to="/drivers/new"
              className="flex flex-col items-center justify-center p-4 rounded-lg border border-slate-200 bg-white shadow-sm hover:border-ev-green hover:bg-emerald-50 hover:shadow-md transition-all"
            >
              <span className="text-2xl mb-2">👤</span>
              <span className="text-xs font-medium text-slate-700 text-center">Add driver</span>
            </Link>
            <Link
              to="/dispatch/new"
              className="flex flex-col items-center justify-center p-4 rounded-lg border border-slate-200 bg-white shadow-sm hover:border-ev-green hover:bg-emerald-50 hover:shadow-md transition-all"
            >
              <span className="text-2xl mb-2">📲</span>
              <span className="text-xs font-medium text-slate-700 text-center">New dispatch</span>
            </Link>
            <Link
              to="/live-map"
              className="flex flex-col items-center justify-center p-4 rounded-lg border border-slate-200 bg-white shadow-sm hover:border-ev-green hover:bg-emerald-50 hover:shadow-md transition-all"
            >
              <span className="text-2xl mb-2">🗺️</span>
              <span className="text-xs font-medium text-slate-700 text-center">Live Fleet Map</span>
            </Link>
            <Link
              to="/earnings/payouts"
              className="flex flex-col items-center justify-center p-4 rounded-lg border border-slate-200 bg-white shadow-sm hover:border-orange-400 hover:bg-orange-50 hover:shadow-md transition-all"
            >
              <span className="text-2xl mb-2">✅</span>
              <span className="text-xs font-medium text-slate-700 text-center">Approve payouts</span>
            </Link>
            <Link
              to="/earnings"
              className="flex flex-col items-center justify-center p-4 rounded-lg border border-slate-200 bg-white shadow-sm hover:border-orange-400 hover:bg-orange-50 hover:shadow-md transition-all"
            >
              <span className="text-2xl mb-2">📊</span>
              <span className="text-xs font-medium text-slate-700 text-center">Earnings report</span>
            </Link>
          </div>
        </div>

        <div className="bg-cream rounded-xl border border-slate-200 p-6 shadow-card hover:shadow-card-hover card-hover-lift">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
              Exceptions
            </span>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs ${activity.type === 'exception' ? 'bg-amber-100' : 'bg-emerald-100'
                  }`}>
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-900">{activity.title}</div>
                  <div className="text-xs text-slate-500">{activity.subtitle}</div>
                </div>
                <div className="text-xs text-slate-400">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Messages & Training Card - New Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Link
          to="/support/messages"
          className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-4 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-blue-600 font-medium mb-1">Support Messages</div>
              <div className="text-2xl font-bold text-blue-700">{messagesCount}</div>
              <div className="text-xs text-blue-500 mt-1">
                Last: {lastMessageSubject}
              </div>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              ✉️
            </div>
          </div>
        </Link>
        <Link
          to="/training"
          className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200 p-4 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-emerald-600 font-medium mb-1">Driver Compliance</div>
              <div className="text-2xl font-bold text-emerald-700">{driverCompliance.completed}%</div>
              <div className="text-xs text-emerald-500 mt-1">
                Drivers completed {driverCompliance.courseName}
              </div>
            </div>
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              🎓
            </div>
          </div>
        </Link>
        <Link
          to="/help"
          className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border border-violet-200 p-4 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-violet-600 font-medium mb-1">Help & Support</div>
              <div className="text-2xl font-bold text-violet-700">24/7</div>
              <div className="text-xs text-violet-500 mt-1">Get assistance →</div>
            </div>
            <div className="h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              ❓
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
