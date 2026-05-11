import React, { useState, useEffect, useCallback, useRef } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, OverlayView } from "@react-google-maps/api";

// Types
interface Vehicle {
  id: number;
  plate: string;
  model: string;
  status: "available" | "offline" | "maintenance" | "out-of-service";
  opsStatus: "ready" | "busy" | "unavailable";
  driver: string;
  soc: number;
  estimatedRange: number;
  lastSeen: string;
  zone: string;
  // optional location for map - added by transformation
  location?: { lat: number; lng: number };
}

interface Alert {
  id: number;
  type: "offline" | "low_battery" | "long_idle" | "geofence" | "sos";
  vehicleId: number;
  message: string;
  timestamp: Date;
  priority: "high" | "medium" | "low";
}

// Kampala zone center coordinates (approximate)
const ZONE_COORDS: Record<string, { lat: number; lng: number }> = {
  "Kampala Central": { lat: 0.3136, lng: 32.5811 },
  Nakasero: { lat: 0.3176, lng: 32.5721 },
  Kololo: { lat: 0.2986, lng: 32.5911 },
  Wandegeya: { lat: 0.3056, lng: 32.5681 },
  Bukoto: { lat: 0.3236, lng: 32.5621 },
  "Ntinda": { lat: 0.2876, lng: 32.5911 },
  Bugolobi: { lat: 0.3316, lng: 32.5781 },
  Muyenga: { lat: 0.2926, lng: 32.6011 },
  Kisaasi: { lat: 0.3406, lng: 32.5651 },
  Naalya: { lat: 0.2786, lng: 32.5521 },
  Naguru: { lat: 0.3086, lng: 32.5941 },
  Kyanja: { lat: 0.3506, lng: 32.5871 },
  "Entebbe": { lat: 0.0528, lng: 32.4632 },
  "Jinja": { lat: 0.4433, lng: 33.2026 },
  "Service Center": { lat: 0.3056, lng: 32.5681 },
  Unknown: { lat: 0.3136, lng: 32.5811 },
  Fleet: { lat: 0.3136, lng: 32.5811 },
  default: { lat: 0.3136, lng: 32.5811 },
};

function getZoneCoordinates(zone: string): { lat: number; lng: number } {
  const normalized = zone.trim();
  return ZONE_COORDS[normalized] || ZONE_COORDS.default;
}

function transformVehicles(raw: any[]): Vehicle[] {
  return raw.map(v => {
    const coords = getZoneCoordinates(v.zone || "Unknown");
    return {
      id: v.id,
      plate: v.plate,
      model: v.model,
      status: v.status === "available" ? "available" : v.status === "maintenance" ? "maintenance" : v.status === "out-of-service" ? "offline" : v.status === "offline" ? "offline" : "available",
      opsStatus: v.opsStatus || "unavailable",
      driver: v.driver || "-",
      soc: v.soc ?? 50,
      estimatedRange: v.estimatedRange ?? 200,
      lastSeen: v.lastSeen || "recently",
      zone: v.zone || "Unknown",
      location: coords,
    };
  });
}

const statusColors: Record<Vehicle["status"], { bg: string; text: string; dot: string }> = {
  available: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  offline: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
  maintenance: { bg: "bg-slate-100", text: "text-slate-700", dot: "bg-slate-500" },
  "out-of-service": { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
};

function generateAlerts(vehicles: Vehicle[]): Alert[] {
  const alerts: Alert[] = [];
  let alertId = 1;

  vehicles.forEach(v => {
    if (v.status === "offline") {
      alerts.push({ id: alertId++, type: "offline", vehicleId: v.id, message: `${v.plate} offline`, timestamp: new Date(), priority: "high" });
    }
    if (v.soc < 15) {
      alerts.push({ id: alertId++, type: "low_battery", vehicleId: v.id, message: `${v.plate} low battery (${v.soc}%)`, timestamp: new Date(), priority: "high" });
    }
  });

  return alerts.sort((a, b) => (a.priority === "high" ? -1 : 1));
}

function formatTimeAgo(dateStr: string): string {
  if (dateStr === "recently") return "just now";
  // Simple relative formatting for mock purposes
  return dateStr;
}

const KampalaCenter = { lat: 0.3136, lng: 32.5811 };

export default function FleetMapPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showVehicleList, setShowVehicleList] = useState(false);
  const [hideAlerts, setHideAlerts] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [zoom, setZoom] = useState(12);
  const mapRef = useRef<HTMLDivElement>(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-maps-script",
    googleMapsApiKey: apiKey || "",
    libraries: ["places"],
  });

  // Load vehicles from localStorage on mount
  useEffect(() => {
    const storedVehicles = JSON.parse(localStorage.getItem("vehicles") || "[]") as any[];
    if (storedVehicles.length > 0) {
      setVehicles(transformVehicles(storedVehicles));
    } else {
      // Fallback mock data
      const mock: Vehicle[] = [
        { id: 1, plate: "UAA 123A", model: "Tesla Model 3", status: "available", opsStatus: "ready", driver: "John Doe", soc: 78, lastSeen: "20s ago", zone: "Kampala Central", location: { lat: 0.3136, lng: 32.5811 }, estimatedRange: 280 },
        { id: 2, plate: "UAA 124B", model: "Nissan Leaf", status: "offline", opsStatus: "unavailable", driver: "Jane Smith", soc: 65, lastSeen: "4h ago", zone: "Nakasero", location: { lat: 0.3176, lng: 32.5721 }, estimatedRange: 140 },
      ];
      setVehicles(mock);
    }
  }, []);

  const alerts = generateAlerts(vehicles);

  const filters = [
    { id: "all", label: "All vehicles", count: vehicles.length },
    { id: "available", label: "Active trips", count: vehicles.filter(v => v.status === "available").length },
    { id: "offline", label: "Offline", count: vehicles.filter(v => v.status === "offline").length },
    { id: "maintenance", label: "Maintenance", count: vehicles.filter(v => v.status === "maintenance").length },
    { id: "out-of-service", label: "Out of service", count: vehicles.filter(v => v.status === "out-of-service").length },
    { id: "charging", label: "Charging", count: 0 },
  ];

  const filteredVehicles = selectedFilter === "all"
    ? vehicles
    : vehicles.filter(v => v.status === selectedFilter);

  const handleVehicleClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowVehicleList(false);
    setShowQuickActions(true);
    if (map) {
      map.panTo(vehicle.location || KampalaCenter);
      map.setZoom(15);
    }
  };

  const handleAlertClick = (alert: Alert) => {
    const vehicle = vehicles.find(v => v.id === alert.vehicleId);
    if (vehicle) {
      setSelectedVehicle(vehicle);
      setShowQuickActions(true);
    }
  };

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const handleZoomIn = () => {
    if (map) {
      const newZoom = Math.min(map.getZoom() + 1, 20);
      map.setZoom(newZoom);
      setZoom(newZoom);
    }
  };

  const handleZoomOut = () => {
    if (map) {
      const newZoom = Math.max(map.getZoom() - 1, 1);
      map.setZoom(newZoom);
      setZoom(newZoom);
    }
  };

  const handleRotate = () => {
    // placeholder for rotate - could add bearing control later
  };

  // Custom Marker component
  const VehicleMarker = ({ vehicle }: { vehicle: Vehicle }) => {
    const colors = statusColors[vehicle.status];
    return (
      <OverlayView
        position={vehicle.location || KampalaCenter}
        getPixelPositionOffset={(width, height) => {
          return {
            x: -(width / 2),
            y: -height,
          };
        }}
      >
        <div
          onClick={() => handleVehicleClick(vehicle)}
          className="cursor-pointer transition-all hover:scale-110"
        >
          <div className={`relative flex items-center justify-center`}>
            <div className={`h-10 w-10 rounded-full ${colors.bg} border-2 border-white shadow-lg flex items-center justify-center text-sm`}>
              🚗
            </div>
            <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ${colors.dot} border-2 border-white`} />
          </div>
        </div>
      </OverlayView>
    );
  };

  if (loadError) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-slate-50">
        <div className="text-red-600">Failed to load Google Maps. Please check your API key.</div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col bg-slate-50">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-10 py-4 bg-white border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 mb-1">Live fleet map</h1>
            <p className="text-sm text-slate-600">Real-time vehicle locations and status</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
            <button className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50">
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
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
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
        <div ref={mapRef} className="flex-1 relative overflow-hidden">
          {isLoaded ? (
            <GoogleMap
              mapContainerClassName="w-full h-full"
              center={KampalaCenter}
              zoom={zoom}
              onLoad={onMapLoad}
              options={{
                disableDefaultUI: false,
                zoomControl: false,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
                styles: [
                  { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
                  { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
                  { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
                ],
              }}
            >
              {filteredVehicles.map(vehicle => (
                vehicle.location && <VehicleMarker key={vehicle.id} vehicle={vehicle} />
              ))}
            </GoogleMap>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-200">
              <div className="text-slate-600">Loading map...</div>
            </div>
          )}

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            <button
              onClick={handleZoomIn}
              className="w-10 h-10 rounded-lg bg-white border border-slate-300 shadow-sm hover:bg-slate-50 flex items-center justify-center text-slate-700"
            >
              +
            </button>
            <button
              onClick={handleZoomOut}
              className="w-10 h-10 rounded-lg bg-white border border-slate-300 shadow-sm hover:bg-slate-50 flex items-center justify-center text-slate-700"
            >
              −
            </button>
            <button
              onClick={handleRotate}
              className="w-10 h-10 rounded-lg bg-white border border-slate-300 shadow-sm hover:bg-slate-50 flex items-center justify-center text-slate-700"
            >
              🧭
            </button>
          </div>

          {/* Zoom Info */}
          <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-white/90 border border-slate-300 shadow-sm text-xs text-slate-600 z-10">
            ZOOM {zoom}
          </div>

          {/* Alerts Panel */}
          {alerts.length > 0 && (
            <div className={`absolute top-4 left-4 right-4 sm:right-auto sm:w-72 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden z-10 ${hideAlerts ? 'hidden' : ''}`}>
              <div className="px-4 py-3 bg-red-50 border-b border-red-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-red-700">⚠️ Alerts</span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold">{alerts.length}</span>
                    <button
                      onClick={() => setHideAlerts(true)}
                      className="h-6 w-6 rounded-md border border-red-200 text-red-700 hover:bg-red-100/70 flex items-center justify-center text-sm leading-none"
                      aria-label="Close alerts"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {alerts.slice(0, 5).map((alert) => {
                  const vehicle = vehicles.find(v => v.id === alert.vehicleId);
                  return (
                    <div
                      key={alert.id}
                      onClick={() => handleAlertClick(alert)}
                      className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-100 last:border-0"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-base">
                          {alert.type === "offline" ? "📡" : alert.type === "low_battery" ? "🔋" : "⏰"}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-slate-900 truncate">{alert.message}</div>
                          <div className="text-[10px] text-slate-500">{formatTimeAgo(alert.timestamp.toString())}</div>
                        </div>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${alert.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                          {alert.priority}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {alerts.length > 0 && hideAlerts && (
            <button
              onClick={() => setHideAlerts(false)}
              className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-white/95 border border-slate-300 shadow-md text-xs font-semibold text-red-700 z-10"
            >
              ⚠️ Alerts ({alerts.length})
            </button>
          )}

          <button
            onClick={() => setShowVehicleList(true)}
            className="lg:hidden absolute bottom-4 left-4 px-4 py-2 rounded-lg bg-white/95 border border-slate-300 shadow-lg text-sm font-medium text-slate-700"
          >
            Vehicles ({filteredVehicles.length})
          </button>
        </div>

        {/* Sidebar - Vehicle List */}
        <div className="hidden lg:flex w-80 bg-white border-l border-slate-200 shadow-lg flex-col">
          <div className="px-4 py-3 border-b border-slate-200">
            <h2 className="text-sm font-semibold text-slate-900">Vehicles ({filteredVehicles.length})</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredVehicles.map((vehicle) => {
              const colors = statusColors[vehicle.status];
              return (
                <div
                  key={vehicle.id}
                  onClick={() => handleVehicleClick(vehicle)}
                  className={`px-4 py-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors ${selectedVehicle?.id === vehicle.id ? 'bg-emerald-50 border-l-2 border-l-ev-green' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-slate-900">{vehicle.plate}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${colors.bg} ${colors.text}`}>
                      {vehicle.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>👤 {vehicle.driver}</span>
                    <span>{formatTimeAgo(vehicle.lastSeen)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className={vehicle.soc < 20 ? 'text-red-500' : vehicle.soc < 50 ? 'text-amber-500' : 'text-emerald-500'}>
                        🔋 {vehicle.soc}%
                      </span>
                      <div className="w-12 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${vehicle.soc < 20 ? 'bg-red-500' : vehicle.soc < 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${vehicle.soc}%` }}
                        />
                      </div>
                    </div>
                    {vehicle.opsStatus === "busy" && (
                      <span className="text-emerald-600 font-medium">ETA 15 min</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Vehicle List Drawer */}
        {showVehicleList && (
          <div className="lg:hidden absolute inset-0 z-30 bg-black/30" onClick={() => setShowVehicleList(false)}>
            <div
              className="absolute left-0 right-0 bottom-0 h-[70vh] bg-white rounded-t-2xl border-t border-slate-200 shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">Vehicles ({filteredVehicles.length})</h2>
                <button
                  onClick={() => setShowVehicleList(false)}
                  className="text-slate-500 hover:text-slate-700"
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
                      className={`px-4 py-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors ${selectedVehicle?.id === vehicle.id ? 'bg-emerald-50 border-l-2 border-l-ev-green' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-slate-900">{vehicle.plate}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${colors.bg} ${colors.text}`}>
                          {vehicle.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span>{vehicle.driver}</span>
                        <span>{formatTimeAgo(vehicle.lastSeen)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className={vehicle.soc < 20 ? 'text-red-500' : vehicle.soc < 50 ? 'text-amber-500' : 'text-emerald-500'}>
                          🔋 {vehicle.soc}%
                        </span>
                        {vehicle.opsStatus === "busy" && (
                          <span className="text-emerald-600 font-medium">ETA 15 min</span>
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
              className="absolute inset-x-0 bottom-0 h-[75vh] rounded-t-2xl bg-white shadow-2xl border-t border-slate-200 md:inset-y-0 md:bottom-auto md:right-0 md:left-auto md:w-80 md:h-auto md:rounded-none md:border-t-0 md:border-l lg:right-80"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-slate-900">{selectedVehicle.plate}</h3>
                  <button
                    onClick={() => setShowQuickActions(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-sm text-slate-500">{selectedVehicle.model} • {selectedVehicle.driver}</p>
              </div>

              <div className="p-4 border-b border-slate-200 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Status</span>
                  <span className={`font-medium text-slate-900`}>{selectedVehicle.status}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Battery</span>
                  <span className="font-medium text-slate-900">{selectedVehicle.soc}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Zone</span>
                  <span className="font-medium text-slate-900">{selectedVehicle.zone}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Last seen</span>
                  <span className="font-medium text-slate-900">{formatTimeAgo(selectedVehicle.lastSeen)}</span>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Quick Actions</h4>
                <button className="w-full px-4 py-2.5 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark transition-colors flex items-center gap-2">
                  <span>📲</span> Dispatch / Assign
                </button>
                <button className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
                  <span>📞</span> Call Driver
                </button>
                <button className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
                  <span>💬</span> Message Driver
                </button>
                <button className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
                  <span>🔄</span> Set Availability
                </button>
                <button className="w-full px-4 py-2.5 rounded-lg border border-red-300 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors flex items-center gap-2">
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
