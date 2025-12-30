import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart, PieChart, Sparkline, LineChart } from "../../../components/ui/Charts";

export default function ToursDashboardPage() {
  const location = useLocation();
  const [chartPeriod, setChartPeriod] = useState<"2025" | "2026" | "2027" | "2028" | "2029" | "2030" | "2031">("2025");
  const [tourStatusPeriod, setTourStatusPeriod] = useState<"today" | "week" | "month" | "year">("month");
  const [bookingStatusPeriod, setBookingStatusPeriod] = useState<"today" | "week" | "month" | "year">("month");

  // Period selectors for each metric card
  const [activeToursPeriod, setActiveToursPeriod] = useState("today");
  const [bookingsPeriod, setBookingsPeriod] = useState("today");
  const [revenuePeriod, setRevenuePeriod] = useState("today");
  const [occupancyPeriod, setOccupancyPeriod] = useState("today");

  // Key Metrics with individual period state
  const keyMetrics = [
    {
      label: "Active Tours",
      value: "8",
      change: "+2",
      color: "emerald",
      sparkline: [5, 6, 6, 7, 7, 8, 8],
      icon: "🌍",
      period: activeToursPeriod,
      setPeriod: setActiveToursPeriod
    },
    {
      label: "Total Bookings",
      value: "142",
      change: "+24",
      color: "blue",
      sparkline: [110, 115, 120, 125, 130, 135, 142],
      icon: "📋",
      period: bookingsPeriod,
      setPeriod: setBookingsPeriod
    },
    {
      label: "Revenue",
      value: "UGX 18.5M",
      change: "+18%",
      color: "emerald",
      sparkline: [14, 15, 15.5, 16, 16.5, 17, 18.5],
      icon: "💰",
      period: revenuePeriod,
      setPeriod: setRevenuePeriod
    },
    {
      label: "Occupancy Rate",
      value: "76%",
      change: "+6%",
      color: "orange",
      sparkline: [68, 70, 72, 73, 74, 75, 76],
      icon: "👥",
      period: occupancyPeriod,
      setPeriod: setOccupancyPeriod
    }
  ];

  // Tour status breakdown
  const tourStatus = [
    { label: "Active", value: 8, color: "#10b981" },
    { label: "Scheduled", value: 5, color: "#3b82f6" },
    { label: "Completed", value: 28, color: "#6b7280" },
    { label: "Cancelled", value: 2, color: "#ef4444" }
  ];

  // Booking status breakdown
  const bookingStatus = [
    { label: "Confirmed", value: 98, color: "#10b981" },
    { label: "Pending", value: 24, color: "#f59e0b" },
    { label: "In Progress", value: 12, color: "#3b82f6" },
    { label: "Completed", value: 8, color: "#6b7280" }
  ];

  // Weekly bookings trend
  const weeklyBookings = [
    { label: "Mon", value: 12 },
    { label: "Tue", value: 18 },
    { label: "Wed", value: 15 },
    { label: "Thu", value: 22 },
    { label: "Fri", value: 20 },
    { label: "Sat", value: 28 },
    { label: "Sun", value: 25 }
  ];

  // Revenue trend
  const revenueTrendData = [1.2, 1.4, 1.3, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0, 2.1, 2.2, 2.1];
  const revenueTrendLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Popular tours
  const popularTours = [
    { name: "Kampala City Tour", bookings: 45, revenue: "UGX 6.8M", occupancy: 85 },
    { name: "Safari Adventure", bookings: 38, revenue: "UGX 5.7M", occupancy: 78 },
    { name: "Cultural Heritage", bookings: 32, revenue: "UGX 4.8M", occupancy: 72 },
    { name: "Gorilla Trekking", bookings: 27, revenue: "UGX 8.1M", occupancy: 90 }
  ];

  // Recent bookings
  const recentBookings = [
    { id: "TUR-001", customer: "Michael Anderson", tour: "Murchison Falls Safari", status: "confirmed", date: "2024-02-01" },
    { id: "TUR-002", customer: "Lisa Martinez", tour: "Gorilla Trekking", status: "pending", date: "2024-02-10" },
    { id: "TUR-003", customer: "David Chen", tour: "Queen Elizabeth Tour", status: "in-progress", date: "2024-01-28" }
  ];

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
              Tours & Charters Dashboard
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Monitor and manage tour packages and charter services
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              to="/tours/list"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-ev-green transition"
            >
              🌍 View Tours
            </Link>
            <Link
              to="/tours/create"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-ev-green text-white text-sm font-medium shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition"
            >
              + Create Tour
            </Link>
          </div>
        </div>
        <div className="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-orange-500 opacity-80" />
      </div>

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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Trend - with year period selector */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Revenue Trend (Million UGX)</h3>
            <select
              value={chartPeriod}
              onChange={(e) => setChartPeriod(e.target.value as any)}
              className="text-xs border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg px-2 py-1 cursor-pointer focus:ring-ev-green focus:border-ev-green outline-none ml-4"
            >
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
              <option value="2028">2028</option>
              <option value="2029">2029</option>
              <option value="2030">2030</option>
              <option value="2031">2031</option>
            </select>
          </div>
          <LineChart
            data={revenueTrendData}
            labels={revenueTrendLabels}
            height={150}
            color="#f59e0b"
            showArea={true}
          />
          <div className="mt-12 flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Average: UGX 1.7M</span>
            <span className="text-orange-600 font-medium">↑ +15% this month</span>
          </div>
        </div>

        {/* Weekly Bookings */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Weekly Bookings</h3>
            <select className="text-xs border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg px-2 py-1 cursor-pointer focus:ring-ev-green focus:border-ev-green outline-none">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          <BarChart data={weeklyBookings} height={150} showValues={true} />
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Total: 140 bookings</span>
            <span className="text-emerald-600 font-medium">↑ +12% vs last week</span>
          </div>
        </div>
      </div>

      {/* Status Breakdowns - with period dropdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Tour Status */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Tour Status</h3>
            <select
              value={tourStatusPeriod}
              onChange={(e) => setTourStatusPeriod(e.target.value as any)}
              className="text-xs border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg px-2 py-1 cursor-pointer focus:ring-ev-green focus:border-ev-green outline-none"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <PieChart data={tourStatus} size={180} donut={true} showLabels={true} />
        </div>

        {/* Booking Status */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Booking Status</h3>
            <select
              value={bookingStatusPeriod}
              onChange={(e) => setBookingStatusPeriod(e.target.value as any)}
              className="text-xs border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg px-2 py-1 cursor-pointer focus:ring-ev-green focus:border-ev-green outline-none"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <PieChart data={bookingStatus} size={180} donut={true} showLabels={true} />
        </div>
      </div>

      {/* Popular Tours & Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Popular Tours */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Popular Tours</h3>
          <div className="space-y-3">
            {popularTours.map((tour, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 hover:border-emerald-200 transition">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-slate-900 dark:text-white">{tour.name}</p>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">{tour.occupancy}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">{tour.bookings} bookings</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{tour.revenue}</span>
                </div>
                <div className="mt-2 w-full bg-slate-200 dark:bg-slate-600 rounded-full h-1.5">
                  <div
                    className="bg-ev-green rounded-full h-1.5 transition-all"
                    style={{ width: `${tour.occupancy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Bookings</h3>
            <Link
              to="/tours/bookings"
              className="text-sm text-ev-green hover:text-emerald-700 font-medium"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {recentBookings.map((booking) => (
              <Link
                key={booking.id}
                to={`/tours/bookings`}
                className="block p-3 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-ev-green hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">{booking.id}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{booking.customer} • {booking.tour}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${booking.status === "confirmed"
                      ? "bg-emerald-100 text-emerald-700"
                      : booking.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                      }`}
                  >
                    {booking.status.replace("-", " ")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions - with green ring for current page */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/tours"
            className={`p-4 rounded-lg border transition-colors text-center ${isCurrentPage("/tours") && !isCurrentPage("/tours/bookings") && !isCurrentPage("/tours/create")
              ? "border-ev-green ring-2 ring-ev-green bg-emerald-50 dark:bg-emerald-900/20"
              : "border-slate-200 dark:border-slate-600 hover:border-ev-green hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
              }`}
          >
            <div className="text-2xl mb-2">🌍</div>
            <div className="text-sm font-medium text-slate-900 dark:text-white">View Tours</div>
          </Link>
          <Link
            to="/tours/bookings"
            className={`p-4 rounded-lg border transition-colors text-center ${isCurrentPage("/tours/bookings") && !isCurrentPage("/tours/bookings/create")
              ? "border-ev-green ring-2 ring-ev-green bg-blue-50 dark:bg-blue-900/20"
              : "border-slate-200 dark:border-slate-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              }`}
          >
            <div className="text-2xl mb-2">📋</div>
            <div className="text-sm font-medium text-slate-900 dark:text-white">View Bookings</div>
          </Link>
          <Link
            to="/tours/create"
            className={`p-4 rounded-lg border transition-colors text-center ${isCurrentPage("/tours/create")
              ? "border-ev-green ring-2 ring-ev-green bg-orange-50 dark:bg-orange-900/20"
              : "border-slate-200 dark:border-slate-600 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20"
              }`}
          >
            <div className="text-2xl mb-2">➕</div>
            <div className="text-sm font-medium text-slate-900 dark:text-white">Create Tour</div>
          </Link>
          <Link
            to="/tours/bookings/create"
            className={`p-4 rounded-lg border transition-colors text-center ${isCurrentPage("/tours/bookings/create")
              ? "border-ev-green ring-2 ring-ev-green bg-purple-50 dark:bg-purple-900/20"
              : "border-slate-200 dark:border-slate-600 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              }`}
          >
            <div className="text-2xl mb-2">📝</div>
            <div className="text-sm font-medium text-slate-900 dark:text-white">New Booking</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
