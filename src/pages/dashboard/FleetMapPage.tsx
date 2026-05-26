import React, { useState, useEffect, useCallback, useRef } from "react";
import { GoogleMap, useJsApiLoader, OverlayView } from "@react-google-maps/api";
import { isFleetBackendEnabled } from "../../services/api/fleetApi";

// Types from localStorage (augmented)
interface StoredVehicle {
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
}

interface Vehicle extends StoredVehicle {
  location: { lat: number; lng: number };
  displayStatus: "active" | "idle" | "offline" | "charging" | "maintenance";
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
  const normalized = zone?.trim() || "Unknown";
  return ZONE_COORDS[normalized] || ZONE_COORDS.default;
}

function transformVehicles(raw: StoredVehicle[]): Vehicle[] {
  return raw.map(v => {
    const coords = getZoneCoordinates(v.zone);
    let displayStatus: Vehicle["displayStatus"] = "offline";
    if (v.status === "available") displayStatus = "active";
    else if (v.status === "maintenance") displayStatus = "maintenance";
    else if (v.status === "out-of-service") displayStatus = "offline";
    else if (v.status === "offline") displayStatus = "offline";
    return {
      ...v,
      location: coords,
      displayStatus,
    };
  });
}

const statusColors: Record<Vehicle["displayStatus"], { bg: string; text: string; dot: string }> = {
  active: { bg: "bg-emerald-100 dark:bg-emerald-500/10", text: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500" },
  idle: { bg: "bg-amber-100 dark:bg-amber-500/10", text: "text-amber-700 dark:text-amber-400", dot: "bg-amber-500" },
  offline: { bg: "bg-red-100 dark:bg-red-500/10", text: "text-red-700 dark:text-red-400", dot: "bg-red-500" },
  charging: { bg: "bg-blue-100 dark:bg-blue-500/10", text: "text-blue-700 dark:text-blue-400", dot: "bg-blue-500" },
  maintenance: { bg: "bg-slate-100 dark:bg-slate-500/10", text: "text-slate-700 dark:text-slate-400", dot: "bg-slate-500" },
};

function generateAlerts(vehicles: Vehicle[]): Alert[] {
  const alerts: Alert[] = [];
  let alertId = 1;

  vehicles.forEach(v => {
    if (v.displayStatus === "offline") {
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
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  const rawApiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "").trim();
  const apiKey = rawApiKey && !/^https?:\/\//i.test(rawApiKey) ? rawApiKey : "";

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-maps-script",
    googleMapsApiKey: apiKey || "",
    libraries: ["places"],
  });

  // Load vehicles from localStorage on mount
  useEffect(() => {
    const storedVehicles = JSON.parse(localStorage.getItem("vehicles") || "[]") as StoredVehicle[];
    if (storedVehicles.length > 0) {
      setVehicles(transformVehicles(storedVehicles));
    } else {
      if (isFleetBackendEnabled()) {
        setVehicles([]);
        return;
      }
      // Offline/local showcase fallback data
      const mock: Vehicle[] = [
        { id: 1, plate: "UAA 123A", model: "Tesla Model 3", status: "available", opsStatus: "ready", driver: "John Doe", soc: 78, lastSeen: "20s ago", zone: "Kampala Central", location: { lat: 0.3136, lng: 32.5811 }, estimatedRange: 280, displayStatus: "active" },
        { id: 2, plate: "UAA 124B", model: "Nissan Leaf", status: "offline", opsStatus: "unavailable", driver: "Jane Smith", soc: 65, lastSeen: "4h ago", zone: "Nakasero", location: { lat: 0.3176, lng: 32.5721 }, estimatedRange: 140, displayStatus: "offline" },
        { id: 3, plate: "UAA 125C", model: "BYD E6", status: "available", opsStatus: "ready", driver: "Mike Johnson", soc: 12, lastSeen: "2m ago", zone: "Kololo", location: { lat: 0.2986, lng: 32.5911 }, estimatedRange: 35, displayStatus: "active" },
        { id: 4, plate: "UAA 126D", model: "Tesla Model Y", status: "maintenance", opsStatus: "unavailable", driver: "Sarah Wilson", soc: 0, lastSeen: "2d ago", zone: "Service Center", location: { lat: 0.3056, lng: 32.5681 }, estimatedRange: 0, displayStatus: "maintenance" },
      ];
      setVehicles(mock);
    }
  }, []);

  const alerts = generateAlerts(vehicles);

  const filters = [
    { id: "all", label: "All vehicles", count: vehicles.length },
    { id: "active", label: "Active trips", count: vehicles.filter(v => v.displayStatus === "active").length },
    { id: "idle", label: "Idle", count: vehicles.filter(v => v.displayStatus === "idle").length },
    { id: "offline", label: "Offline", count: vehicles.filter(v => v.displayStatus === "offline").length },
    { id: "charging", label: "Charging", count: vehicles.filter(v => v.displayStatus === "charging").length },
    { id: "maintenance", label: "Maintenance", count: vehicles.filter(v => v.displayStatus === "maintenance").length },
  ];

  const filteredVehicles = selectedFilter === "all"
    ? vehicles
    : vehicles.filter(v => v.displayStatus === selectedFilter);

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
      const currentZoom = map.getZoom() ?? 12;
      const newZoom = Math.min(currentZoom + 1, 20);
      map.setZoom(newZoom);
      setZoom(newZoom);
    }
  };

  const handleZoomOut = () => {
    if (map) {
      const currentZoom = map.getZoom() ?? 12;
      const newZoom = Math.max(currentZoom - 1, 1);
      map.setZoom(newZoom);
      setZoom(newZoom);
    }
  };

  const handleLocateMe = () => {
    if (!map || !navigator.geolocation || locating) return;

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const point = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setCurrentLocation(point);
        map.panTo(point);
        map.setZoom(Math.max(map.getZoom() ?? 12, 15));
        setZoom(map.getZoom() ?? 15);
        setLocating(false);
      },
      () => {
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 120000 },
    );
  };

  const CurrentLocationMarker = ({ position }: { position: { lat: number; lng: number } }) => {
    return (
      <OverlayView
        position={position}
        mapPaneName="overlayMouseTarget"
        getPixelPositionOffset={(width, height) => ({
          x: -(width / 2),
          y: -height,
        })}
      >
        <div className="pointer-events-none relative flex flex-col items-center">
          <div className="h-4 w-4 rounded-full bg-blue-600 border-2 border-white shadow" />
          <div className="-mt-1 h-6 w-0.5 bg-blue-600/70" />
          <div className="absolute -inset-2 rounded-full border-2 border-blue-500/40 animate-ping" />
        </div>
      </OverlayView>
    );
  };

  // Custom Marker component using OverlayView for custom HTML
  const VehicleMarker = ({ vehicle }: { vehicle: Vehicle }) => {
    const colors = statusColors[vehicle.displayStatus];
    return (
      <OverlayView
        position={vehicle.location}
        mapPaneName="overlayMouseTarget"
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
          <div className="relative flex items-center justify-center">
            <div className={`h-10 w-10 rounded-full ${colors.bg} border-2 border-white dark:border-slate-700 shadow-lg flex items-center justify-center text-sm`}>
              🚗
            </div>
            <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ${colors.dot} border-2 border-white dark:border-slate-700`} />
          </div>
        </div>
      </OverlayView>
    );
  };

  if (loadError) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-red-600 dark:text-red-400">Failed to load Google Maps. Please check your API key.</div>
      </div>
    );
  }

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
                mapTypeId: "roadmap",
              }}
            >
              {filteredVehicles.map(vehicle => (
                vehicle.location && <VehicleMarker key={vehicle.id} vehicle={vehicle} />
              ))}
              {currentLocation ? <CurrentLocationMarker position={currentLocation} /> : null}
            </GoogleMap>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-800">
              <div className="text-slate-600 dark:text-slate-300">Loading map...</div>
            </div>
          )}

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            <button
              onClick={handleZoomIn}
              className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200"
            >
              +
            </button>
            <button
              onClick={handleZoomOut}
              className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200"
            >
              −
            </button>
            <button
              onClick={handleLocateMe}
              className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200"
              title="Locate me"
              aria-label="Locate my current location"
            >
              {locating ? "…" : "📍"}
            </button>
          </div>

          {/* Zoom Info */}
          <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-white/90 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-600 shadow-sm text-xs text-slate-600 dark:text-slate-400 z-10">
            ZOOM {zoom}
          </div>

          {/* Alerts Panel */}
          {alerts.length > 0 && (
            <div className={`absolute top-4 left-4 right-4 sm:right-auto sm:w-72 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden z-10 ${hideAlerts ? 'hidden' : ''}`}>
              <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-900/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-red-700 dark:text-red-400">⚠️ Alerts</span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold">{alerts.length}</span>
                    <button
                      onClick={() => setHideAlerts(true)}
                      className="h-6 w-6 rounded-md border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 hover:bg-red-100/70 dark:hover:bg-red-900/30 flex items-center justify-center text-sm leading-none"
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
                      className="px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-700 last:border-0"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-base">
                          {alert.type === "offline" ? "📡" : alert.type === "low_battery" ? "🔋" : "⏰"}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">{alert.message}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">{formatTimeAgo(alert.timestamp.toString())}</div>
                        </div>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${alert.priority === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'}`}>
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
              className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-white/95 dark:bg-slate-800/95 border border-slate-300 dark:border-slate-600 shadow-md text-xs font-semibold text-red-700 dark:text-red-400 z-10"
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
              const colors = statusColors[vehicle.displayStatus];
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
                    <span>👤 {vehicle.driver}</span>
                    <span>{formatTimeAgo(vehicle.lastSeen)}</span>
                  </div>
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
                    {vehicle.opsStatus === "busy" && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">ETA 15 min</span>
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
                  const colors = statusColors[vehicle.displayStatus];
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
                        <span>{vehicle.driver}</span>
                        <span>{formatTimeAgo(vehicle.lastSeen)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className={vehicle.soc < 20 ? 'text-red-500' : vehicle.soc < 50 ? 'text-amber-500' : 'text-emerald-500'}>
                          🔋 {vehicle.soc}%
                        </span>
                        {vehicle.opsStatus === "busy" && (
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">ETA 15 min</span>
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

              <div className="p-4 border-b border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Status</span>
                  <span className="font-medium text-slate-900 dark:text-white">{selectedVehicle.status}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Battery</span>
                  <span className="font-medium text-slate-900 dark:text-white">{selectedVehicle.soc}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Zone</span>
                  <span className="font-medium text-slate-900 dark:text-white">{selectedVehicle.zone}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Last seen</span>
                  <span className="font-medium text-slate-900 dark:text-white">{formatTimeAgo(selectedVehicle.lastSeen)}</span>
                </div>
              </div>

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
