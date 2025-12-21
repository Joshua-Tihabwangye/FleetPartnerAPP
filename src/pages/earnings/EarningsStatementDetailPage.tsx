import React from "react";
import { Link, useParams } from "react-router-dom";
import { toastManager } from "../../utils/toastManager";

export default function EarningsStatementDetailPage() {
  const { statementId } = useParams();
  
  // Mock data - in real app, fetch based on statementId
  const statement = {
    id: statementId ? parseInt(statementId) : 1,
    period: "January 2024",
    revenue: 12500000,
    totalPayouts: 7800000,
    net: 4700000,
    status: "paid",
    breakdown: [
      { category: "Rides", amount: 8500000, count: 1250 },
      { category: "Deliveries", amount: 3200000, count: 450 },
      { category: "Rentals", amount: 800000, count: 25 },
    ],
    driverPayouts: [
      { driver: "John Mukasa", amount: 1200000, trips: 85 },
      { driver: "Sarah Namatovu", amount: 980000, trips: 72 },
      { driver: "Peter Ochieng", amount: 850000, trips: 65 },
      { driver: "David Okello", amount: 1100000, trips: 80 },
      { driver: "Grace Nambi", amount: 950000, trips: 70 },
      { driver: "James Kato", amount: 1020000, trips: 75 },
      { driver: "Mary Nakato", amount: 880000, trips: 68 },
      { driver: "Robert Ssemwogerere", amount: 920000, trips: 71 },
    ],
    fees: [
      { type: "Platform Fee", amount: 1250000 },
      { type: "Transaction Fees", amount: 375000 },
    ],
    date: "2024-01-31",
    paidDate: "2024-02-05"
  };

  const handleDownloadPDF = () => {
    toastManager.show("Generating PDF...", "info");
    // In real app, this would trigger PDF generation
    setTimeout(() => {
      toastManager.show("PDF downloaded successfully!", "success");
    }, 1000);
  };

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/earnings/statements"
            className="text-sm text-slate-600 hover:text-slate-900 mb-2 inline-block"
          >
            ← Back to statements
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 mb-2">
                Earnings Statement - {statement.period}
              </h1>
              <p className="text-sm text-slate-600">Detailed breakdown of earnings and payouts</p>
            </div>
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark"
            >
              Download PDF
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="text-sm text-slate-600 mb-1">Total Revenue</div>
            <div className="text-2xl font-bold text-slate-900">
              UGX {statement.revenue.toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="text-sm text-slate-600 mb-1">Total Payouts</div>
            <div className="text-2xl font-bold text-slate-900">
              UGX {statement.totalPayouts.toLocaleString()}
            </div>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
            <div className="text-sm text-emerald-700 mb-1">Net Earnings</div>
            <div className="text-2xl font-bold text-emerald-700">
              UGX {statement.net.toLocaleString()}
            </div>
            <div className="mt-2">
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">
                {statement.status}
              </span>
            </div>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Revenue Breakdown</h2>
          <div className="space-y-3">
            {statement.breakdown.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div>
                  <div className="font-medium text-slate-900">{item.category}</div>
                  <div className="text-sm text-slate-500">{item.count} transactions</div>
                </div>
                <div className="text-lg font-semibold text-slate-900">
                  UGX {item.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Driver Payouts */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Driver Payouts</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Driver</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Trips</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {statement.driverPayouts.map((payout, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{payout.driver}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{payout.trips}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900 text-right">
                      UGX {payout.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 border-t-2 border-slate-300">
                <tr>
                  <td colSpan={2} className="px-4 py-3 text-sm font-semibold text-slate-900">
                    Total Payouts
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-slate-900 text-right">
                    UGX {statement.driverPayouts.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Fees & Charges */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Fees & Charges</h2>
          <div className="space-y-3">
            {statement.fees.map((fee, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div className="text-slate-700">{fee.type}</div>
                <div className="text-lg font-semibold text-slate-900">
                  UGX {fee.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statement Info */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Statement Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-slate-600 mb-1">Statement Period</div>
              <div className="font-medium text-slate-900">{statement.period}</div>
            </div>
            <div>
              <div className="text-slate-600 mb-1">Statement Date</div>
              <div className="font-medium text-slate-900">{statement.date}</div>
            </div>
            <div>
              <div className="text-slate-600 mb-1">Payment Status</div>
              <div>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">
                  {statement.status}
                </span>
              </div>
            </div>
            <div>
              <div className="text-slate-600 mb-1">Paid Date</div>
              <div className="font-medium text-slate-900">{statement.paidDate}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

