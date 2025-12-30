import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LineChart, BarChart, PieChart, Sparkline, ProgressRing } from "../../components/ui/Charts";

// Sample revenue data by date
const REVENUE_DATA = {
  "2025-12-01": { revenue: 8200000, payouts: 5100000, profit: 3100000 },
  "2025-12-02": { revenue: 9500000, payouts: 5900000, profit: 3600000 },
  "2025-12-03": { revenue: 7800000, payouts: 4800000, profit: 3000000 },
  "2025-12-04": { revenue: 10200000, payouts: 6400000, profit: 3800000 },
  "2025-12-05": { revenue: 9500000, payouts: 6300000, profit: 3200000 },
};

// Helper to format UGX
const formatUGX = (amount: number) => {
  if (amount >= 1000000) {
    return `UGX ${(amount / 1000000).toFixed(1)}M`;
  }
  return `UGX ${(amount / 1000).toFixed(0)}K`;
};

// Get date string in YYYY-MM-DD format
const formatDateForInput = (date: Date) => {
  return date.toISOString().split('T')[0];
};

export default function EarningsOverviewPage() {
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [startDate, setStartDate] = useState(formatDateForInput(weekAgo));
  const [endDate, setEndDate] = useState(formatDateForInput(today));

  const calculateTotals = () => {
    let totalRevenue = 0;
    let totalPayouts = 0;
    let totalProfit = 0;

    Object.entries(REVENUE_DATA).forEach(([date, data]) => {
      if (date >= startDate && date <= endDate) {
        totalRevenue += data.revenue;
        totalPayouts += data.payouts;
        totalProfit += data.profit;
      }
    });

    if (totalRevenue === 0) {
      totalRevenue = 45200000;
      totalPayouts = 28500000;
      totalProfit = 16700000;
    }

    return { totalRevenue, totalPayouts, totalProfit };
  };

  const { totalRevenue, totalPayouts, totalProfit } = calculateTotals();

  // Chart data
  const monthlyRevenue = [28, 32, 35, 38, 42, 45, 48, 52, 49, 55, 58, 62];
  const monthlyLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const revenueBreakdown = [
    { label: "Rides", value: 42, color: "#10b981" },
    { label: "Delivery", value: 28, color: "#3b82f6" },
    { label: "Rentals", value: 18, color: "#f59e0b" },
    { label: "Other", value: 12, color: "#8b5cf6" },
  ];

  const weeklyData = [
    { label: "Mon", value: 14 },
    { label: "Tue", value: 12 },
    { label: "Wed", value: 16 },
    { label: "Thu", value: 15 },
    { label: "Fri", value: 19 },
    { label: "Sat", value: 22 },
    { label: "Sun", value: 18 },
  ];

  const stats = [
    { label: "Total revenue", value: formatUGX(totalRevenue), change: "+12%", color: "emerald", sparkline: [32, 35, 38, 42, 45, 48, 52] },
    { label: "Driver payouts", value: formatUGX(totalPayouts), change: "+8%", color: "blue", sparkline: [18, 21, 23, 26, 28, 30, 32] },
    { label: "Net profit", value: formatUGX(totalProfit), change: "+18%", color: "green", sparkline: [12, 14, 15, 16, 17, 18, 20] },
    { label: "This month", value: "UGX 12.4M", change: "+15%", color: "purple", sparkline: [8, 9, 10, 11, 12, 12, 12.4] }
  ];

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      {/* Header */}
      <div className="mb-6 pb-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 mb-1">
              Earnings Overview
            </h1>
            <p className="text-sm text-slate-600">Financial performance and revenue metrics</p>
          </div>
          <Link
            to="/earnings/statements"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-ev-green to-emerald-600 text-white text-sm font-medium shadow-lg shadow-emerald-500/20"
          >
            📊 View Statements
          </Link>
        </div>
        <div className="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-ev-green via-emerald-400 to-orange-400 opacity-80" />
      </div>

      {/* Date Range Picker */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm font-medium text-slate-700">📅 Date Range:</span>
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600">From:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-ev-green focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600">To:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-ev-green focus:outline-none"
            />
          </div>
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => {
                const t = new Date();
                const w = new Date(t);
                w.setDate(w.getDate() - 7);
                setStartDate(formatDateForInput(w));
                setEndDate(formatDateForInput(t));
              }}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 hover:bg-slate-50"
            >
              Last 7 days
            </button>
            <button
              onClick={() => {
                const t = new Date();
                const m = new Date(t);
                m.setDate(m.getDate() - 30);
                setStartDate(formatDateForInput(m));
                setEndDate(formatDateForInput(t));
              }}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 hover:bg-slate-50"
            >
              Last 30 days
            </button>
            <button
              onClick={() => {
                const t = new Date();
                const f = new Date(t.getFullYear(), t.getMonth(), 1);
                setStartDate(formatDateForInput(f));
                setEndDate(formatDateForInput(t));
              }}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-ev-green text-white"
            >
              This month
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid with Sparklines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, idx) => {
          const colors: Record<string, string> = { emerald: "#10b981", blue: "#3b82f6", green: "#22c55e", purple: "#8b5cf6" };
          const gradients: Record<string, string> = {
            emerald: "from-emerald-500 to-teal-600",
            blue: "from-blue-500 to-indigo-600",
            green: "from-green-500 to-emerald-600",
            purple: "from-purple-500 to-violet-600"
          };
          return (
            <div key={idx} className={`bg-gradient-to-br ${gradients[stat.color]} rounded-xl p-4 shadow-lg text-white`}>
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-white/80">{stat.label}</div>
                <div className="text-xs font-medium bg-white/20 px-1.5 py-0.5 rounded">{stat.change}</div>
              </div>
              <div className="text-2xl font-bold mb-2">{stat.value}</div>
              <Sparkline data={stat.sparkline} color="rgba(255,255,255,0.6)" height={32} />
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Revenue Trend</h3>
              <p className="text-xs text-slate-500">Monthly revenue (UGX Millions)</p>
            </div>
            <div className="flex items-center gap-2">
              <select className="text-xs border border-slate-200 rounded-lg px-2 py-1 text-slate-600 outline-none">
                <option>This Year</option>
                <option>Last Year</option>
              </select>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-medium">+18% YoY</span>
            </div>
          </div>
          <LineChart data={monthlyRevenue} labels={monthlyLabels} height={180} color="#10b981" showArea={true} />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Revenue Sources</h3>
            <p className="text-xs text-slate-500">Breakdown by service type</p>
          </div>
          <div className="flex justify-center">
            <PieChart data={revenueBreakdown} size={140} donut={true} showLabels={true} />
          </div>
        </div>
      </div>

      {/* Weekly Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">This Week's Revenue</h3>
              <p className="text-xs text-slate-500">Daily revenue (UGX Millions)</p>
            </div>
            <span className="text-lg font-bold text-slate-900">UGX 116M</span>
          </div>
          <BarChart data={weeklyData} height={150} showValues={true} />
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 shadow-lg text-white">
          <div className="mb-4">
            <h3 className="text-sm font-semibold">Payout Status</h3>
            <p className="text-xs text-slate-400">Driver payment completion</p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <ProgressRing percent={87} size={90} color="#10b981" textColor="#ffffff" bgColor="#475569" />
            <div className="text-center">
              <div className="text-xs text-slate-400">Total Processed</div>
              <div className="text-lg font-bold">UGX 28.5M</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/earnings/statements"
          className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-6 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition">Statements</h2>
            <span className="text-2xl group-hover:scale-110 transition-transform">📄</span>
          </div>
          <p className="text-sm text-slate-600">View detailed earnings statements</p>
        </Link>
        <Link
          to="/earnings/payouts"
          className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200 p-6 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-slate-900 group-hover:text-emerald-600 transition">Driver Payouts</h2>
            <span className="text-2xl group-hover:scale-110 transition-transform">💰</span>
          </div>
          <p className="text-sm text-slate-600">Manage driver payouts and settlements</p>
        </Link>
      </div>
    </div>
  );
}
