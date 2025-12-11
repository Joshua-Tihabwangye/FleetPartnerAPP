import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Modal from "../../components/ui/Modal";

export interface Vehicle {
  id: number;
  plate: string;
  model: string;
  status: string;
  driver: string;
  mileage: number;
  vehicleType: string;
}

export default function VehiclesListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filter, setFilter] = useState({ status: "all", type: "all" });
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([] as Vehicle[]);

  // Load vehicles from localStorage on mount
  useEffect(() => {
    const mockVehicles = [
      { id: 1, plate: "UAA 123A", model: "Tesla Model 3", status: "active", driver: "John Doe", mileage: 12500, vehicleType: "sedan" },
      { id: 2, plate: "UAA 124B", model: "Nissan Leaf", status: "maintenance", driver: "Jane Smith", mileage: 8900, vehicleType: "sedan" },
      { id: 3, plate: "UAA 125C", model: "BYD E6", status: "active", driver: "Mike Johnson", mileage: 15200, vehicleType: "suv" }
    ];

    const storedVehicles = JSON.parse(localStorage.getItem("vehicles") || "[]");
    setAllVehicles([...mockVehicles, ...storedVehicles]);
  }, []);

  // Filter vehicles
  const vehicles = allVehicles.filter(vehicle => {
    const matchesSearch = vehicle.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filter.status === "all" || vehicle.status === filter.status;
    const matchesType = filter.type === "all" || vehicle.vehicleType === filter.type;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleExport = () => {
    const csvContent = [
      ["Plate", "Model", "Status", "Driver", "Mileage"],
      ...vehicles.map(v => [v.plate, v.model, v.status, v.driver, v.mileage])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vehicles_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      {/* Enhanced Header */}
      <div className="mb-6 pb-6 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 mb-1">
              Fleet Vehicles
            </h1>
            <p className="text-sm text-slate-600">Manage your fleet vehicles and their status</p>
          </div>
          <Link
            to="/vehicles/create"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-ev-green to-emerald-600 text-white text-sm font-medium shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition"
          >
            + Add Vehicle
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
            placeholder="Search vehicles by plate, model..."
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

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((vehicle) => (
          <Link
            key={vehicle.id}
            to={`/vehicles/${vehicle.id}`}
            className="bg-white rounded-xl border border-slate-200 p-6 hover:border-ev-green hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-lg font-semibold text-slate-900 mb-1">{vehicle.plate}</div>
                <div className="text-sm text-slate-600">{vehicle.model}</div>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${vehicle.status === "active"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-orange-100 text-orange-700"
                  }`}
              >
                {vehicle.status}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Driver</span>
                <span className="font-medium text-slate-900">{vehicle.driver}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Mileage</span>
                <span className="font-medium text-slate-900">{vehicle.mileage.toLocaleString()} km</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
              <Link
                to={`/vehicles/${vehicle.id}/maintenance`}
                className="flex-1 text-center px-3 py-1.5 rounded-lg bg-slate-50 text-xs font-medium text-slate-700 hover:bg-slate-100"
                onClick={(e) => e.stopPropagation()}
              >
                Maintenance
              </Link>
              <Link
                to={`/vehicles/${vehicle.id}/documents`}
                className="flex-1 text-center px-3 py-1.5 rounded-lg bg-slate-50 text-xs font-medium text-slate-700 hover:bg-slate-100"
                onClick={(e) => e.stopPropagation()}
              >
                Documents
              </Link>
            </div>
          </Link>
        ))}
      </div>

      {/* Filter Modal */}
      <Modal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        title="Filter Vehicles"
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
              <option value="maintenance">Maintenance</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700 mb-1 block">Vehicle Type</span>
            <select
              value={filter.type}
              onChange={(e) => setFilter({ ...filter, type: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
            >
              <option value="all">All types</option>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="van">Van</option>
              <option value="bus">Bus</option>
            </select>
          </label>
          <div className="flex gap-2 pt-4">
            <button
              onClick={() => {
                setFilter({ status: "all", type: "all" });
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
