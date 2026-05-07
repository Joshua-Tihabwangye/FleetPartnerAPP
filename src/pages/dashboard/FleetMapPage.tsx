import React, { useState, useEffect } from "react";

// Mock vehicle data with realistic statuses
interface Vehicle {
  id: number;
  plate: string;
  model: string;
  driver: string;
  phone: string;
  status: "active" | "idle" | "offline" | "charging" | "maintenance";
  soc: number; // State of Charge %
  lastSeen: Date;
  location: { lat: number; lng: number; zone: string };
  tripInfo?: { pickup: string; dropoff: string; eta: string };
}

interface Alert {
  id: number;
  type: "offline" | "low_battery" | "long_idle" | "geofence" | "sos";
  vehicleId: number;
  message: string;
  timestamp: Date;
  priority: "high" | "medium" | "low";
}

const generateMockVehicles = (): Vehicle[] => [
  { id: 1, plate: "UAA 123A", model: "Tesla Model 3", driver: "John Doe", phone: "+256 700 000 001", status: "active", soc: 78, lastSeen: new Date(Date.now() - 20000), location: { lat: 0.3136, lng: 32.5811, zone: "Kampala Central" }, tripInfo: { pickup: "Garden City", dropoff: "Entebbe Airport", eta: "25 min" } },
  { id: 2, plate: "UAA 124B", model: "Nissan Leaf", driver: "Jane Smith", phone: "+256 700 000 002", status: "idle", soc: 65, lastSeen: new Date(Date.now() - 180000), location: { lat: 0.3176, lng: 32.5721, zone: "Nakasero" } },
  { id: 3, plate: "UAA 125C", model: "BYD E6", driver: "Mike Johnson", phone: "+256 700 000 003", status: "active", soc: 45, lastSeen: new Date(Date.now() - 15000), location: { lat: 0.2986, lng: 32.5911, zone: "Kololo" }, tripInfo: { pickup: "Acacia Mall", dropoff: "Kisementi", eta: "8 min" } },
  { id: 4, plate: "UAA 126D", model: "Tesla Model Y", driver: "Sarah Wilson", phone: "+256 700 000 004", status: "charging", soc: 32, lastSeen: new Date(Date.now() - 60000), location: { lat: 0.3056, lng: 32.5681, zone: "Wandegeya" } },
  { id: 5, plate: "UAA 127E", model: "Hyundai Ioniq", driver: "David Brown", phone: "+256 700 000 005", status: "offline", soc: 89, lastSeen: new Date(Date.now() - 14400000), location: { lat: 0.3236, lng: 32.5621, zone: "Bukoto" } },
  { id: 6, plate: "UAA 128F", model: "Kia EV6", driver: "Emily Davis", phone: "+256 700 000 006", status: "maintenance", soc: 55, lastSeen: new Date(Date.now() - 86400000), location: { lat: 0.2876, lng: 32.5911, zone: "Ntinda" } },
  { id: 7, plate: "UAA 129G", model: "Tesla Model 3", driver: "Peter Okello", phone: "+256 700 000 007", status: "active", soc: 91, lastSeen: new Date(Date.now() - 10000), location: { lat: 0.3316, lng: 32.5781, zone: "Bugolobi" }, tripInfo: { pickup: "Forest Mall", dropoff: "Gaba Road", eta: "12 min" } },
  { id: 8, plate: "UAA 130H", model: "Nissan Leaf", driver: "Grace Nakato", phone: "+256 700 000 008", status: "idle", soc: 72, lastSeen: new Date(Date.now() - 300000), location: { lat: 0.2926, lng: 32.6011, zone: "Muyenga" } },
  { id: 9, plate: "UAA 131I", model: "BYD Han", driver: "James Ssebunya", phone: "+256 700 000 009", status: "active", soc: 58, lastSeen: new Date(Date.now() - 25000), location: { lat: 0.3406, lng: 32.5651, zone: "Kisaasi" }, tripInfo: { pickup: "Namugongo", dropoff: "City Centre", eta: "18 min" } },
  { id: 10, plate: "UAA 132J", model: "Hyundai Kona", driver: "Alice Namutebi", phone: "+256 700 000 010", status: "idle", soc: 12, lastSeen: new Date(Date.now() - 600000), location: { lat: 0.2786, lng: 32.5521, zone: "Naalya" } },
  { id: 11, plate: "UAA 133K", model: "Tesla Model S", driver: "Robert Mugisha", phone: "+256 700 000 011", status: "offline", soc: 67, lastSeen: new Date(Date.now() - 28800000), location: { lat: 0.3086, lng: 32.5941, zone: "Naguru" } },
  { id: 12, plate: "UAA 134L", model: "Kia Niro EV", driver: "Christine Apio", phone: "+256 700 000 012", status: "charging", soc: 48, lastSeen: new Date(Date.now() - 120000), location: { lat: 0.3506, lng: 32.5871, zone: "Kyanja" } },
];

const generateAlerts = (vehicles: Vehicle[]): Alert[] => {
  const alerts: Alert[] = [];
  let alertId = 1;

  vehicles.forEach(v => {
    if (v.status === "offline") {
      alerts.push({ id: alertId++, type: "offline", vehicleId: v.id, message: `${v.plate} offline for ${formatTimeAgo(v.lastSeen)}`, timestamp: v.lastSeen, priority: "high" });
    }
    if (v.soc < 15) {
      alerts.push({ id: alertId++, type: "low_battery", vehicleId: v.id, message: `${v.plate} low battery (${v.soc}%)`, timestamp: new Date(), priority: "high" });
    }
    if (v.status === "idle") {
      const idleTime = Date.now() - v.lastSeen.getTime();
      if (idleTime > 7200000) { // 2 hours
        alerts.push({ id: alertId++, type: "long_idle", vehicleId: v.id, message: `${v.plate} idle for ${formatTimeAgo(v.lastSeen)}`, timestamp: v.lastSeen, priority: "medium" });
      }
    }
  });

  return alerts.sort((a, b) => (a.priority === "high" ? -1 : 1));
};

const formatTimeAgo = (date: Date): string => {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

const statusColors: Record<Vehicle["status"], { bg: string; text: string; dot: string }> = {
  active: { bg: "bg-emerald-100 dark:bg-emerald-500/10", text: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500" },
  idle: { bg: "bg-amber-100 dark:bg-amber-500/10", text: "text-amber-700 dark:text-amber-400", dot: "bg-amber-500" },
  offline: { bg: "bg-red-100 dark:bg-red-500/10", text: "text-red-700 dark:text-red-400", dot: "bg-red-500" },
  charging: { bg: "bg-blue-100 dark:bg-blue-500/10", text: "text-blue-700 dark:text-blue-400", dot: "bg-blue-500" },
  maintenance: { bg: "bg-slate-100 dark:bg-slate-500/10", text: "text-slate-700 dark:text-slate-400", dot: "bg-slate-500" },
};

const alertIcons: Record<Alert["type"], string> = {
  offline: "📡",
  low_battery: "🔋",
  long_idle: "⏰",
  geofence: "🚧",
  sos: "🚨",
};

export default function FleetMapPage() {
  const [vehicles] = useState<Vehicle[]>(generateMockVehicles());
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showVehicleList, setShowVehicleList] = useState(false);
  const [hideAlerts, setHideAlerts] = useState(false);
  const [alerts] = useState<Alert[]>(generateAlerts(generateMockVehicles()));

  const filters = [
    { id: "all", label: "All vehicles", count: vehicles.length },
    { id: "active", label: "Active trips", count: vehicles.filter(v => v.status === "active").length },
    { id: "idle", label: "Idle", count: vehicles.filter(v => v.status === "idle").length },
    { id: "offline", label: "Offline", count: vehicles.filter(v => v.status === "offline").length },
    { id: "charging", label: "Charging", count: vehicles.filter(v => v.status === "charging").length },
    { id: "maintenance", label: "Maintenance", count: vehicles.filter(v => v.status === "maintenance").length },
  ];

  const filteredVehicles = selectedFilter === "all"
    ? vehicles
    : vehicles.filter(v => v.status === selectedFilter);

  const handleVehicleClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowVehicleList(false);
    setShowQuickActions(true);
  };

  const handleAlertClick = (alert: Alert) => {
    const vehicle = vehicles.find(v => v.id === alert.vehicleId);
    if (vehicle) {
      setSelectedVehicle(vehicle);
      setShowQuickActions(true);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-10 py-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white mb-1">Live fleet map</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Real-time vehicle locations and status</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
            <button className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600">
              🔄 Refresh
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark shadow-sm">
              ⚙️ Settings
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedFilter === filter.id
                ? "bg-ev-green text-white shadow-md shadow-emerald-500/20"
                : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex relative min-h-0">
        {/* Map Container */}
        <div className="flex-1 relative bg-slate-200 dark:bg-slate-950 overflow-hidden">
          {/* Simulated Map with Vehicle Markers */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
            {/* Grid lines to simulate map */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

            {/* Vehicle Markers */}
            {filteredVehicles.map((vehicle, idx) => {
              const colors = statusColors[vehicle.status];
              const x = 15 + (idx % 5) * 18 + Math.random() * 5;
              const y = 15 + Math.floor(idx / 5) * 25 + Math.random() * 5;
              return (
                <div
                  key={vehicle.id}
                  onClick={() => handleVehicleClick(vehicle)}
                  className={`absolute cursor-pointer transition-all hover:scale-125 hover:z-10 group`}
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <div className={`relative`}>
                    <div className={`h-8 w-8 rounded-full ${colors.bg} border-2 border-white dark:border-slate-700 shadow-lg flex items-center justify-center text-xs font-bold ${colors.text}`}>
                      🚗
                    </div>
                    <span className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full ${colors.dot} border-2 border-white dark:border-slate-700`} />
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                      <div className="bg-slate-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-xl">
                        <div className="font-semibold">{vehicle.plate}</div>
                        <div className="text-slate-300">{vehicle.driver}</div>
                        <div className="text-slate-400">{vehicle.status} • {vehicle.soc}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200">
              +
            </button>
            <button className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200">
              −
            </button>
            <button className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200">
              🧭
            </button>
          </div>

          {/* Alerts Panel */}
          {alerts.length > 0 && (
            <div className={`absolute top-4 left-4 right-4 sm:right-auto sm:w-72 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden ${hideAlerts ? 'hidden' : ''}`}>
              <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-900/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-red-700 dark:text-red-400">⚠️ Alerts</span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold">{alerts.length}</span>
                    <button
                      onClick={() => setHideAlerts(true)}
                      className="h-6 w-6 rounded-md border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 hover:bg-red-100/70 dark:hover:bg-red-900/30 flex items-center justify-center text-sm leading-none"
                      aria-label="Close alerts"
                      title="Close alerts"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
              <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700">
                {alerts.slice(0, 5).map((alert) => (
                  <div
                    key={alert.id}
                    onClick={() => handleAlertClick(alert)}
                    className="px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-base">{alertIcons[alert.type]}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">{alert.message}</div>
                        <div className="text-[10px] text-slate-500">{formatTimeAgo(alert.timestamp)}</div>
                      </div>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${alert.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                        {alert.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {alerts.length > 0 && hideAlerts && (
            <button
              onClick={() => setHideAlerts(false)}
              className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-white/95 dark:bg-slate-800/95 border border-slate-300 dark:border-slate-600 shadow-md text-xs font-semibold text-red-700 dark:text-red-400"
            >
              ⚠️ Alerts ({alerts.length})
            </button>
          )}

          <button
            onClick={() => setShowVehicleList(true)}
            className="lg:hidden absolute bottom-4 left-4 px-4 py-2 rounded-lg bg-white/95 dark:bg-slate-800/95 border border-slate-300 dark:border-slate-600 shadow-lg text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Vehicles ({filteredVehicles.length})
          </button>
        </div>

        {/* Sidebar - Vehicle List */}
        <div className="hidden lg:flex w-80 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 shadow-lg flex-col">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Vehicles ({filteredVehicles.length})</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredVehicles.map((vehicle) => {
              const colors = statusColors[vehicle.status];
              return (
                <div
                  key={vehicle.id}
                  onClick={() => handleVehicleClick(vehicle)}
                  className={`px-4 py-3 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors ${selectedVehicle?.id === vehicle.id ? 'bg-emerald-50 dark:bg-emerald-900/20 border-l-2 border-l-ev-green' : ''}`}
                >
                  {/* Row 1: Plate + Status */}
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{vehicle.plate}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${colors.bg} ${colors.text}`}>
                      {vehicle.status}
                    </span>
                  </div>
                  {/* Row 2: Driver + Last seen */}
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <span>👤 {vehicle.driver}</span>
                    <span>{formatTimeAgo(vehicle.lastSeen)}</span>
                  </div>
                  {/* Row 3: Battery + Trip info */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className={vehicle.soc < 20 ? 'text-red-500' : vehicle.soc < 50 ? 'text-amber-500' : 'text-emerald-500'}>
                        🔋 {vehicle.soc}%
                      </span>
                      <div className="w-12 h-1.5 rounded-full bg-slate-200 dark:bg-slate-600 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${vehicle.soc < 20 ? 'bg-red-500' : vehicle.soc < 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${vehicle.soc}%` }}
                        />
                      </div>
                    </div>
                    {vehicle.tripInfo && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">ETA {vehicle.tripInfo.eta}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {showVehicleList && (
          <div className="lg:hidden absolute inset-0 z-30 bg-black/30" onClick={() => setShowVehicleList(false)}>
            <div
              className="absolute left-0 right-0 bottom-0 h-[70vh] bg-white dark:bg-slate-800 rounded-t-2xl border-t border-slate-200 dark:border-slate-700 shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Vehicles ({filteredVehicles.length})</h2>
                <button
                  onClick={() => setShowVehicleList(false)}
                  className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {filteredVehicles.map((vehicle) => {
                  const colors = statusColors[vehicle.status];
                  return (
                    <div
                      key={vehicle.id}
                      onClick={() => handleVehicleClick(vehicle)}
                      className={`px-4 py-3 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors ${selectedVehicle?.id === vehicle.id ? 'bg-emerald-50 dark:bg-emerald-900/20 border-l-2 border-l-ev-green' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{vehicle.plate}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${colors.bg} ${colors.text}`}>
                          {vehicle.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                        <span className="truncate pr-2">👤 {vehicle.driver}</span>
                        <span>{formatTimeAgo(vehicle.lastSeen)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className={vehicle.soc < 20 ? 'text-red-500' : vehicle.soc < 50 ? 'text-amber-500' : 'text-emerald-500'}>
                          🔋 {vehicle.soc}%
                        </span>
                        {vehicle.tripInfo && (
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">ETA {vehicle.tripInfo.eta}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions Drawer */}
        {showQuickActions && selectedVehicle && (
          <div className="absolute inset-0 bg-black/20 z-40" onClick={() => setShowQuickActions(false)}>
            <div
              className="absolute inset-x-0 bottom-0 h-[75vh] rounded-t-2xl bg-white dark:bg-slate-800 shadow-2xl border-t border-slate-200 dark:border-slate-700 md:inset-y-0 md:bottom-auto md:right-0 md:left-auto md:w-80 md:h-auto md:rounded-none md:border-t-0 md:border-l lg:right-80"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{selectedVehicle.plate}</h3>
                  <button
                    onClick={() => setShowQuickActions(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{selectedVehicle.model} • {selectedVehicle.driver}</p>
              </div>

              {/* Vehicle Details */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Status</span>
                  <span className={`font-medium ${statusColors[selectedVehicle.status].text}`}>{selectedVehicle.status}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Battery</span>
                  <span className="font-medium text-slate-900 dark:text-white">{selectedVehicle.soc}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Zone</span>
                  <span className="font-medium text-slate-900 dark:text-white">{selectedVehicle.location.zone}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Last seen</span>
                  <span className="font-medium text-slate-900 dark:text-white">{formatTimeAgo(selectedVehicle.lastSeen)}</span>
                </div>
                {selectedVehicle.tripInfo && (
                  <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <div className="text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-1">Active Trip</div>
                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      {selectedVehicle.tripInfo.pickup} → {selectedVehicle.tripInfo.dropoff}
                    </div>
                    <div className="text-xs font-medium text-emerald-600 mt-1">ETA: {selectedVehicle.tripInfo.eta}</div>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="p-4 space-y-2">
                <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Quick Actions</h4>
                <button className="w-full px-4 py-2.5 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark transition-colors flex items-center gap-2">
                  <span>📲</span> Dispatch / Assign
                </button>
                <button className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2">
                  <span>📞</span> Call Driver
                </button>
                <button className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2">
                  <span>💬</span> Message Driver
                </button>
                <button className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2">
                  <span>🔄</span> Set Availability
                </button>
                <button className="w-full px-4 py-2.5 rounded-lg border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2">
                  <span>🚩</span> Flag Issue / Incident
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
