import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BarChart, PieChart, Sparkline, LineChart, ProgressRing } from "../../../components/ui/Charts";

export default function RentalsDashboardPage() {
  const [dateRange, setDateRange] = useState<"today" | "week" | "month">("today");

  // Key Metrics
  const keyMetrics = [
    { 
      label: "Active Rentals", 
      value: "12", 
      change: "+3", 
      color: "emerald", 
      sparkline: [8, 9, 10, 11, 12, 12, 12],
      icon: "🚗"
    },
    { 
      label: "Total Bookings", 
      value: "142", 
      change: "+18", 
      color: "blue", 
      sparkline: [120, 125, 130, 135, 138, 140, 142],
      icon: "📋"
    },
    { 
      label: "Revenue", 
      value: "UGX 24.5M", 
      change: "+15%", 
      color: "purple", 
      sparkline: [18, 19, 20, 21, 22, 23, 24],
      icon: "💰"
    },
    { 
      label: "Utilization Rate", 
      value: "78%", 
      change: "+5%", 
      color: "orange", 
      sparkline: [70, 72, 74, 75, 76, 77, 78],
      icon: "📊"
    }
  ];

  // Revenue data
  const revenueData: Record<"today" | "week" | "month", { value: string; change: string }> = {
    today: { value: "UGX 2.8M", change: "+12%" },
    week: { value: "UGX 18.5M", change: "+8%" },
    month: { value: "UGX 72.4M", change: "+15%" }
  };

  // Vehicle utilization
  const vehicleUtilization = [
    { label: "Premium", value: 85, color: "#10b981" },
    { label: "Standard", value: 78, color: "#3b82f6" },
    { label: "Economy", value: 72, color: "#f59e0b" },
    { label: "Luxury", value: 65, color: "#8b5cf6" }
  ];

  // Booking status breakdown
  const bookingStatus = [
    { label: "Active", value: 12, color: "#10b981" },
    { label: "Upcoming", value: 8, color: "#3b82f6" },
    { label: "Completed", value: 118, color: "#6b7280" },
    { label: "Cancelled", value: 4, color: "#ef4444" }
  ];

  // Weekly bookings trend
  const weeklyBookings = [
    { label: "Mon", value: 18 },
    { label: "Tue", value: 22 },
    { label: "Wed", value: 20 },
    { label: "Thu", value: 25 },
    { label: "Fri", value: 28 },
    { label: "Sat", value: 15 },
    { label: "Sun", value: 12 }
  ];

  // Revenue trend
  const revenueTrendData = [2.1, 2.3, 2.2, 2.5, 2.4, 2.6, 2.7, 2.8, 2.9, 2.8, 3.0, 3.2];
  const revenueTrendLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Popular vehicles
  const popularVehicles = [
    { name: "Tesla Model 3", bookings: 45, revenue: "UGX 11.2M" },
    { name: "Nissan Leaf", bookings: 38, revenue: "UGX 9.5M" },
    { name: "BYD E6", bookings: 32, revenue: "UGX 8.1M" },
    { name: "Toyota Prius", bookings: 27, revenue: "UGX 6.8M" }
  ];

  // Recent bookings
  const recentBookings = [
    { id: "RNT-001", customer: "John Customer", vehicle: "Tesla Model 3", status: "active", date: "2024-01-15" },
    { id: "RNT-002", customer: "Jane Client", vehicle: "Nissan Leaf", status: "upcoming", date: "2024-01-18" },
    { id: "RNT-003", customer: "Mike User", vehicle: "BYD E6", status: "completed", date: "2024-01-14" }
  ];

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      {/* Header */}
      <div className="mb-6 pb-6 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 mb-1">
              Car Rentals Dashboard
            </h1>
            <p className="text-sm text-slate-600">
              Monitor and manage car rental operations and performance
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to="/rentals/bookings"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-ev-green transition"
            >
              📋 View Bookings
            </Link>
            <Link
              to="/rentals/catalog"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-ev-green to-emerald-600 text-white text-sm font-medium shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition"
            >
              🚗 Browse Catalog
            </Link>
          </div>
        </div>
        <div className="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-80" />
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
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-indigo-100 mb-1">Total Revenue</div>
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
            <span className="text-sm text-indigo-100">↑ {revenueData[dateRange].change}</span>
            <span className="text-xs text-indigo-200">vs last period</span>
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
            color="#8b5cf6"
            showArea={true}
          />
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-600">Average: UGX 2.6M</span>
            <span className="text-purple-600 font-medium">↑ +12% this month</span>
          </div>
        </div>

        {/* Weekly Bookings */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Weekly Bookings</h3>
          <BarChart data={weeklyBookings} height={150} showValues={true} />
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-600">Total: 140 bookings</span>
            <span className="text-emerald-600 font-medium">↑ +8% vs last week</span>
          </div>
        </div>
      </div>

      {/* Status Breakdown & Vehicle Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Booking Status */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Booking Status</h3>
          <PieChart data={bookingStatus} size={180} donut={true} showLabels={true} />
        </div>

        {/* Vehicle Utilization */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Vehicle Utilization by Category</h3>
          <div className="space-y-4">
            {vehicleUtilization.map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-900">{item.label}</span>
                  <span className="text-sm font-semibold text-slate-900">{item.value}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="rounded-full h-2 transition-all"
                    style={{ width: `${item.value}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Vehicles & Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Popular Vehicles */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Popular Vehicles</h3>
          <div className="space-y-3">
            {popularVehicles.map((vehicle, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{vehicle.name}</p>
                  <p className="text-xs text-slate-600">{vehicle.bookings} bookings</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">{vehicle.revenue}</p>
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
              to="/rentals/bookings"
              className="text-sm text-ev-green hover:text-ev-green-dark font-medium"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {recentBookings.map((booking) => (
              <Link
                key={booking.id}
                to={`/rentals/${booking.id}`}
                className="block p-3 rounded-lg border border-slate-200 hover:border-ev-green hover:bg-emerald-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{booking.id}</p>
                    <p className="text-xs text-slate-600">{booking.customer} • {booking.vehicle}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      booking.status === "active"
                        ? "bg-emerald-100 text-emerald-700"
                        : booking.status === "upcoming"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {booking.status}
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
            to="/rentals"
            className="p-4 rounded-lg border border-slate-200 hover:border-ev-green hover:bg-emerald-50 transition-colors text-center"
          >
            <div className="text-2xl mb-2">📋</div>
            <div className="text-sm font-medium text-slate-900">View Bookings</div>
          </Link>
          <Link
            to="/rentals/catalog"
            className="p-4 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
          >
            <div className="text-2xl mb-2">🚗</div>
            <div className="text-sm font-medium text-slate-900">Browse Catalog</div>
          </Link>
          <Link
            to="/settings/rentals"
            className="p-4 rounded-lg border border-slate-200 hover:border-purple-500 hover:bg-purple-50 transition-colors text-center"
          >
            <div className="text-2xl mb-2">⚙️</div>
            <div className="text-sm font-medium text-slate-900">Pricing Settings</div>
          </Link>
          <Link
            to="/vehicles"
            className="p-4 rounded-lg border border-slate-200 hover:border-orange-500 hover:bg-orange-50 transition-colors text-center"
          >
            <div className="text-2xl mb-2">🚙</div>
            <div className="text-sm font-medium text-slate-900">Manage Vehicles</div>
          </Link>
        </div>
      </div>
    </div>
  );
}

