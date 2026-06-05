import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BarChart, PieChart, Sparkline } from "../../components/ui/Charts";
import PeriodSelector from "../../components/ui/PeriodSelector";
import {
  isFleetBackendEnabled,
  listFleetComplianceIncidents,
  refreshFleetWorkspaceState,
  getCachedFleetVehicles,
  getCachedFleetDrivers,
  getCachedFleetDispatches,
  getCachedFleetIncidents,
} from "../../services/api/fleetApi";

function makeSparkline(value: number): number[] {
  if (value <= 0) return [0, 0, 0, 0, 0, 0, 0];
  const base = value * 0.75;
  const step = (value - base) / 6;
  return Array.from({ length: 7 }, (_, i) => Math.round(base + step * i));
}

export default function DashboardOverviewPage() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<"today" | "week" | "month" | "year">("today");
  const [messagesCount, setMessagesCount] = useState(0);
  const [lastMessageSubject, setLastMessageSubject] = useState("No messages");
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState([
    { label: "Vehicles online", value: "0", change: "+0", color: "emerald", sparkline: makeSparkline(0) },
    { label: "Active drivers", value: "0", change: "+0", color: "blue", sparkline: makeSparkline(0) },
    { label: "Trips today", value: "0", change: "+0", color: "purple", sparkline: makeSparkline(0) },
  ]);

  const [fleetStatus, setFleetStatus] = useState([
    { label: "Online", value: 0, color: "#10b981" },
    { label: "On Trip", value: 0, color: "#3b82f6" },
    { label: "Offline", value: 0, color: "#ef4444" },
    { label: "Maintenance", value: 0, color: "#f59e0b" },
  ]);

  const [alerts, setAlerts] = useState({
    offlineVehicles: { count: 0, hours: 0 },
    highCancellations: { count: 0, drivers: [] as string[] },
    pendingIncidents: { count: 0, type: "ambulance" },
  });

  // Load support activity from backend incidents when backend mode is enabled.
  useEffect(() => {
    const hydrate = async () => {
      if (isFleetBackendEnabled()) {
        try {
          const incidents = await listFleetComplianceIncidents();
          const support = incidents.filter((item) => item.category.toLowerCase() === "support");
          setMessagesCount(support.length);
          if (support.length > 0) {
            const latest = support[0];
            const subjectMatch = latest.description.match(/^\[(.*?)\]\s*/);
            setLastMessageSubject(subjectMatch?.[1] || "Support request");
          } else {
            setLastMessageSubject("No messages");
          }
          return;
        } catch (error) {
          console.warn("Failed to load backend support incident summary. Using local cache.", error);
        }
      }

      const messages = JSON.parse(localStorage.getItem("support_messages") || "[]");
      setMessagesCount(messages.length);
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        setLastMessageSubject(lastMessage.subject || "Invoice query");
      } else {
        setLastMessageSubject("Vehicle onboarding");
      }
    };

    void hydrate();
  }, []);

  // Load and compute fleet stats from cache on mount.
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await refreshFleetWorkspaceState();

      const vehicles = getCachedFleetVehicles();
      const drivers = getCachedFleetDrivers();
      const dispatches = getCachedFleetDispatches();
      const incidents = getCachedFleetIncidents();

      const vehiclesOnline = vehicles.filter((v: any) => v.status === "available").length;
      const activeDrivers = drivers.filter((d: any) => d.status === "available").length;
      const tripsToday = dispatches.length;

      setStats([
        { label: "Vehicles online", value: String(vehiclesOnline), change: "+0", color: "emerald", sparkline: makeSparkline(vehiclesOnline) },
        { label: "Active drivers", value: String(activeDrivers), change: "+0", color: "blue", sparkline: makeSparkline(activeDrivers) },
        { label: "Trips today", value: String(tripsToday), change: "+0", color: "purple", sparkline: makeSparkline(tripsToday) },
      ]);

      const offlineCount = vehicles.filter((v: any) => v.status === "offline").length;
      const maintenanceCount = vehicles.filter((v: any) => v.status === "maintenance").length;
      const onlineCount = vehicles.filter((v: any) => v.status === "available").length;

      const onTripPlates = new Set(
        dispatches
          .filter((d: any) => d.status === "in-progress")
          .map((d: any) => d.vehicle)
          .filter(Boolean)
      );
      const onTripCount = vehicles.filter((v: any) => onTripPlates.has(v.plate)).length;

      setFleetStatus([
        { label: "Online", value: onlineCount, color: "#10b981" },
        { label: "On Trip", value: onTripCount, color: "#3b82f6" },
        { label: "Offline", value: offlineCount, color: "#ef4444" },
        { label: "Maintenance", value: maintenanceCount, color: "#f59e0b" },
      ]);

      const cancelledDispatches = dispatches.filter((d: any) => d.status === "cancelled");
      const cancellationDrivers = cancelledDispatches
        .map((d: any) => d.driver)
        .filter((name: string) => name && name !== "-");

      const pendingIncidentsCount = incidents.filter((i: any) => i.status === "open").length;

      setAlerts({
        offlineVehicles: { count: offlineCount, hours: 4 },
        highCancellations: {
          count: cancelledDispatches.length,
          drivers: cancellationDrivers.slice(0, 3),
        },
        pendingIncidents: { count: pendingIncidentsCount, type: "ambulance" },
      });

      setLoading(false);
    };

    void load();
  }, []);

  // Revenue data based on date range
  const revenueData: Record<"today" | "week" | "month" | "year", { value: string; change: string }> = {
    today: { value: "UGX 12.4M", change: "+15%" },
    week: { value: "UGX 78.2M", change: "+12%" },
    month: { value: "UGX 324.5M", change: "+18%" },
    year: { value: "UGX 3.8B", change: "+24%" }
  };

  // Chart data
  const weeklyRevenue = [
    { label: "Mon", value: 14500000 },
    { label: "Tue", value: 12800000 },
    { label: "Wed", value: 16200000 },
    { label: "Thu", value: 15100000 },
    { label: "Fri", value: 18900000 },
    { label: "Sat", value: 22100000 },
    { label: "Sun", value: 17800000 }
  ];

  // Recent activity
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
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
              Dashboard Overview
            </h1>
            <p className="text-sm text-slate-600">
              Real-time fleet operations and performance metrics
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <PeriodSelector value={dateRange as any} onChange={(v) => setDateRange(v as any)} />
            <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>
            <Link
              to="/live-map"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-ev-green transition"
            >
              🗺️ Live Map
            </Link>
            <Link
              to="/dispatch/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-ev-green text-white text-sm font-medium hover:bg-emerald-600 shadow-md shadow-emerald-500/20 transition"
            >
              + New Dispatch
            </Link>
          </div>
        </div>
      </div>

      {loading && (
        <div className="mb-6 text-sm text-slate-500">Loading fleet data…</div>
      )}

      {/* Stats Grid - First Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, idx) => {
          const colors: Record<string, string> = { emerald: "#10b981", blue: "#3b82f6", purple: "#8b5cf6" };
          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.label}</div>
                {/* Card Period Selector */}
                <select className="text-[10px] border-none bg-slate-50 text-slate-500 rounded p-0.5 cursor-pointer focus:ring-0 outline-none opacity-0 group-hover:opacity-100 transition-opacity">
                  <option>Today</option>
                  <option>Week</option>
                </select>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                <div className={`text-xs font-medium px-2 py-1 rounded-full ${stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-700' :
                  stat.color === 'blue' ? 'bg-blue-50 text-blue-700' :
                    'bg-purple-50 text-purple-700'
                  }`}>
                  {stat.change}
                </div>
              </div>
              <Sparkline data={stat.sparkline} color={colors[stat.color]} height={32} />
            </div>
          );
        })}

        {/* Net Revenue with Date Range - Light Solid */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Net revenue</div>
            <span className="text-[10px] text-slate-400 font-medium px-2 py-0.5 rounded-full bg-slate-100">
              {dateRange === 'today' ? 'Today' : dateRange === 'week' ? 'This Week' : dateRange === 'month' ? 'This Month' : 'This Year'}
            </span>
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <div className="text-3xl font-bold text-slate-900">{revenueData[dateRange].value}</div>
            <div className="text-xs font-medium bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">
              {revenueData[dateRange].change}
            </div>
          </div>
          <div className="mt-2">
            <Sparkline data={[8, 12, 9, 14, 11, 15, 13, 18]} color="#10b981" height={32} />
          </div>
        </div>
      </div>


      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Weekly Trip Volume */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Weekly Trip Volume</h3>
              <p className="text-xs text-slate-500">Daily trips this week</p>
            </div>
            <select className="text-xs bg-white border border-slate-200 rounded-md px-2 py-1 outline-none">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          <BarChart
            data={[
              { label: "Mon", value: 180 },
              { label: "Tue", value: 195 },
              { label: "Wed", value: 210 },
              { label: "Thu", value: 188 },
              { label: "Fri", value: 245 },
              { label: "Sat", value: 280 },
              { label: "Sun", value: 122 }
            ]}
            height={160}
            showValues={true}
          />
        </div>

        {/* Fleet Status */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Fleet Status</h3>
              <p className="text-xs text-slate-500">Current vehicle distribution</p>
            </div>
            <select className="text-xs bg-white border border-slate-200 rounded-md px-2 py-1 outline-none">
              <option>Live</option>
            </select>
          </div>
          <div className="flex justify-center">
            <PieChart
              data={fleetStatus}
              size={140}
              donut={true}
              showLabels={true}
            />
          </div>
        </div>
      </div>

      {/* NEEDS ATTENTION Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-bold text-slate-900">Needs Attention</h2>
          <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100 text-xs font-bold">
            {alerts.offlineVehicles.count + alerts.highCancellations.count + alerts.pendingIncidents.count}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Live Fleet Map Snapshot - Redesigned */}
          <div
            onClick={() => navigate('/live-map')}
            className="lg:col-span-1 bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer group relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Live Fleet Map</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 font-medium animate-pulse">
                  LIVE
                </span>
              </div>
              <div className="h-24 bg-slate-50 rounded-lg flex items-center justify-center mb-3 relative overflow-hidden border border-slate-100">
                <span className="text-3xl z-10 opacity-50 grayscale group-hover:grayscale-0 transition-all">🗺️</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">{fleetStatus.find(s => s.label === "Online")?.value ?? 0} vehicles active</span>
                <span className="text-emerald-600 font-medium group-hover:translate-x-1 transition-transform">View →</span>
              </div>
            </div>
          </div>

          {/* Offline Vehicles Alert - Redesigned */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:border-red-100 transition-all">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center text-xl text-red-500">
                ⚠️
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-900 mb-1">Offline Vehicles</div>
                <div className="text-2xl font-bold text-slate-900">{alerts.offlineVehicles.count}</div>
                <div className="text-xs text-red-600 mt-1 font-medium">
                  {alerts.offlineVehicles.hours}+ hours inactive
                </div>
              </div>
            </div>
            <Link to="/vehicles?filter=offline" className="mt-3 block text-xs text-slate-500 hover:text-slate-900 font-medium text-right">
              View details →
            </Link>
          </div>

          {/* High Cancellations Alert - Redesigned */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:border-orange-100 transition-all">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center text-xl text-orange-500">
                🚫
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-900 mb-1">High Cancellations</div>
                <div className="text-2xl font-bold text-slate-900">{alerts.highCancellations.count} <span className="text-sm font-normal text-slate-500">drivers</span></div>
                <div className="text-xs text-orange-600 mt-1 font-medium">
                  Review needed
                </div>
              </div>
            </div>
            <Link to="/drivers?filter=high-cancellation" className="mt-3 block text-xs text-slate-500 hover:text-slate-900 font-medium text-right">
              Review drivers →
            </Link>
          </div>

          {/* Pending Incidents Alert - Redesigned */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:border-blue-100 transition-all">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-xl text-blue-500">
                🚨
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-900 mb-1">Pending Incidents</div>
                <div className="text-2xl font-bold text-slate-900">{alerts.pendingIncidents.count}</div>
                <div className="text-xs text-blue-600 mt-1 font-medium">
                  Awaiting review
                </div>
              </div>
            </div>
            <Link to="/ambulance/cases?status=pending" className="mt-3 block text-xs text-slate-500 hover:text-slate-900 font-medium text-right">
              View cases →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-bg-slate-50 rounded-xl border border-slate-200 p-6 shadow-sm bg-white">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Link
              to="/vehicles/create"
              className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:border-ev-green hover:shadow-md transition-all group"
            >
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">🚙</span>
              <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900 text-center">Add vehicle</span>
            </Link>
            <Link
              to="/drivers/new"
              className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:border-ev-green hover:shadow-md transition-all group"
            >
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">👤</span>
              <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900 text-center">Add driver</span>
            </Link>
            <Link
              to="/dispatch/new"
              className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:border-ev-green hover:shadow-md transition-all group"
            >
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📲</span>
              <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900 text-center">New dispatch</span>
            </Link>
            <Link
              to="/live-map"
              className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:border-ev-green hover:shadow-md transition-all group"
            >
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">🗺️</span>
              <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900 text-center">Live Map</span>
            </Link>
            <Link
              to="/earnings/payouts"
              className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:border-orange-400 hover:shadow-md transition-all group"
            >
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">✅</span>
              <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900 text-center">Approve payouts</span>
            </Link>
            <Link
              to="/earnings"
              className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:border-orange-400 hover:shadow-md transition-all group"
            >
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📊</span>
              <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900 text-center">Earnings report</span>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
            <Link to="/settings/activity-log" className="text-xs font-medium text-ev-green hover:text-emerald-700">View all</Link>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center text-lg ${activity.type === 'exception' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap justify-between items-start gap-1 mb-0.5">
                    <div className="text-sm font-semibold text-slate-900">{activity.title}</div>
                    <div className="text-xs text-slate-400">{activity.time}</div>
                  </div>
                  <div className="text-xs text-slate-500 line-clamp-1">{activity.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Messages & Training Card - Redesigned */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Link
          to="/support/messages"
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Support Messages</div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{messagesCount}</div>
              <div className="text-xs text-blue-600 font-medium">
                Latest: {lastMessageSubject}
              </div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform text-blue-600">
              ✉️
            </div>
          </div>
        </Link>
        <Link
          to="/training"
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Driver Compliance</div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{driverCompliance.completed}%</div>
              <div className="text-xs text-emerald-600 font-medium">
                {driverCompliance.courseName}
              </div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform text-emerald-600">
              🎓
            </div>
          </div>
        </Link>
        <Link
          to="/help"
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-purple-200 transition-all group"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Help & Support</div>
              <div className="text-3xl font-bold text-slate-900 mb-1">24/7</div>
              <div className="text-xs text-purple-600 font-medium">Get assistance →</div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform text-purple-600">
              ❓
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
