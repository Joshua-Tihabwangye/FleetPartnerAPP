import { request, configureHttpClientAuth, type TokenRefreshResult } from "./httpClient";
import { ALLOW_CACHE_FALLBACK, SOCKET_BASE_URL, SOCKET_PATH, getBackendEnabled } from "./config";
import { io, type Socket } from "socket.io-client";

export const FLEET_BACKEND_ACCESS_TOKEN_KEY = "fleet_backend_access_token";
export const FLEET_BACKEND_REFRESH_TOKEN_KEY = "fleet_backend_refresh_token";
const FLEET_AUTH_STORAGE_KEY = "fleet_partner_auth";

type FleetProfileResponse = {
  fleetId: string;
  companyName: string;
  contactEmail: string;
  contactPhone: string;
  registrationNumber?: string;
  taxId?: string;
};

type FleetBranchResponse = {
  id: string;
  name: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  managerName?: string;
  operatingHours?: Record<string, unknown>;
};

type FleetDriverResponse = {
  driverId: string;
  fullName: string;
  phone: string;
  city?: string;
  status: "invited" | "active" | "suspended";
  branchId?: string;
};

type FleetVehicleResponse = {
  id: string;
  make: string;
  model: string;
  plate?: string;
  licensePlate?: string;
  type: string;
  status: "active" | "inactive" | "maintenance";
};

type FleetDispatchResponse = {
  id: string;
  driverId?: string;
  vehicleId?: string;
  pickup: string;
  dropoff: string;
  status: "pending" | "assigned" | "completed" | "cancelled";
};

type FleetServiceResponse = {
  id: string;
  service: "rental" | "tour" | "school_shuttle";
  status: "pending" | "active" | "completed" | "cancelled";
  customerName: string;
  assetId?: string;
  scheduledAt: number;
  notes?: string;
};

export type FleetIncidentResponse = {
  id: string;
  category: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "investigating" | "resolved";
  description: string;
  createdAt: number;
};

type FleetTrainingResponse = {
  id: string;
  title: string;
  status: "draft" | "published" | "archived";
  assignedTo?: string;
};

type FleetNotificationResponse = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: number;
};

type FleetPayoutResponse = {
  id: string;
  amount: number;
  currency: string;
  status: "pending" | "processing" | "paid";
  createdAt: number;
};

type FleetEarningsSummaryResponse = {
  totalEarnings: number;
  totalTrips: number;
  totalDrivers: number;
  currency: string;
};

export function isFleetBackendEnabled(): boolean {
  // Backend features require both the runtime flag and an authenticated backend session.
  return getBackendEnabled() && !!readFleetBackendAccessToken();
}

export function readFleetBackendAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(FLEET_BACKEND_ACCESS_TOKEN_KEY);
}

export function readFleetBackendRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(FLEET_BACKEND_REFRESH_TOKEN_KEY);
}

export function saveFleetBackendTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FLEET_BACKEND_ACCESS_TOKEN_KEY, accessToken);
  window.localStorage.setItem(FLEET_BACKEND_REFRESH_TOKEN_KEY, refreshToken);
}

export function clearFleetBackendTokens(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(FLEET_BACKEND_ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(FLEET_BACKEND_REFRESH_TOKEN_KEY);
}

function clearFleetSession(): void {
  if (typeof window === "undefined") return;
  clearFleetBackendTokens();
  window.localStorage.removeItem(FLEET_AUTH_STORAGE_KEY);
}

async function refreshFleetTokens(refreshToken: string): Promise<TokenRefreshResult> {
  const payload = await request<{ accessToken: string; refreshToken: string }>("/auth/refresh", {
    method: "POST",
    body: { refreshToken },
    retryOnUnauthorized: false,
  });

  return {
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken,
  };
}

configureHttpClientAuth({
  getAccessToken: readFleetBackendAccessToken,
  getRefreshToken: readFleetBackendRefreshToken,
  setTokens: saveFleetBackendTokens,
  clearSession: clearFleetSession,
  refresh: refreshFleetTokens,
  onUnauthorized: () => {
    if (typeof window === "undefined") return;
    if (window.location.hash !== "#/login") {
      window.location.assign("/#/login");
    }
  },
});

export function createFleetSocket(): Socket {
  return io(`${SOCKET_BASE_URL}/fleet`, {
    path: SOCKET_PATH,
    transports: ["websocket"],
    autoConnect: false,
    withCredentials: false,
    auth: {
      token: readFleetBackendAccessToken(),
    },
  });
}

function writeStorage(key: string, value: unknown) {
  if (typeof window === "undefined" || !ALLOW_CACHE_FALLBACK) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined" || !ALLOW_CACHE_FALLBACK) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function driverStatus(status: FleetDriverResponse["status"]) {
  switch (status) {
    case "active":
      return "available";
    case "suspended":
      return "suspended";
    default:
      return "offline";
  }
}

function vehicleStatus(status: FleetVehicleResponse["status"]) {
  switch (status) {
    case "active":
      return "available";
    case "maintenance":
      return "maintenance";
    default:
      return "offline";
  }
}

function dispatchStatus(status: FleetDispatchResponse["status"]) {
  switch (status) {
    case "assigned":
      return "in-progress";
    case "completed":
      return "completed";
    case "cancelled":
      return "cancelled";
    default:
      return "scheduled";
  }
}

export async function syncFleetWorkspaceState(): Promise<void> {
  if (typeof window === "undefined" || !getBackendEnabled() || !readFleetBackendAccessToken()) {
    return;
  }

  const [
    profile,
    branches,
    drivers,
    vehicles,
    dispatches,
    rentals,
    tours,
    shuttles,
    incidents,
    trainingCourses,
    notifications,
    payouts,
    earningsSummary,
  ] = await Promise.all([
    request<FleetProfileResponse>("/fleet/me/profile"),
    request<FleetBranchResponse[]>("/fleet/me/branches"),
    request<FleetDriverResponse[]>("/fleet/drivers"),
    request<FleetVehicleResponse[]>("/fleet/vehicles"),
    request<FleetDispatchResponse[]>("/fleet/dispatches"),
    request<FleetServiceResponse[]>("/fleet/rentals"),
    request<FleetServiceResponse[]>("/fleet/tours"),
    request<FleetServiceResponse[]>("/fleet/school-shuttles"),
    request<FleetIncidentResponse[]>("/fleet/compliance/incidents"),
    request<FleetTrainingResponse[]>("/fleet/compliance/training-courses"),
    request<FleetNotificationResponse[]>("/fleet/me/notifications"),
    request<FleetPayoutResponse[]>("/fleet/earnings/payouts"),
    request<FleetEarningsSummaryResponse>("/fleet/earnings/summary"),
  ]);

  const vehicleById = new Map(vehicles.map((vehicle) => [vehicle.id, vehicle]));
  const driverById = new Map(drivers.map((driver) => [driver.driverId, driver]));

  writeStorage("fleet_partner_profile", {
    name: profile.companyName,
    email: profile.contactEmail,
    phone: profile.contactPhone,
    language: "English",
    notifications: {
      email: true,
      sms: false,
      portal: true,
    },
  });

  writeStorage("branches", branches.map((branch, index) => ({
    id: index + 1,
    backendId: branch.id,
    name: branch.name,
    address: branch.address ?? "",
    phone: branch.phone ?? "",
    manager: branch.managerName ?? "Unassigned",
    email: profile.contactEmail,
    isActive: true,
  })));

  writeStorage("drivers", drivers.map((driver, index) => ({
    id: index + 1,
    backendId: driver.driverId,
    name: driver.fullName,
    phone: driver.phone,
    status: driverStatus(driver.status),
    trips: 0,
    rating: 4.8,
    cancelRate: 0,
    lastSeen: "recently",
    zone: driver.city ?? "Unassigned",
    vehicle: "-",
    docsStatus: "ok",
  })));

  writeStorage("vehicles", vehicles.map((vehicle, index) => ({
    id: index + 1,
    backendId: vehicle.id,
    plate: vehicle.plate ?? vehicle.licensePlate ?? "-",
    model: `${vehicle.make} ${vehicle.model}`.trim(),
    status: vehicleStatus(vehicle.status),
    opsStatus: vehicle.status === "active" ? "ready" : "unavailable",
    driver: "-",
    mileage: 0,
    vehicleType: vehicle.type,
    soc: 50,
    estimatedRange: 200,
    lastSeen: "recently",
    zone: "Fleet",
    condition: "good",
    compliance: {
      insurance: { status: "ok", expiry: "" },
      inspection: { status: "ok", expiry: "" },
    },
  })));

  writeStorage("dispatches", dispatches.map((dispatch, index) => ({
    id: index + 1,
    backendId: dispatch.id,
    pickup: dispatch.pickup,
    dropoff: dispatch.dropoff,
    vehicle: dispatch.vehicleId ? vehicleById.get(dispatch.vehicleId)?.plate ?? "-" : "-",
    driver: dispatch.driverId ? driverById.get(dispatch.driverId)?.fullName ?? "-" : "-",
    fare: "0",
    status: dispatchStatus(dispatch.status),
  })));

  writeStorage("rentals", rentals.map((rental, index) => ({
    id: index + 1,
    backendId: rental.id,
    bookingId: `RNT-${String(index + 1).padStart(3, "0")}`,
    customerName: rental.customerName,
    vehicleName: rental.assetId ? vehicleById.get(rental.assetId)?.model ?? "Fleet vehicle" : "Fleet vehicle",
    vehiclePlate: rental.assetId ? vehicleById.get(rental.assetId)?.plate ?? "-" : "-",
    status: rental.status,
    startDate: new Date(rental.scheduledAt).toISOString().slice(0, 10),
    endDate: new Date(rental.scheduledAt).toISOString().slice(0, 10),
  })));

  writeStorage("tours", tours.map((tour, index) => ({
    id: index + 1,
    backendId: tour.id,
    name: tour.customerName,
    vehicle: tour.assetId ? vehicleById.get(tour.assetId)?.plate ?? "-" : "-",
    status: tour.status === "pending" ? "scheduled" : tour.status,
    bookings: 0,
    capacity: 20,
  })));

  writeStorage("shuttle_routes", shuttles.map((shuttle, index) => ({
    id: index + 1,
    backendId: shuttle.id,
    name: shuttle.customerName,
    status: shuttle.status,
    bus: shuttle.assetId ? vehicleById.get(shuttle.assetId)?.plate ?? "-" : "-",
    scheduleDate: new Date(shuttle.scheduledAt).toISOString().slice(0, 10),
  })));

  writeStorage("incidents", incidents.map((incident, index) => ({
    id: index + 1,
    backendId: incident.id,
    incidentId: `INC-${String(index + 1).padStart(3, "0")}`,
    type: incident.category,
    vehicle: "-",
    driver: "-",
    date: new Date(incident.createdAt).toISOString().slice(0, 10),
    severity: incident.severity,
    status: incident.status,
    description: incident.description,
  })));

  writeStorage("training_courses", trainingCourses);
  writeStorage("notifications", notifications.map((item) => ({
    id: item.id,
    title: item.title,
    message: item.message,
    time: new Date(item.createdAt).toISOString(),
    read: item.read,
    type: "system",
    link: "/dashboard",
  })));
  writeStorage("fleet_payouts", payouts);
  writeStorage("fleet_earnings_summary", earningsSummary);
}

export type FleetCreateDriverInput = {
  fullName: string;
  email: string;
  phone: string;
  city?: string;
  country?: string;
  branchId?: string;
  serviceModes?: string[];
};

export type FleetUpdateDriverInput = Partial<FleetCreateDriverInput> & {
  status?: "invited" | "active" | "suspended";
};

export type FleetCreateVehicleInput = {
  make: string;
  model: string;
  year: number;
  plate: string;
  type: string;
  status?: "active" | "inactive" | "maintenance";
};

export type FleetUpdateVehicleInput = Partial<FleetCreateVehicleInput>;

export type FleetCreateDispatchInput = {
  pickup: string;
  dropoff: string;
  notes?: string;
  type?: string;
  driverId?: string;
  vehicleId?: string;
};

export type FleetCreateServiceInput = {
  customerName: string;
  assetId?: string;
  scheduledAt: number;
  notes?: string;
};

export type FleetCreateComplianceIncidentInput = {
  category: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
};

export type FleetRiderServiceResponse = {
  id: string;
  riderId: string;
  driverId?: string;
  serviceType: "rental" | "tour" | "ambulance";
  status: string;
  payload: Record<string, unknown>;
  createdAt: number;
  updatedAt: number;
};

export type FleetPortalSettingsResponse = {
  language: string;
  notifications: {
    email: boolean;
    sms: boolean;
    portal: boolean;
  };
};

export type FleetSecuritySettingsResponse = {
  twoFactorEnabled: boolean;
  sessions: Array<Record<string, unknown>>;
};

export type FleetIntegrationsResponse = {
  integrations: Array<Record<string, unknown>>;
};

export type FleetRolesResponse = {
  roles: Array<Record<string, unknown>>;
};

export async function createFleetDriver(input: FleetCreateDriverInput) {
  const created = await request<FleetDriverResponse>("/fleet/drivers", {
    method: "POST",
    body: input,
  });
  await syncFleetWorkspaceState();
  return created;
}

export async function patchFleetDriver(driverId: string, patch: FleetUpdateDriverInput) {
  const updated = await request<FleetDriverResponse>(`/fleet/drivers/${driverId}`, {
    method: "PATCH",
    body: patch,
  });
  await syncFleetWorkspaceState();
  return updated;
}

export async function createFleetVehicle(input: FleetCreateVehicleInput) {
  const created = await request<FleetVehicleResponse>("/fleet/vehicles", {
    method: "POST",
    body: input,
  });
  await syncFleetWorkspaceState();
  return created;
}

export async function patchFleetVehicle(vehicleId: string, patch: FleetUpdateVehicleInput) {
  const updated = await request<FleetVehicleResponse>(`/fleet/vehicles/${vehicleId}`, {
    method: "PATCH",
    body: patch,
  });
  await syncFleetWorkspaceState();
  return updated;
}

export async function createFleetDispatch(input: FleetCreateDispatchInput) {
  const created = await request<FleetDispatchResponse>("/fleet/dispatches", {
    method: "POST",
    body: input,
  });
  await syncFleetWorkspaceState();
  return created;
}

export type FleetUpsertBranchInput = {
  name: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  managerName?: string;
  operatingHours?: Record<string, unknown>;
};

export type FleetPatchBranchInput = Partial<FleetUpsertBranchInput>;

export async function getFleetProfile() {
  return request<FleetProfileResponse>("/fleet/me/profile", { method: "GET" });
}

export async function patchFleetProfile(input: Partial<{
  companyName: string;
  contactEmail: string;
  contactPhone: string;
  registrationNumber: string;
  taxId: string;
}>) {
  const updated = await request<FleetProfileResponse>("/fleet/me/profile", {
    method: "PATCH",
    body: input,
  });
  await syncFleetWorkspaceState();
  return updated;
}

export async function listFleetBranches() {
  return request<FleetBranchResponse[]>("/fleet/me/branches", { method: "GET" });
}

export async function getFleetBranch(branchId: string) {
  return request<FleetBranchResponse>(`/fleet/me/branches/${branchId}`, { method: "GET" });
}

export async function createFleetBranch(input: FleetUpsertBranchInput) {
  const created = await request<FleetBranchResponse>("/fleet/me/branches", {
    method: "POST",
    body: input,
  });
  await syncFleetWorkspaceState();
  return created;
}

export async function patchFleetBranch(branchId: string, patch: FleetPatchBranchInput) {
  const updated = await request<FleetBranchResponse>(`/fleet/me/branches/${branchId}`, {
    method: "PATCH",
    body: patch,
  });
  await syncFleetWorkspaceState();
  return updated;
}

export async function deleteFleetBranch(branchId: string) {
  const deleted = await request<{ deleted: boolean }>(`/fleet/me/branches/${branchId}`, {
    method: "DELETE",
  });
  await syncFleetWorkspaceState();
  return deleted;
}

export async function getFleetPortalSettings() {
  return request<FleetPortalSettingsResponse>("/fleet/me/settings", { method: "GET" });
}

export async function patchFleetPortalSettings(input: Partial<FleetPortalSettingsResponse>) {
  return request<FleetPortalSettingsResponse>("/fleet/me/settings", {
    method: "PATCH",
    body: input,
  });
}

export async function getFleetSecuritySettings() {
  return request<FleetSecuritySettingsResponse>("/fleet/me/security", { method: "GET" });
}

export async function patchFleetSecuritySettings(input: Partial<FleetSecuritySettingsResponse>) {
  return request<FleetSecuritySettingsResponse>("/fleet/me/security", {
    method: "PATCH",
    body: input,
  });
}

export async function getFleetIntegrations() {
  return request<FleetIntegrationsResponse>("/fleet/me/integrations", { method: "GET" });
}

export async function patchFleetIntegrations(input: Partial<FleetIntegrationsResponse>) {
  return request<FleetIntegrationsResponse>("/fleet/me/integrations", {
    method: "PATCH",
    body: input,
  });
}

export async function getFleetRoles() {
  return request<FleetRolesResponse>("/fleet/me/roles", { method: "GET" });
}

export async function patchFleetRoles(input: Partial<FleetRolesResponse>) {
  return request<FleetRolesResponse>("/fleet/me/roles", {
    method: "PATCH",
    body: input,
  });
}

export async function listFleetRentals() {
  return request<FleetServiceResponse[]>("/fleet/rentals", { method: "GET" });
}

export async function createFleetRental(input: FleetCreateServiceInput) {
  const created = await request<FleetServiceResponse>("/fleet/rentals", {
    method: "POST",
    body: input,
  });
  await syncFleetWorkspaceState();
  return created;
}

export async function listFleetTours() {
  return request<FleetServiceResponse[]>("/fleet/tours", { method: "GET" });
}

export async function createFleetTour(input: FleetCreateServiceInput) {
  const created = await request<FleetServiceResponse>("/fleet/tours", {
    method: "POST",
    body: input,
  });
  await syncFleetWorkspaceState();
  return created;
}

export async function patchFleetTour(
  tourId: string,
  patch: Partial<{ customerName: string; assetId: string; scheduledAt: number; notes: string; status: string }>
) {
  const updated = await request<FleetServiceResponse>(`/fleet/tours/${tourId}`, {
    method: "PATCH",
    body: patch,
  });
  await syncFleetWorkspaceState();
  return updated;
}

export async function listFleetSchoolShuttles() {
  return request<FleetServiceResponse[]>("/fleet/school-shuttles", { method: "GET" });
}

export async function createFleetSchoolShuttle(input: FleetCreateServiceInput) {
  const created = await request<FleetServiceResponse>("/fleet/school-shuttles", {
    method: "POST",
    body: input,
  });
  await syncFleetWorkspaceState();
  return created;
}

export async function listFleetShuttleRoutes() {
  return request<Array<Record<string, unknown>>>("/fleet/school-shuttles/routes", { method: "GET" });
}

export async function createFleetShuttleRoute(input: Record<string, unknown>) {
  return request<Record<string, unknown>>("/fleet/school-shuttles/routes", {
    method: "POST",
    body: input,
  });
}

export async function listFleetShuttleStudents() {
  return request<Array<Record<string, unknown>>>("/fleet/school-shuttles/students", { method: "GET" });
}

export async function createFleetShuttleStudent(input: Record<string, unknown>) {
  return request<Record<string, unknown>>("/fleet/school-shuttles/students", {
    method: "POST",
    body: input,
  });
}

export async function getFleetShuttleStudent(studentId: string) {
  return request<Record<string, unknown>>(`/fleet/school-shuttles/students/${studentId}`, { method: "GET" });
}

export async function patchFleetShuttleStudent(studentId: string, input: Record<string, unknown>) {
  return request<Record<string, unknown>>(`/fleet/school-shuttles/students/${studentId}`, {
    method: "PATCH",
    body: input,
  });
}

export async function listFleetShuttleAttendance(studentId?: string) {
  const search = new URLSearchParams();
  if (studentId) search.set("studentId", studentId);
  const suffix = search.toString() ? `?${search.toString()}` : "";
  return request<Array<Record<string, unknown>>>(`/fleet/school-shuttles/attendance${suffix}`, { method: "GET" });
}

export async function listFleetShuttleFeedback() {
  return request<Array<Record<string, unknown>>>("/fleet/school-shuttles/feedback", { method: "GET" });
}

export async function createFleetShuttleFeedback(input: Record<string, unknown>) {
  return request<Record<string, unknown>>("/fleet/school-shuttles/feedback", {
    method: "POST",
    body: input,
  });
}

export async function getFleetTourById(tourId: string) {
  return request<FleetServiceResponse>(`/fleet/tours/${tourId}`, { method: "GET" });
}

export async function listFleetTourMessages(tourId: string) {
  return request<Array<Record<string, unknown>>>(`/fleet/tours/${tourId}/messages`, { method: "GET" });
}

export async function createFleetTourMessage(
  tourId: string,
  input: Partial<{ sender: string; text: string; isOwn: boolean }>
) {
  return request<Record<string, unknown>>(`/fleet/tours/${tourId}/messages`, {
    method: "POST",
    body: input,
  });
}

export async function listFleetShuttleTrips() {
  return request<Array<Record<string, unknown>>>("/fleet/school-shuttles/trips", { method: "GET" });
}

export async function createFleetShuttleTrip(input: Record<string, unknown>) {
  return request<Record<string, unknown>>("/fleet/school-shuttles/trips", {
    method: "POST",
    body: input,
  });
}

export async function listFleetShuttleAttendants() {
  return request<Array<Record<string, unknown>>>("/fleet/school-shuttles/attendants", { method: "GET" });
}

export async function createFleetShuttleAttendant(input: Record<string, unknown>) {
  return request<Record<string, unknown>>("/fleet/school-shuttles/attendants", {
    method: "POST",
    body: input,
  });
}

export async function createFleetShuttleAttendance(input: Record<string, unknown>) {
  return request<Record<string, unknown>>("/fleet/school-shuttles/attendance", {
    method: "POST",
    body: input,
  });
}

export async function listFleetComplianceIncidents() {
  return request<FleetIncidentResponse[]>("/fleet/compliance/incidents", { method: "GET" });
}

export async function createFleetComplianceIncident(input: FleetCreateComplianceIncidentInput) {
  const created = await request<FleetIncidentResponse>("/fleet/compliance/incidents", {
    method: "POST",
    body: input,
  });
  await syncFleetWorkspaceState();
  return created;
}

export async function refreshFleetWorkspaceState() {
  if (!isFleetBackendEnabled() || !readFleetBackendAccessToken()) {
    return;
  }
  await syncFleetWorkspaceState();
}

export async function listFleetRiderServices(query?: {
  serviceType?: "rental" | "tour" | "ambulance";
  status?: string;
}): Promise<FleetRiderServiceResponse[]> {
  const search = new URLSearchParams();
  if (query?.serviceType) search.set("serviceType", query.serviceType);
  if (query?.status) search.set("status", query.status);
  const suffix = search.toString() ? `?${search.toString()}` : "";
  return request<FleetRiderServiceResponse[]>(`/fleet/rider-services${suffix}`, { method: "GET" });
}

export function getCachedFleetDrivers() {
  return readStorage<any[]>("drivers", []);
}

export async function listFleetVehicles() {
  if (!isFleetBackendEnabled() || !readFleetBackendAccessToken()) {
    return getCachedFleetVehicles();
  }

  const vehicles = await request<FleetVehicleResponse[]>("/fleet/vehicles");
  const mappedVehicles = vehicles.map((vehicle, index) => ({
    id: vehicle.id,
    backendId: vehicle.id,
    plate: vehicle.plate ?? vehicle.licensePlate ?? "-",
    model: `${vehicle.make} ${vehicle.model}`.trim(),
    status: vehicleStatus(vehicle.status),
    opsStatus: vehicle.status === "active" ? "ready" : "unavailable",
    driver: "-",
    mileage: 0,
    vehicleType: vehicle.type,
    soc: 50,
    estimatedRange: 200,
    lastSeen: "recently",
    zone: "Fleet",
    condition: "good",
    compliance: {
      insurance: { status: "ok", expiry: "" },
      inspection: { status: "ok", expiry: "" },
    },
    sortOrder: index,
  }));

  writeStorage("vehicles", mappedVehicles);
  return mappedVehicles;
}

export function getCachedFleetVehicles() {
  return readStorage<any[]>("vehicles", []);
}

export function getCachedFleetDispatches() {
  return readStorage<any[]>("dispatches", []);
}

export function getCachedFleetRentals() {
  return readStorage<any[]>("rentals", []);
}

export function getCachedFleetIncidents() {
  return readStorage<any[]>("incidents", []);
}

export function createFallbackFleetDriver(input: FleetCreateDriverInput) {
  const existing = getCachedFleetDrivers();
  const next = {
    id: Date.now(),
    backendId: undefined,
    name: input.fullName.trim(),
    fullName: input.fullName.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    status: "available",
    trips: 0,
    rating: 5,
    cancelRate: 0,
    lastSeen: "just now",
    zone: input.city ?? "Unassigned",
    vehicle: "-",
    docsStatus: "ok",
  };
  writeStorage("drivers", [next, ...existing]);
  return next;
}

export function createFallbackFleetVehicle(input: FleetCreateVehicleInput & Partial<{ color: string; vin: string; registrationExpiry: string }>) {
  const existing = getCachedFleetVehicles();
  const next = {
    id: Date.now(),
    backendId: undefined,
    plate: input.plate.trim(),
    licensePlate: input.plate.trim(),
    model: `${input.make} ${input.model}`.trim(),
    make: input.make.trim(),
    year: input.year,
    color: input.color ?? "",
    vin: input.vin ?? "",
    registrationExpiry: input.registrationExpiry ?? "",
    status: input.status === "maintenance" ? "maintenance" : "available",
    opsStatus: input.status === "active" || !input.status ? "ready" : "unavailable",
    driver: "-",
    mileage: 0,
    vehicleType: input.type,
    soc: 50,
    estimatedRange: 200,
    lastSeen: "just now",
    zone: "Fleet",
    condition: "good",
    compliance: {
      insurance: { status: "ok", expiry: "" },
      inspection: { status: "ok", expiry: "" },
    },
  };
  writeStorage("vehicles", [next, ...existing]);
  return next;
}

export function createFallbackFleetComplianceIncident(input: FleetCreateComplianceIncidentInput & Partial<{ vehicle: string; driver: string }>) {
  const existing = getCachedFleetIncidents();
  const next = {
    id: Date.now(),
    backendId: undefined,
    incidentId: `INC-${String(existing.length + 1).padStart(3, "0")}` ,
    type: input.category,
    vehicle: input.vehicle ?? "Unassigned",
    driver: input.driver ?? "Unassigned",
    date: new Date().toISOString().slice(0, 10),
    severity: input.severity,
    status: "open",
    description: input.description,
  };
  writeStorage("incidents", [next, ...existing]);
  return next;
}
