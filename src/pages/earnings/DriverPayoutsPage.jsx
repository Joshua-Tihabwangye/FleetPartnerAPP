import React, { useState } from "react";

export default function DriverPayoutsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Summary stats
  const summaryStats = [
    { label: "Total pending", value: "UGX 12.4M", count: "23 drivers", color: "blue" },
    { label: "Paid this month", value: "UGX 28.5M", count: "94 payouts", color: "green" },
    { label: "This week", value: "UGX 6.2M", count: "42 payouts", color: "purple" },
    { label: "Average payout", value: "UGX 310K", count: "per driver", color: "emerald" }
  ];

  // Mock payout data
  const payouts = [
    { id: "DRV-001", name: "John Mugisha", amount: "UGX 425,000", status: "pending", date: "2025-11-30", trips: 38 },
    { id: "DRV-002", name: "Sarah Nakato", amount: "UGX 380,000", status: "completed", date: "2025-11-29", trips: 32 },
    { id: "DRV-003", name: "Peter Okello", amount: "UGX 510,000", status: "pending", date: "2025-11-30", trips: 45 },
    { id: "DRV-004", name: "Grace Nambi", amount: "UGX 295,000", status: "completed", date: "2025-11-28", trips: 28 },
    { id: "DRV-005", name: "David Ssali", amount: "UGX 445,000", status: "pending", date: "2025-11-30", trips: 40 },
    { id: "DRV-006", name: "Mary Achieng", amount: "UGX 360,000", status: "completed", date: "2025-11-27", trips: 35 },
    { id: "DRV-007", name: "James Kamau", amount: "UGX 520,000", status: "pending", date: "2025-11-30", trips: 48 },
    { id: "DRV-008", name: "Betty Namutebi", amount: "UGX 315,000", status: "processing", date: "2025-11-29", trips: 30 }
  ];

  // Filter payouts
  const filteredPayouts = payouts.filter(payout => {
    const matchesSearch = payout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payout.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || payout.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "processing": return "bg-blue-100 text-blue-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] px-4 sm:px-6 lg:px-10 py-6 bg-slate-50">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">Driver payouts</h1>
        <p className="text-sm text-slate-600">Manage driver payouts and settlements</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryStats.map((stat, idx) => (
          <div
            key={idx}
            className={`card-gradient-${stat.color} rounded-xl border border-slate-200 p-4 shadow-card hover:shadow-card-hover card-hover-lift`}
          >
            <div className="text-xs text-slate-500 mb-1">{stat.label}</div>
            <div className="text-2xl font-semibold text-slate-900">{stat.value}</div>
            <div className="text-xs text-slate-600 mt-1">{stat.count}</div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-cream rounded-xl border border-slate-200 p-4 shadow-card mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by driver name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Action Button */}
          <button className="px-6 py-2 bg-ev-green hover:bg-ev-green-dark text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-md">
            Process Payouts
          </button>
        </div>
      </div>

      {/* Payouts Table */}
      <div className="bg-cream rounded-xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Driver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Trips
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-cream divide-y divide-slate-200">
              {filteredPayouts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-sm text-slate-500">
                    No payouts found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredPayouts.map((payout) => (
                  <tr key={payout.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-ev-green to-emerald-600 flex items-center justify-center text-white font-semibold text-sm">
                          {payout.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-slate-900">{payout.name}</div>
                          <div className="text-xs text-slate-500">{payout.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{payout.trips}</div>
                      <div className="text-xs text-slate-500">trips</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-slate-900">{payout.amount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {payout.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusColor(payout.status)}`}>
                        {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-ev-green hover:text-ev-green-dark transition-colors">
                          View
                        </button>
                        {payout.status === "pending" && (
                          <button className="px-3 py-1 bg-ev-green hover:bg-ev-green-dark text-white text-xs font-medium rounded transition-colors">
                            Pay Now
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {filteredPayouts.length > 0 && (
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Showing <span className="font-medium">{filteredPayouts.length}</span> of{" "}
              <span className="font-medium">{payouts.length}</span> payouts
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-white transition-colors">
                Previous
              </button>
              <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-white transition-colors">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
