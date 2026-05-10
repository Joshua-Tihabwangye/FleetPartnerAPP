import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Modal from "../../components/ui/Modal";

interface Driver {
  id: number;
  name: string;
  phone: string;
  status: "available" | "on-trip" | "offline" | "suspended";
  trips: number;
  rating: number;
  cancelRate: number;
  lastSeen: string;
  zone: string;
  vehicle: string;
  docsStatus: "ok" | "expiring" | "missing";
}

export default function DriversListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filter, setFilter] = useState({ status: "all", minRating: "0" });
  const [allDrivers, setAllDrivers] = useState<Driver[]>([]);
  const [activeKpi, setActiveKpi] = useState<string | null>(null);
  const [showActionsMenu, setShowActionsMenu] = useState<number | null>(null);

  // Load drivers from localStorage on mount
  useEffect(() => {
    const mockDrivers: Driver[] = [
      { id: 1, name: "John Doe", phone: "+256 700 000 001", status: "available", trips: 142, rating: 4.8, cancelRate: 2, lastSeen: "2m ago", zone: "Kampala Central", vehicle: "UAA 123A", docsStatus: "ok" },
      { id: 2, name: "Jane Smith", phone: "+256 700 000 002", status: "on-trip", trips: 98, rating: 4.9, cancelRate: 1, lastSeen: "now", zone: "Kololo", vehicle: "UAA 124B", docsStatus: "ok" },
      { id: 3, name: "Mike Johnson", phone: "+256 700 000 003", status: "offline", trips: 203, rating: 4.7, cancelRate: 3, lastSeen: "4h ago", zone: "Ntinda", vehicle: "UAA 125C", docsStatus: "expiring" },
      { id: 4, name: "Sarah Wilson", phone: "+256 700 000 004", status: "available", trips: 87, rating: 4.6, cancelRate: 5, lastSeen: "5m ago", zone: "Nakasero", vehicle: "UAA 126D", docsStatus: "ok" },
      { id: 5, name: "David Brown", phone: "+256 700 000 005", status: "on-trip", trips: 156, rating: 4.5, cancelRate: 8, lastSeen: "now", zone: "Bugolobi", vehicle: "UAA 127E", docsStatus: "ok" },
      { id: 6, name: "Emily Davis", phone: "+256 700 000 006", status: "suspended", trips: 45, rating: 3.8, cancelRate: 15, lastSeen: "2d ago", zone: "Muyenga", vehicle: "-", docsStatus: "missing" },
      { id: 7, name: "Peter Okello", phone: "+256 700 000 007", status: "available", trips: 312, rating: 4.9, cancelRate: 1, lastSeen: "1m ago", zone: "Kisaasi", vehicle: "UAA 129G", docsStatus: "ok" },
      { id: 8, name: "Grace Nakato", phone: "+256 700 000 008", status: "offline", trips: 67, rating: 4.4, cancelRate: 6, lastSeen: "8h ago", zone: "Naalya", vehicle: "UAA 130H", docsStatus: "expiring" },
    ];

    const storedDrivers = JSON.parse(localStorage.getItem("drivers") || "[]");
    setAllDrivers(storedDrivers.length > 0 ? storedDrivers : mockDrivers);
  }, []);

  // KPI calculations
  const kpis = [
    { id: "available", label: "Available", value: allDrivers.filter(d => d.status === "available").length, color: "bg-emerald-100 text-emerald-700" },
    { id: "on-trip", label: "On trip", value: allDrivers.filter(d => d.status === "on-trip").length, color: "bg-blue-100 text-blue-700" },
    { id: "offline", label: "Offline", value: allDrivers.filter(d => d.status === "offline").length, color: "bg-slate-100 text-slate-700" },
    { id: "suspended", label: "Suspended", value: allDrivers.filter(d => d.status === "suspended").length, color: "bg-red-100 text-red-700" },
    { id: "expiring", label: "Docs expiring", value: allDrivers.filter(d => d.docsStatus === "expiring").length, color: "bg-amber-100 text-amber-700" },
    { id: "missing", label: "Docs missing", value: allDrivers.filter(d => d.docsStatus === "missing").length, color: "bg-orange-100 text-orange-700" },
    { id: "lowrating", label: "Low rating", value: allDrivers.filter(d => d.rating < 4.0).length, color: "bg-purple-100 text-purple-700" },
  ];

  // Filter drivers based on KPI and search
  const drivers = allDrivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.phone.includes(searchQuery);
    const matchesStatus = filter.status === "all" || driver.status === filter.status;
    const matchesRating = driver.rating >= parseFloat(filter.minRating);

    let matchesKpi = true;
    if (activeKpi) {
      switch (activeKpi) {
        case "available": matchesKpi = driver.status === "available"; break;
        case "on-trip": matchesKpi = driver.status === "on-trip"; break;
        case "offline": matchesKpi = driver.status === "offline"; break;
        case "suspended": matchesKpi = driver.status === "suspended"; break;
        case "expiring": matchesKpi = driver.docsStatus === "expiring"; break;
        case "missing": matchesKpi = driver.docsStatus === "missing"; break;
        case "lowrating": matchesKpi = driver.rating < 4.0; break;
      }
    }

    return matchesSearch && matchesStatus && matchesRating && matchesKpi;
  });

  const handleExport = () => {
    const csvContent = [
      ["Name", "Phone", "Status", "Trips", "Rating", "Cancel %", "Zone", "Vehicle", "Docs"],
      ...drivers.map(d => [d.name, d.phone, d.status, d.trips, d.rating, d.cancelRate, d.zone, d.vehicle, d.docsStatus])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `drivers_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const statusStyles: Record<string, string> = {
    available: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    "on-trip": "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
    offline: "bg-slate-100 text-slate-600 dark:bg-slate-700/50 dark:text-slate-400",
    suspended: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  };

  const docsStyles: Record<string, string> = {
    ok: "text-emerald-600",
    expiring: "text-amber-600",
    missing: "text-red-600",
  };

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50 dark:bg-slate-900">
      {/* Enhanced Header */}
      <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Link to="/dashboard" className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
              Fleet Drivers
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Manage your fleet drivers and their profiles</p>
          </div>
          <Link
            to="/drivers/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-ev-green text-white text-sm font-medium shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition"
          >
            + Add Driver
          </Link>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="mb-6 flex flex-wrap gap-2">
        {kpis.map((kpi) => (
          <button
            key={kpi.id}
            onClick={() => setActiveKpi(activeKpi === kpi.id ? null : kpi.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeKpi === kpi.id
                ? "ring-2 ring-ev-green ring-offset-1"
                : ""
              } ${kpi.color}`}
          >
            <span className="font-bold">{kpi.value}</span>
            <span className="ml-1">{kpi.label}</span>
          </button>
        ))}
        {activeKpi && (
          <button
            onClick={() => setActiveKpi(null)}
            className="px-2 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100"
          >
            ✕
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search drivers by name or phone..."
            className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
          />
        </div>
        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => setShowFilterModal(true)}
            className="flex-1 sm:flex-none px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Filter
          </button>
          <button
            onClick={handleExport}
            className="flex-1 sm:flex-none px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Export
          </button>
        </div>
      </div>

      {/* Drivers Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Driver</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Last seen</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Zone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Trips</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Rating</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Cancel %</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Docs</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {drivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-medium text-emerald-700">
                        {driver.name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-slate-900">{driver.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">{driver.phone}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[driver.status]}`}>
                      {driver.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-500">{driver.lastSeen}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">{driver.zone}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">{driver.vehicle}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">{driver.trips}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`text-sm font-medium ${driver.rating < 4.0 ? 'text-red-600' : 'text-slate-900'}`}>{driver.rating}</span>
                      <span className="ml-1 text-yellow-400">⭐</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`text-sm font-medium ${driver.cancelRate > 10 ? 'text-red-600' : driver.cancelRate > 5 ? 'text-amber-600' : 'text-slate-600'}`}>
                      {driver.cancelRate}%
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`text-xs font-medium ${docsStyles[driver.docsStatus]}`}>
                      {driver.docsStatus === "ok" ? "✓ OK" : driver.docsStatus === "expiring" ? "⚠ Expiring" : "✕ Missing"}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Call"
                      >
                        📞
                      </button>
                      <button
                        className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                        title="Message"
                      >
                        💬
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setShowActionsMenu(showActionsMenu === driver.id ? null : driver.id)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-ev-green hover:bg-emerald-50 transition-colors"
                        >
                          View ▾
                        </button>
                        {showActionsMenu === driver.id && (
                          <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1">
                            <Link
                              to={`/drivers/${driver.id}`}
                              className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            >
                              👤 View Profile
                            </Link>
                            <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                              🔄 Set Availability
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                              📄 Request Documents
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                              📋 View Trip History
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-slate-100">
                              🚫 Suspend Driver
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Filter Modal */}
      <Modal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        title="Filter Drivers"
        size="sm"
      >
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700 mb-1 block">Status</span>
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
            >
              <option value="all">All statuses</option>
              <option value="available">Available</option>
              <option value="on-trip">On trip</option>
              <option value="offline">Offline</option>
              <option value="suspended">Suspended</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700 mb-1 block">Minimum Rating</span>
            <select
              value={filter.minRating}
              onChange={(e) => setFilter({ ...filter, minRating: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
            >
              <option value="0">Any rating</option>
              <option value="3.0">3.0+</option>
              <option value="4.0">4.0+</option>
              <option value="4.5">4.5+</option>
            </select>
          </label>
          <div className="flex gap-2 pt-4">
            <button
              onClick={() => {
                setFilter({ status: "all", minRating: "0" });
                setShowFilterModal(false);
              }}
              className="flex-1 px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Reset
            </button>
            <button
              onClick={() => setShowFilterModal(false)}
              className="flex-1 px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark"
            >
              Apply
            </button>
          </div>
        </div>
      </Modal>

      {/* Click outside to close actions menu */}
      {showActionsMenu && (
        <div className="fixed inset-0 z-10" onClick={() => setShowActionsMenu(null)} />
      )}
    </div>
  );
}
