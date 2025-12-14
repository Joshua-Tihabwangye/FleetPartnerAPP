import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BarChart, PieChart, Sparkline, LineChart, ProgressRing } from "../../../components/ui/Charts";

export default function ToursDashboardPage() {
  const [dateRange, setDateRange] = useState<"today" | "week" | "month">("today");

  // Key Metrics
  const keyMetrics = [
    { 
      label: "Active Tours", 
      value: "8", 
      change: "+2", 
      color: "emerald", 
      sparkline: [5, 6, 6, 7, 7, 8, 8],
      icon: "🌍"
    },
    { 
      label: "Total Bookings", 
      value: "142", 
      change: "+24", 
      color: "blue", 
      sparkline: [110, 115, 120, 125, 130, 135, 142],
      icon: "📋"
    },
    { 
      label: "Revenue", 
      value: "UGX 18.5M", 
      change: "+18%", 
      color: "purple", 
      sparkline: [14, 15, 15.5, 16, 16.5, 17, 18.5],
      icon: "💰"
    },
    { 
      label: "Occupancy Rate", 
      value: "76%", 
      change: "+6%", 
      color: "orange", 
      sparkline: [68, 70, 72, 73, 74, 75, 76],
      icon: "👥"
    }
  ];

  // Revenue data
  const revenueData: Record<"today" | "week" | "month", { value: string; change: string }> = {
    today: { value: "UGX 2.1M", change: "+15%" },
    week: { value: "UGX 14.8M", change: "+12%" },
    month: { value: "UGX 58.2M", change: "+18%" }
  };

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

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      {/* Header */}
      <div className="mb-6 pb-6 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 mb-1">
              Tours & Charters Dashboard
            </h1>
            <p className="text-sm text-slate-600">
              Monitor and manage tour packages and charter services
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to="/tours/list"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-ev-green transition"
            >
              🌍 View Tours
            </Link>
            <Link
              to="/tours/create"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-ev-green to-emerald-600 text-white text-sm font-medium shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition"
            >
              + Create Tour
            </Link>
          </div>
        </div>
        <div className="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 opacity-80" />
      </div>

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
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-amber-100 mb-1">Total Revenue</div>
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
            <span className="text-sm text-amber-100">↑ {revenueData[dateRange].change}</span>
            <span className="text-xs text-amber-200">vs last period</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Trend */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Revenue Trend (Million UGX)</h3>
          <LineChart
            data={revenueTrendData}
            labels={revenueTrendLabels}
            height={150}
            color="#f59e0b"
            showArea={true}
          />
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-600">Average: UGX 1.7M</span>
            <span className="text-orange-600 font-medium">↑ +15% this month</span>
          </div>
        </div>

        {/* Weekly Bookings */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Weekly Bookings</h3>
          <BarChart data={weeklyBookings} height={150} showValues={true} />
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-600">Total: 140 bookings</span>
            <span className="text-emerald-600 font-medium">↑ +12% vs last week</span>
          </div>
        </div>
      </div>

      {/* Status Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Tour Status */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Tour Status</h3>
          <PieChart data={tourStatus} size={180} donut={true} showLabels={true} />
        </div>

        {/* Booking Status */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Booking Status</h3>
          <PieChart data={bookingStatus} size={180} donut={true} showLabels={true} />
        </div>
      </div>

      {/* Popular Tours & Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Popular Tours */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Popular Tours</h3>
          <div className="space-y-3">
            {popularTours.map((tour, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-slate-900">{tour.name}</p>
                  <span className="text-xs font-semibold text-slate-900">{tour.occupancy}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{tour.bookings} bookings</span>
                  <span className="font-semibold text-slate-900">{tour.revenue}</span>
                </div>
                <div className="mt-2 w-full bg-slate-200 rounded-full h-1.5">
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
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Recent Bookings</h3>
            <Link
              to="/tours/bookings"
              className="text-sm text-ev-green hover:text-ev-green-dark font-medium"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {recentBookings.map((booking) => (
              <Link
                key={booking.id}
                to={`/tours/bookings`}
                className="block p-3 rounded-lg border border-slate-200 hover:border-ev-green hover:bg-emerald-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{booking.id}</p>
                    <p className="text-xs text-slate-600">{booking.customer} • {booking.tour}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      booking.status === "confirmed"
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

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/tours"
            className="p-4 rounded-lg border border-slate-200 hover:border-ev-green hover:bg-emerald-50 transition-colors text-center"
          >
            <div className="text-2xl mb-2">🌍</div>
            <div className="text-sm font-medium text-slate-900">View Tours</div>
          </Link>
          <Link
            to="/tours/bookings"
            className="p-4 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
          >
            <div className="text-2xl mb-2">📋</div>
            <div className="text-sm font-medium text-slate-900">View Bookings</div>
          </Link>
          <Link
            to="/tours/create"
            className="p-4 rounded-lg border border-slate-200 hover:border-orange-500 hover:bg-orange-50 transition-colors text-center"
          >
            <div className="text-2xl mb-2">➕</div>
            <div className="text-sm font-medium text-slate-900">Create Tour</div>
          </Link>
          <Link
            to="/tours/bookings/create"
            className="p-4 rounded-lg border border-slate-200 hover:border-purple-500 hover:bg-purple-50 transition-colors text-center"
          >
            <div className="text-2xl mb-2">📝</div>
            <div className="text-sm font-medium text-slate-900">New Booking</div>
          </Link>
        </div>
      </div>
    </div>
  );
}

