import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Modal from "../../components/ui/Modal";
import { auth } from "../../utils/auth";
import { getCachedFleetVehicles, isFleetBackendEnabled, refreshFleetWorkspaceState } from "../../services/api/fleetApi";

export interface Vehicle {
  id: number;
  plate: string;
  model: string;
  status: "available" | "offline" | "maintenance" | "out-of-service";
  opsStatus: "ready" | "busy" | "unavailable";
  driver: string;
  mileage: number;
  vehicleType: string;
  // EV-first fields
  soc: number;
  estimatedRange: number;
  lastSeen: string;
  zone: string;
  condition: "excellent" | "good" | "fair" | "poor";
  // Compliance
  compliance: {
    insurance: { status: "ok" | "expiring" | "expired"; expiry: string };
    inspection: { status: "ok" | "expiring" | "expired"; expiry: string };
  };
}

export default function VehiclesListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filter, setFilter] = useState({ status: "all", type: "all" });
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeKpi, setActiveKpi] = useState<string | null>(null);
  const backendMode = isFleetBackendEnabled();
  const canManageVehicles = auth.hasPermission("vehicles:write");
  const canExportVehicles = auth.hasPermission("vehicles:export");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setLoadError(null);
      if (!backendMode) {
        setAllVehicles([]);
        setLoadError("Backend session required. Sign in to view fleet vehicles.");
        setLoading(false);
        return;
      }

      try {
        await refreshFleetWorkspaceState();
      } catch (error) {
        console.warn("Fleet backend vehicle sync failed.", error);
        setLoadError("Failed to refresh vehicles from backend. Showing last synced cache if available.");
      }

      const storedVehicles = (getCachedFleetVehicles() as any[]).map(v => ({
        ...v,
        compliance: v.compliance || { insurance: { status: "ok" }, inspection: { status: "ok" } },
        soc: v.soc ?? 50,
        condition: v.condition || "good",
        opsStatus: v.opsStatus || (v.status === "available" ? "ready" : "unavailable"),
        lastSeen: v.lastSeen || "recently",
        zone: v.zone || "Unknown",
        estimatedRange: v.estimatedRange ?? 200,
      }));

      setAllVehicles(storedVehicles);
      setLoading(false);
    };

    void load();
  }, [backendMode]);

  // KPI calculations
  const kpis = [
    { id: "available", label: "Available", value: allVehicles.filter(v => v.status === "available").length, color: "bg-emerald-100 text-emerald-700" },
    { id: "offline", label: "Offline", value: allVehicles.filter(v => v.status === "offline").length, color: "bg-slate-100 text-slate-700" },
    { id: "attention", label: "Needs attention", value: allVehicles.filter(v => v.condition === "fair" || v.condition === "poor").length, color: "bg-amber-100 text-amber-700" },
    { id: "lowbattery", label: "Low battery", value: allVehicles.filter(v => v.soc < 20 && v.soc > 0).length, color: "bg-red-100 text-red-700" },
    { id: "maintenance", label: "Maintenance", value: allVehicles.filter(v => v.status === "maintenance").length, color: "bg-blue-100 text-blue-700" },
    { id: "out-of-service", label: "Out of service", value: allVehicles.filter(v => v.status === "out-of-service").length, color: "bg-purple-100 text-purple-700" },
    { id: "docsmissing", label: "Docs issue", value: allVehicles.filter(v => v.compliance && (v.compliance.insurance?.status !== "ok" || v.compliance.inspection?.status !== "ok")).length, color: "bg-orange-100 text-orange-700" },
  ];

  // Filter vehicles
  const vehicles = allVehicles.filter(vehicle => {
    const matchesSearch = vehicle.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filter.status === "all" || vehicle.status === filter.status;
    const matchesType = filter.type === "all" || vehicle.vehicleType === filter.type;

    let matchesKpi = true;
    if (activeKpi) {
      switch (activeKpi) {
        case "available": matchesKpi = vehicle.status === "available"; break;
        case "offline": matchesKpi = vehicle.status === "offline"; break;
        case "attention": matchesKpi = vehicle.condition === "fair" || vehicle.condition === "poor"; break;
        case "lowbattery": matchesKpi = vehicle.soc < 20 && vehicle.soc > 0; break;
        case "maintenance": matchesKpi = vehicle.status === "maintenance"; break;
        case "out-of-service": matchesKpi = vehicle.status === "out-of-service"; break;
        case "docsmissing": matchesKpi = vehicle.compliance ? (vehicle.compliance.insurance?.status !== "ok" || vehicle.compliance.inspection?.status !== "ok") : false; break;
      }
    }

    return matchesSearch && matchesStatus && matchesType && matchesKpi;
  });

  const handleExport = () => {
    const csvContent = [
      ["Plate", "Model", "Status", "Driver", "SoC", "Zone", "Mileage", "Condition"],
      ...vehicles.map(v => [v.plate, v.model, v.status, v.driver, v.soc, v.zone, v.mileage, v.condition])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vehicles_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const statusStyles: Record<string, { bg: string; text: string }> = {
    available: { bg: "bg-emerald-100", text: "text-emerald-700" },
    offline: { bg: "bg-slate-100", text: "text-slate-600" },
    maintenance: { bg: "bg-blue-100", text: "text-blue-700" },
    "out-of-service": { bg: "bg-red-100", text: "text-red-700" },
  };

  const opsStyles: Record<string, { bg: string; text: string }> = {
    ready: { bg: "bg-emerald-50", text: "text-emerald-600" },
    busy: { bg: "bg-blue-50", text: "text-blue-600" },
    unavailable: { bg: "bg-slate-50", text: "text-slate-500" },
  };

  const complianceStyles: Record<string, string> = {
    ok: "text-emerald-600",
    expiring: "text-amber-600",
    expired: "text-red-600",
  };

  const conditionStyles: Record<string, string> = {
    excellent: "text-emerald-600",
    good: "text-blue-600",
    fair: "text-amber-600",
    poor: "text-red-600",
  };

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      {/* Enhanced Header */}
      <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-slate-100 dark:via-slate-300 dark:to-slate-100 mb-1">
              Fleet Vehicles
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Manage your fleet vehicles and their status</p>
          </div>
          <div className="flex gap-2">
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Dashboard
            </Link>
            <Link
              to="/vehicles/create"
              aria-disabled={!canManageVehicles}
              onClick={(event) => { if (!canManageVehicles) event.preventDefault(); }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${canManageVehicles ? "bg-gradient-to-r from-ev-green to-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30" : "bg-slate-200 text-slate-500 cursor-not-allowed"}`}
            >
              + Add Vehicle
            </Link>
          </div>
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
            placeholder="Search vehicles by plate, model..."
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
            disabled={!canExportVehicles}
            className="flex-1 sm:flex-none px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
          >
            Export
          </button>
        </div>
      </div>

      {/* Vehicles Grid */}
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-sm text-slate-600">
          Loading vehicles...
        </div>
      ) : loadError && allVehicles.length === 0 ? (
        <div className="bg-white rounded-xl border border-red-200 p-8 text-sm text-red-600">
          {loadError}
        </div>
      ) : vehicles.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-sm text-slate-600">
          No vehicles found from backend.
        </div>
      ) : (
      <>
      {loadError ? (
        <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl p-3 text-sm">
          {loadError}
        </div>
      ) : null}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:border-ev-green hover:shadow-lg transition-all"
          >
            {/* Header: Plate + Status */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-lg font-bold text-slate-900 mb-0.5">{vehicle.plate}</div>
                <div className="text-sm text-slate-600">{vehicle.model}</div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${(statusStyles[vehicle.status] || statusStyles['offline']).bg} ${(statusStyles[vehicle.status] || statusStyles['offline']).text}`}>
                  {vehicle.status}
                </span>
                <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${(opsStyles[vehicle.opsStatus] || opsStyles['unavailable']).bg} ${(opsStyles[vehicle.opsStatus] || opsStyles['unavailable']).text}`}>
                  Ops: {vehicle.opsStatus}
                </span>
              </div>
            </div>

            {/* EV Info Row */}
            <div className="grid grid-cols-3 gap-3 mb-3 p-3 bg-slate-50 rounded-lg">
              <div className="text-center">
                <div className={`text-lg font-bold ${vehicle.soc < 20 ? 'text-red-500' : vehicle.soc < 50 ? 'text-amber-500' : 'text-emerald-500'}`}>
                  🔋 {vehicle.soc}%
                </div>
                <div className="text-[10px] text-slate-500">SoC</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-slate-700">{vehicle.estimatedRange}</div>
                <div className="text-[10px] text-slate-500">km range</div>
              </div>
              <div className="text-center">
                <div className={`text-sm font-semibold ${conditionStyles[vehicle.condition]}`}>{vehicle.condition}</div>
                <div className="text-[10px] text-slate-500">condition</div>
              </div>
            </div>

            {/* Battery bar */}
            <div className="w-full h-1.5 rounded-full bg-slate-200 mb-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${vehicle.soc < 20 ? 'bg-red-500' : vehicle.soc < 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: `${vehicle.soc}%` }}
              />
            </div>

            {/* Details Grid */}
            <div className="space-y-2 text-sm mb-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">👤 Driver</span>
                <span className="font-medium text-slate-900">{vehicle.driver}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">📍 Zone</span>
                <span className="font-medium text-slate-900">{vehicle.zone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">🕐 Last seen</span>
                <span className="font-medium text-slate-900">{vehicle.lastSeen}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">📏 Mileage</span>
                <span className="font-medium text-slate-900">{vehicle.mileage.toLocaleString()} km</span>
              </div>
            </div>

            {/* Compliance */}
            {vehicle.compliance && (
              <div className="p-2.5 bg-slate-50 rounded-lg mb-3">
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Compliance</div>
                <div className="flex gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <span className={complianceStyles[vehicle.compliance.insurance?.status || "ok"]}>
                      {vehicle.compliance.insurance?.status === "ok" ? "✓" : vehicle.compliance.insurance?.status === "expiring" ? "⚠" : "✕"}
                    </span>
                    <span className={`${complianceStyles[vehicle.compliance.insurance?.status || "ok"]} font-medium`}>
                      Insurance {vehicle.compliance.insurance?.status === "ok" ? "OK" : vehicle.compliance.insurance?.status === "expiring" ? "Expiring" : "Expired"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={complianceStyles[vehicle.compliance.inspection?.status || "ok"]}>
                      {vehicle.compliance.inspection?.status === "ok" ? "✓" : vehicle.compliance.inspection?.status === "expiring" ? "⚠" : "✕"}
                    </span>
                    <span className={`${complianceStyles[vehicle.compliance.inspection?.status || "ok"]} font-medium`}>
                      Inspection {vehicle.compliance.inspection?.status === "ok" ? "OK" : vehicle.compliance.inspection?.status === "expiring" ? "Expiring" : "Expired"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
              <Link
                to={`/vehicles/${vehicle.id}`}
                className="w-full text-center px-3 py-2 rounded-lg bg-ev-green text-white text-xs font-medium hover:bg-ev-green-dark transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                View
              </Link>
              <Link
                to={`/vehicles/${vehicle.id}/maintenance`}
                className="w-full text-center px-3 py-2 rounded-lg bg-slate-100 text-xs font-medium text-slate-700 hover:bg-slate-200 flex items-center justify-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                🔧 Maintenance
              </Link>
              <Link
                to={`/vehicles/${vehicle.id}/documents`}
                className="w-full text-center px-3 py-2 rounded-lg bg-slate-100 text-xs font-medium text-slate-700 hover:bg-slate-200 flex items-center justify-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                📄 Documents
              </Link>
            </div>
          </div>
        ))}
      </div>
      </>
      )}

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
              <option value="available">Available</option>
              <option value="offline">Offline</option>
              <option value="maintenance">Maintenance</option>
              <option value="out-of-service">Out of service</option>
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
