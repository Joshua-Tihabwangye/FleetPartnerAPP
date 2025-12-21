import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toastManager } from "../../utils/toastManager";

export default function EarningsStatementsPage() {
  const navigate = useNavigate();
  const statements = [
    { id: 1, period: "January 2024", revenue: 12500000, payouts: 7800000, net: 4700000, status: "paid" },
    { id: 2, period: "December 2023", revenue: 11800000, payouts: 7200000, net: 4600000, status: "paid" },
    { id: 3, period: "November 2023", revenue: 11200000, payouts: 6800000, net: 4400000, status: "paid" }
  ];

  const handleDownloadPDF = (statementId: number) => {
    toastManager.show("Generating PDF...", "info");
    // In real app, this would trigger PDF generation
    setTimeout(() => {
      toastManager.show("PDF downloaded successfully!", "success");
    }, 1000);
  };

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      <div className="w-full">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/earnings"
            className="text-sm text-slate-600 hover:text-slate-900 mb-2 inline-block"
          >
            ← Back to earnings
          </Link>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Earnings statements</h1>
          <p className="text-sm text-slate-600">View detailed monthly earnings statements</p>
        </div>

        {/* Statements List */}
        <div className="space-y-4">
          {statements.map((statement) => (
            <div
              key={statement.id}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">{statement.period}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span>Revenue: UGX {statement.revenue.toLocaleString()}</span>
                    <span>Payouts: UGX {statement.payouts.toLocaleString()}</span>
                    <span className="font-semibold text-slate-900">
                      Net: UGX {statement.net.toLocaleString()}
                    </span>
                  </div>
                </div>
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-emerald-100 text-emerald-700">
                  {statement.status}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/earnings/statements/${statement.id}`)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  View details
                </button>
                <button
                  onClick={() => handleDownloadPDF(statement.id)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Download PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
