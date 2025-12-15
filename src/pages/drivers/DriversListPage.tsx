import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Modal from "../../components/ui/Modal";

interface Driver {
  id: number;
  name: string;
  phone: string;
  status: string;
  trips: number;
  rating: number;
}

export default function DriversListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filter, setFilter] = useState({ status: "all", minRating: "0" });
  const [allDrivers, setAllDrivers] = useState<Driver[]>([]);

  // Load drivers from localStorage on mount
  useEffect(() => {
    const mockDrivers: Driver[] = [
      { id: 1, name: "John Doe", phone: "+256 700 000 001", status: "active", trips: 142, rating: 4.8 },
      { id: 2, name: "Jane Smith", phone: "+256 700 000 002", status: "active", trips: 98, rating: 4.9 },
      { id: 3, name: "Mike Johnson", phone: "+256 700 000 003", status: "offline", trips: 203, rating: 4.7 }
    ];

    const storedDrivers = JSON.parse(localStorage.getItem("drivers") || "[]");
    setAllDrivers([...mockDrivers, ...storedDrivers]);
  }, []);

  // Filter drivers
  const drivers = allDrivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.phone.includes(searchQuery);
    const matchesStatus = filter.status === "all" || driver.status === filter.status;
    const matchesRating = driver.rating >= parseFloat(filter.minRating);
    return matchesSearch && matchesStatus && matchesRating;
  });

  const handleExport = () => {
    const csvContent = [
      ["Name", "Phone", "Status", "Trips", "Rating"],
      ...drivers.map(d => [d.name, d.phone, d.status, d.trips, d.rating])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `drivers_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
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
        <div className="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-ev-green via-emerald-400 to-orange-400 opacity-80" />
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
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilterModal(true)}
            className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Filter
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
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
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Driver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Trips
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {drivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-medium text-emerald-700">
                        {driver.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">{driver.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {driver.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${driver.status === "active"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-700/50 dark:text-slate-400"
                        }`}
                    >
                      {driver.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {driver.trips}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-slate-900">{driver.rating}</span>
                      <span className="ml-1 text-yellow-400">⭐</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/drivers/${driver.id}`}
                      className="text-ev-green hover:text-ev-green-dark"
                    >
                      View
                    </Link>
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
              <option value="active">Active</option>
              <option value="offline">Offline</option>
              <option value="inactive">Inactive</option>
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
    </div>
  );
}
