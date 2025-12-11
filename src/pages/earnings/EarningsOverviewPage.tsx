import React, { useState } from "react";
import { Link } from "react-router-dom";

// Sample revenue data by date
const REVENUE_DATA = {
  "2025-12-01": { revenue: 8200000, payouts: 5100000, profit: 3100000 },
  "2025-12-02": { revenue: 9500000, payouts: 5900000, profit: 3600000 },
  "2025-12-03": { revenue: 7800000, payouts: 4800000, profit: 3000000 },
  "2025-12-04": { revenue: 10200000, payouts: 6400000, profit: 3800000 },
  "2025-12-05": { revenue: 9500000, payouts: 6300000, profit: 3200000 },
};

// Helper to format UGX
const formatUGX = (amount) => {
  if (amount >= 1000000) {
    return `UGX ${(amount / 1000000).toFixed(1)}M`;
  }
  return `UGX ${(amount / 1000).toFixed(0)}K`;
};

// Get date string in YYYY-MM-DD format
const formatDateForInput = (date) => {
  return date.toISOString().split('T')[0];
};

export default function EarningsOverviewPage() {
  // Default to last 7 days
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [startDate, setStartDate] = useState(formatDateForInput(weekAgo));
  const [endDate, setEndDate] = useState(formatDateForInput(today));

  // Calculate totals based on date range
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

    // If no data in range, use sample totals
    if (totalRevenue === 0) {
      totalRevenue = 45200000;
      totalPayouts = 28500000;
      totalProfit = 16700000;
    }

    return { totalRevenue, totalPayouts, totalProfit };
  };

  const { totalRevenue, totalPayouts, totalProfit } = calculateTotals();

  const stats = [
    { label: "Total revenue", value: formatUGX(totalRevenue), change: "+12%", color: "emerald" },
    { label: "Driver payouts", value: formatUGX(totalPayouts), change: "+8%", color: "blue" },
    { label: "Net profit", value: formatUGX(totalProfit), change: "+18%", color: "green" },
    { label: "This month", value: "UGX 12.4M", change: "+15%", color: "purple" }
  ];

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">Earnings overview</h1>
        <p className="text-sm text-slate-600">Financial performance and revenue metrics</p>
      </div>

      {/* Date Range Picker */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700">📅 Date Range:</span>
          </div>
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
                const today = new Date();
                const weekAgo = new Date(today);
                weekAgo.setDate(weekAgo.getDate() - 7);
                setStartDate(formatDateForInput(weekAgo));
                setEndDate(formatDateForInput(today));
              }}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 hover:bg-slate-50 transition"
            >
              Last 7 days
            </button>
            <button
              onClick={() => {
                const today = new Date();
                const monthAgo = new Date(today);
                monthAgo.setDate(monthAgo.getDate() - 30);
                setStartDate(formatDateForInput(monthAgo));
                setEndDate(formatDateForInput(today));
              }}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 hover:bg-slate-50 transition"
            >
              Last 30 days
            </button>
            <button
              onClick={() => {
                const today = new Date();
                const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
                setStartDate(formatDateForInput(firstDay));
                setEndDate(formatDateForInput(today));
              }}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-ev-green text-white hover:bg-ev-green-dark transition"
            >
              This month
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`card-gradient-${stat.color} rounded-xl border border-slate-200 p-4 shadow-card hover:shadow-card-hover card-hover-lift`}
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
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/earnings/statements"
          className="bg-cream rounded-xl border border-slate-200 p-6 shadow-card hover:border-ev-green hover:shadow-card-hover card-hover-lift"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-slate-900">Statements</h2>
            <span className="text-2xl">📄</span>
          </div>
          <p className="text-sm text-slate-600">View detailed earnings statements</p>
        </Link>
        <Link
          to="/earnings/payouts"
          className="bg-cream rounded-xl border border-slate-200 p-6 shadow-card hover:border-ev-green hover:shadow-card-hover card-hover-lift"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-slate-900">Driver payouts</h2>
            <span className="text-2xl">💰</span>
          </div>
          <p className="text-sm text-slate-600">Manage driver payouts and settlements</p>
        </Link>
      </div>
    </div>
  );
}
