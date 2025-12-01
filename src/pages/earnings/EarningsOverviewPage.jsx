import React from "react";
import { Link } from "react-router-dom";

export default function EarningsOverviewPage() {
  const stats = [
    { label: "Total revenue", value: "UGX 45.2M", change: "+12%", color: "emerald" },
    { label: "Driver payouts", value: "UGX 28.5M", change: "+8%", color: "blue" },
    { label: "Net profit", value: "UGX 16.7M", change: "+18%", color: "green" },
    { label: "This month", value: "UGX 12.4M", change: "+15%", color: "purple" }
  ];

  return (
    <div className="min-h-[calc(100vh-56px)] px-4 sm:px-6 lg:px-10 py-6 bg-slate-50">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">Earnings overview</h1>
        <p className="text-sm text-slate-600">Financial performance and revenue metrics</p>
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
