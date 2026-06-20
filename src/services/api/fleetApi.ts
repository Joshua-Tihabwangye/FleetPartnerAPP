import { request, configureHttpClientAuth } from "./httpClient";
import { ALLOW_CACHE_FALLBACK, SOCKET_BASE_URL, SOCKET_PATH, getBackendEnabled } from "./config";
import { auth } from "../../utils/auth";
import { io, type Socket } from "socket.io-client";

// ------------------------------------------------------------------
// Backend-aligned response types
// ------------------------------------------------------------------

type BackendFleetProfile = {
  fleetAccountId?: string;
  companyName?: string;
  contactEmail?: string | null;
  contactPhone?: string | null;
  registrationNumber?: string | null;
  taxId?: string | null;
  id?: string;
  name?: string;
  code?: string | null;
  status?: string;
  currency?: string;
  monthlySpendLimit?: number | null;
  dailySpendLimit?: number | null;
  metadata?: Record<string, unknown> | null;
  _count?: {
    branches: number;
    drivers: number;
    vehicles: number;
    dispatches: number;
  };
  createdAt?: string | number | Date;
  updatedAt?: string | number | Date;
};

type BackendFleetBranch = {
  id: string;
  name: string;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  phone?: string | null;
  managerName?: string | null;
  operatingHours?: string | null;
  fleetAccountId?: string | null;
  createdAt?: string | number | Date;
  updatedAt?: string | number | Date;
};

type BackendFleetDriver = {
  id: string;
  displayName: string;
  email?: string | null;
  phone?: string | null;
  status?: string;
  externalRef?: string | null;
  fleetAccountId?: string;
  groupId?: string | null;
  userId?: string | null;
  tokens?: Array<{
    id: string;
    tokenUid: string;
    tokenType?: string;
    status?: string;
  }>;
  createdAt?: string | number | Date;
  updatedAt?: string | number | Date;
};

type BackendFleetVehicle = {
  id: string;
  make: string;
  model: string;
  vehicleName?: string;
  licensePlate?: string;
  yearOfManufacture?: number;
  powertrain?: string;
  vehicleStatus?: string;
  isActive?: boolean;
  fleetAccountId?: string | null;
  fleetDriverId?: string | null;
  fleetDriverGroupId?: string | null;
  color?: string | null;
  vin?: string | null;
  countryOfRegistration?: string | null;
  bodyType?: string | null;
  connectors?: string[];
  batteryKwh?: number | null;
  acMaxKw?: number | null;
  dcMaxKw?: number | null;
  createdAt?: string | number | Date;
  updatedAt?: string | number | Date;
};

type BackendFleetDispatch = {
  id: string;
  driverId?: string | null;
  vehicleId?: string | null;
  pickup?: { address?: string } | string | null;
  dropoff?: { address?: string } | string | null;
  status?: string;
  type?: string | null;
  notes?: string | null;
  createdAt?: string | number | Date;
  updatedAt?: string | number | Date;
};

type BackendFleetServiceOrder = {
  id: string;
  serviceType?: "RENTAL" | "TOUR" | "SCHOOL_SHUTTLE";
  status?: string;
  customerName: string;
  assetId?: string | null;
  scheduledAt: string | number | Date;
  notes?: string | null;
  createdAt?: string | number | Date;
  updatedAt?: string | number | Date;
};

type BackendFleetIncident = {
  id: string;
  category: string;
  severity?: string;
  status?: string;
  description: string;
  createdAt: string | number | Date;
  reporterId?: string;
  vehicleId?: string | null;
  driverId?: string | null;
  fleetAccountId?: string | null;
};

type BackendFleetTraining = {
  id: string;
  title: string;
  status?: "draft" | "published" | "archived";
  assignedTo?: string | null;
  createdAt?: string | number | Date;
  updatedAt?: string | number | Date;
};

type BackendFleetNotification = {
  id: string;
  title: string;
  message: string;
  read?: boolean;
  createdAt: string | number | Date;
};

type BackendFleetPayout = {
  id: string;
  amount: number;
  currency: string;
  status?: "pending" | "processing" | "paid";
  createdAt: string | number | Date;
};

type BackendFleetEarningsSummary = {
  totalEarnings: number;
  totalTrips: number;
  totalDrivers: number;
  currency: string;
};

// Frontend-facing types (kept stable for pages)

export type FleetProfileResponse = {
  fleetId: string;
  companyName: string;
  contactEmail: string;
  contactPhone: string;
  registrationNumber?: string;
  taxId?: string;
};

export type FleetBranchResponse = {
  id: string;
  name: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  managerName?: string;
  operatingHours?: string;
};

export type FleetDriverResponse = {
  driverId: string;
  fullName: string;
  phone: string;
  city?: string;
  status: "available" | "on-trip" | "offline" | "suspended";
  branchId?: string;
};

export type FleetVehicleResponse = {
  id: string;
  make: string;
  model: string;
  plate?: string;
  licensePlate?: string;
  type: string;
  status: "available" | "offline" | "maintenance" | "out-of-service";
};

export type FleetDispatchResponse = {
  id: string;
  driverId?: string;
  vehicleId?: string;
  pickup: string;
  dropoff: string;
  status: "pending" | "assigned" | "completed" | "cancelled";
};

export type FleetServiceResponse = {
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

export type FleetTrainingResponse = {
  id: string;
  title: string;
  status: "draft" | "published" | "archived";
  assignedTo?: string;
};

export type FleetNotificationResponse = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: number;
};

export type FleetPayoutResponse = {
  id: string;
  amount: number;
  currency: string;
  status: "pending" | "processing" | "paid";
  createdAt: number;
};

export type FleetEarningsSummaryResponse = {
  totalEarnings: number;
  totalTrips: number;
  totalDrivers: number;
  currency: string;
};

// ------------------------------------------------------------------
// Auth / socket bootstrap
// ------------------------------------------------------------------

export function isFleetBackendEnabled(): boolean {
  return getBackendEnabled() && auth.isAuthenticated();
}

configureHttpClientAuth({
  getAccessToken: () => auth.getAccessToken(),
  getRefreshToken: () => auth.getRefreshToken(),
  setTokens: () => {
    // Tokens are managed by the OIDC user manager; no-op here.
  },
  clearSession: () => {
    void auth.logout();
  },
  refresh: async () => {
    const user = await auth.signinSilent();
    if (!user?.access_token) {
      throw new Error("Session expired");
    }
    return {
      accessToken: user.access_token,
      refreshToken: user.refresh_token ?? "",
    };
  },
  onUnauthorized: () => {
    void auth.logout();
  },
});

export function createFleetSocket(): Socket {
  return io(`${SOCKET_BASE_URL}/fleet`, {
    path: SOCKET_PATH,
    transports: ["websocket"],
    autoConnect: false,
    withCredentials: false,
    auth: {
      token: auth.getAccessToken() ?? undefined,
    },
  });
}

// ------------------------------------------------------------------
// Storage helpers
// ------------------------------------------------------------------

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

const FLEET_ACCOUNT_ID_KEY = "fleet_account_id";

function setFleetAccountId(id: string) {
  writeStorage(FLEET_ACCOUNT_ID_KEY, id);
}

export function getFleetAccountId(): string | null {
  return readStorage<string | null>(FLEET_ACCOUNT_ID_KEY, null);
}

// ------------------------------------------------------------------
// Status / field mapping helpers
// ------------------------------------------------------------------

function toUpperStatus(status?: string): string | undefined {
  if (!status) return undefined;
  return status.trim().toUpperCase();
}

function toLowerStatus(status?: string): string | undefined {
  if (!status) return undefined;
  return status.trim().toLowerCase();
}

export function toFrontendDriverStatus(status?: string): FleetDriverResponse["status"] {
  switch (status?.trim().toUpperCase()) {
    case "ACTIVE":
      return "available";
    case "SUSPENDED":
      return "suspended";
    case "INACTIVE":
    default:
      return "offline";
  }
}

export function toBackendDriverStatus(status?: string): BackendFleetDriver["status"] {
  switch (status?.trim().toLowerCase()) {
    case "available":
    case "active":
      return "ACTIVE";
    case "suspended":
      return "SUSPENDED";
    case "offline":
    case "invited":
    case "inactive":
    default:
      return "INACTIVE";
  }
}

export function toFrontendVehicleStatus(status?: string): FleetVehicleResponse["status"] {
  switch (status?.trim().toUpperCase()) {
    case "ACTIVE":
      return "available";
    case "MAINTENANCE":
      return "maintenance";
    case "RETIRED":
      return "out-of-service";
    case "INACTIVE":
    default:
      return "offline";
  }
}

export function toBackendVehicleStatus(status?: string): BackendFleetVehicle["vehicleStatus"] {
  switch (status?.trim().toLowerCase()) {
    case "available":
    case "active":
      return "ACTIVE";
    case "maintenance":
      return "MAINTENANCE";
    case "out-of-service":
      return "RETIRED";
    case "offline":
    case "inactive":
    default:
      return "INACTIVE";
  }
}

export function toFrontendDispatchStatus(status?: string): FleetDispatchResponse["status"] {
  switch (status?.trim().toUpperCase()) {
    case "ASSIGNED":
      return "assigned";
    case "COMPLETED":
      return "completed";
    case "CANCELLED":
      return "cancelled";
    case "PENDING":
    default:
      return "pending";
  }
}

export function toBackendDispatchStatus(status?: string): BackendFleetDispatch["status"] {
  switch (status?.trim().toLowerCase()) {
    case "assigned":
      return "ASSIGNED";
    case "completed":
      return "COMPLETED";
    case "cancelled":
      return "CANCELLED";
    case "pending":
    default:
      return "PENDING";
  }
}

export function toFrontendServiceStatus(status?: string): FleetServiceResponse["status"] {
  switch (status?.trim().toUpperCase()) {
    case "ACTIVE":
      return "active";
    case "COMPLETED":
      return "completed";
    case "CANCELLED":
      return "cancelled";
    case "PENDING":
    default:
      return "pending";
  }
}

export function toBackendServiceStatus(status?: string): BackendFleetServiceOrder["status"] {
  switch (status?.trim().toLowerCase()) {
    case "active":
      return "ACTIVE";
    case "completed":
      return "COMPLETED";
    case "cancelled":
      return "CANCELLED";
    case "pending":
    default:
      return "PENDING";
  }
}

function toFrontendSeverity(severity?: string): FleetIncidentResponse["severity"] {
  switch (severity?.trim().toUpperCase()) {
    case "MEDIUM":
      return "medium";
    case "HIGH":
      return "high";
    case "CRITICAL":
      return "critical";
    case "LOW":
    default:
      return "low";
  }
}

function toBackendSeverity(severity?: FleetIncidentResponse["severity"]): BackendFleetIncident["severity"] {
  if (!severity) return undefined;
  return severity.toUpperCase() as BackendFleetIncident["severity"];
}

function toFrontendIncidentStatus(status?: string): FleetIncidentResponse["status"] {
  switch (status?.trim().toUpperCase()) {
    case "INVESTIGATING":
      return "investigating";
    case "RESOLVED":
      return "resolved";
    case "OPEN":
    default:
      return "open";
  }
}

function toBackendIncidentStatus(status?: FleetIncidentResponse["status"]): BackendFleetIncident["status"] {
  if (!status) return undefined;
  return status.toUpperCase() as BackendFleetIncident["status"];
}

function readAddress(value?: { address?: string } | string | null): string {
  if (!value) return "-";
  if (typeof value === "string") return value || "-";
  return value.address || "-";
}

function wrapAddress(value?: string): { address: string } | undefined {
  if (!value || !value.trim()) return undefined;
  return { address: value.trim() };
}

function stringifyOperatingHours(value?: Record<string, unknown> | string): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "string") return value.trim() || undefined;
  return JSON.stringify(value);
}

function parseOperatingHours(value?: string | null): string {
  if (!value) return "";
  return value;
}

function safeDateString(value?: string | number | Date | null): string {
  if (!value) return "";
  try {
    const date = typeof value === "number" ? new Date(value) : new Date(value);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 10);
  } catch {
    return "";
  }
}

function safeTimestamp(value?: string | number | Date | null): number {
  if (!value) return 0;
  try {
    const date = typeof value === "number" ? new Date(value) : new Date(value);
    return isNaN(date.getTime()) ? 0 : date.getTime();
  } catch {
    return 0;
  }
}

// ------------------------------------------------------------------
// Workspace sync
// ------------------------------------------------------------------

export async function syncFleetWorkspaceState(): Promise<void> {
  if (typeof window === "undefined" || !getBackendEnabled() || !auth.getAccessToken()) {
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
    request<BackendFleetProfile>("/fleet/me/profile"),
    request<BackendFleetBranch[]>("/fleet/me/branches"),
    request<BackendFleetDriver[]>("/fleet/drivers"),
    request<BackendFleetVehicle[]>("/fleet/vehicles"),
    request<BackendFleetDispatch[]>("/fleet/dispatches"),
    request<BackendFleetServiceOrder[]>("/fleet/rentals"),
    request<BackendFleetServiceOrder[]>("/fleet/tours"),
    request<BackendFleetServiceOrder[]>("/fleet/school-shuttles"),
    request<BackendFleetIncident[]>("/fleet/compliance/incidents"),
    request<BackendFleetTraining[]>("/fleet/compliance/training-courses"),
    request<BackendFleetNotification[]>("/fleet/me/notifications"),
    request<BackendFleetPayout[]>("/fleet/earnings/payouts"),
    request<BackendFleetEarningsSummary>("/fleet/earnings/summary"),
  ]);

  if (profile?.fleetAccountId) {
    setFleetAccountId(profile.fleetAccountId);
  }

  const vehicleById = new Map(vehicles.map((vehicle) => [vehicle.id, vehicle]));
  const driverById = new Map(drivers.map((driver) => [driver.id, driver]));

  writeStorage("fleet_partner_profile", {
    fleetId: profile?.fleetAccountId ?? profile?.id ?? "",
    companyName: profile?.companyName ?? profile?.name ?? "",
    contactEmail: profile?.contactEmail ?? "",
    contactPhone: profile?.contactPhone ?? "",
    registrationNumber: profile?.registrationNumber ?? "",
    taxId: profile?.taxId ?? "",
  } satisfies FleetProfileResponse);

  writeStorage("branches", branches.map((branch, index) => ({
    id: index + 1,
    backendId: branch.id,
    name: branch.name,
    address: branch.address ?? "",
    phone: branch.phone ?? "",
    manager: branch.managerName ?? "Unassigned",
    email: profile?.contactEmail ?? "",
    isActive: true,
  })));

  writeStorage("drivers", drivers.map((driver, index) => ({
    id: index + 1,
    backendId: driver.id,
    name: driver.displayName,
    phone: driver.phone ?? "-",
    status: toFrontendDriverStatus(driver.status),
    trips: 0,
    rating: 4.8,
    cancelRate: 0,
    lastSeen: "recently",
    zone: "Unassigned",
    vehicle: "-",
    docsStatus: "ok",
  })));

  writeStorage("vehicles", vehicles.map((vehicle, index) => ({
    id: index + 1,
    backendId: vehicle.id,
    plate: vehicle.licensePlate ?? "-",
    model: `${vehicle.make} ${vehicle.model}`.trim(),
    status: toFrontendVehicleStatus(vehicle.vehicleStatus),
    opsStatus: vehicle.vehicleStatus === "ACTIVE" || vehicle.isActive ? "ready" : "unavailable",
    driver: vehicle.fleetDriverId ? driverById.get(vehicle.fleetDriverId)?.displayName ?? "-" : "-",
    mileage: 0,
    vehicleType: vehicle.bodyType ?? "Unknown",
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
    pickup: readAddress(dispatch.pickup),
    dropoff: readAddress(dispatch.dropoff),
    vehicle: dispatch.vehicleId ? vehicleById.get(dispatch.vehicleId)?.licensePlate ?? "-" : "-",
    driver: dispatch.driverId ? driverById.get(dispatch.driverId)?.displayName ?? "-" : "-",
    fare: "0",
    status: toFrontendDispatchStatus(dispatch.status),
  })));

  writeStorage("rentals", rentals.map((rental, index) => {
    const frontendStatus = toFrontendServiceStatus(rental.status);
    const rentalStatus = frontendStatus === "pending" ? "upcoming" : frontendStatus;
    return {
      id: index + 1,
      backendId: rental.id,
      bookingId: `RNT-${String(index + 1).padStart(3, "0")}`,
      customerName: rental.customerName,
      vehicleName: rental.assetId ? vehicleById.get(rental.assetId)?.licensePlate ?? "Fleet vehicle" : "Fleet vehicle",
      vehiclePlate: rental.assetId ? vehicleById.get(rental.assetId)?.licensePlate ?? "-" : "-",
      status: rentalStatus,
      startDate: safeDateString(rental.scheduledAt),
      endDate: safeDateString(rental.scheduledAt),
    };
  }));

  writeStorage("tours", tours.map((tour, index) => ({
    id: index + 1,
    backendId: tour.id,
    name: tour.customerName,
    vehicle: tour.assetId ? vehicleById.get(tour.assetId)?.licensePlate ?? "-" : "-",
    status: toFrontendServiceStatus(tour.status) === "pending" ? "scheduled" : toFrontendServiceStatus(tour.status),
    bookings: 0,
    capacity: 20,
  })));

  writeStorage("shuttle_routes", shuttles.map((shuttle, index) => ({
    id: index + 1,
    backendId: shuttle.id,
    name: shuttle.customerName,
    status: toFrontendServiceStatus(shuttle.status),
    bus: shuttle.assetId ? vehicleById.get(shuttle.assetId)?.licensePlate ?? "-" : "-",
    scheduleDate: safeDateString(shuttle.scheduledAt),
  })));

  writeStorage("incidents", incidents.map((incident, index) => ({
    id: index + 1,
    backendId: incident.id,
    incidentId: `INC-${String(index + 1).padStart(3, "0")}`,
    type: incident.category,
    vehicle: incident.vehicleId ? vehicleById.get(incident.vehicleId)?.licensePlate ?? "-" : "-",
    driver: incident.driverId ? driverById.get(incident.driverId)?.displayName ?? "-" : "-",
    date: safeDateString(incident.createdAt),
    severity: toFrontendSeverity(incident.severity),
    status: toFrontendIncidentStatus(incident.status),
    description: incident.description,
  })));

  writeStorage("training_courses", trainingCourses);
  writeStorage("notifications", notifications.map((item) => ({
    id: item.id,
    title: item.title,
    message: item.message,
    time: new Date(safeTimestamp(item.createdAt)).toISOString(),
    read: item.read ?? false,
    type: "system",
    link: "/dashboard",
  })));
  writeStorage("fleet_payouts", payouts);
  writeStorage("fleet_earnings_summary", earningsSummary);
}


// ------------------------------------------------------------------
// Input types
// ------------------------------------------------------------------

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
  color?: string;
  vin?: string;
  registrationExpiry?: string;
  powertrain?: "BEV" | "PHEV" | "HEV" | "ICE";
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

export type FleetUpsertBranchInput = {
  name: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  managerName?: string;
  operatingHours?: string;
};

export type FleetPatchBranchInput = Partial<FleetUpsertBranchInput>;

// ------------------------------------------------------------------
// Profile
// ------------------------------------------------------------------

export async function getFleetProfile() {
  return request<FleetProfileResponse>("/fleet/me/profile", { method: "GET" });
}

export async function patchFleetProfile(input: Partial<{
  companyName: string;
  contactEmail: string;
  contactPhone: string;
  registrationNumber: string;
  taxId: string;
  name: string;
  code: string;
  status: string;
  currency: string;
  monthlySpendLimit: number;
  dailySpendLimit: number;
  metadata: Record<string, unknown>;
}>) {
  const body: Record<string, unknown> = {
    companyName: input.companyName,
    contactEmail: input.contactEmail,
    contactPhone: input.contactPhone,
    registrationNumber: input.registrationNumber,
    taxId: input.taxId,
  };
  if (input.name !== undefined) body.name = input.name;
  if (input.code !== undefined) body.code = input.code;
  if (input.status !== undefined) body.status = toUpperStatus(input.status);
  if (input.currency !== undefined) body.currency = input.currency;
  if (input.monthlySpendLimit !== undefined) body.monthlySpendLimit = input.monthlySpendLimit;
  if (input.dailySpendLimit !== undefined) body.dailySpendLimit = input.dailySpendLimit;
  if (input.metadata !== undefined) body.metadata = input.metadata;

  const updated = await request<BackendFleetProfile>("/fleet/me/profile", {
    method: "PATCH",
    body,
  });
  await syncFleetWorkspaceState();
  return {
    fleetId: updated?.fleetAccountId ?? updated?.id ?? "",
    companyName: updated?.companyName ?? updated?.name ?? "",
    contactEmail: updated?.contactEmail ?? "",
    contactPhone: updated?.contactPhone ?? "",
    registrationNumber: updated?.registrationNumber ?? "",
    taxId: updated?.taxId ?? "",
  } as FleetProfileResponse;
}

// ------------------------------------------------------------------
// Branches
// ------------------------------------------------------------------

export async function listFleetBranches() {
  return request<FleetBranchResponse[]>("/fleet/me/branches", { method: "GET" });
}

export async function getFleetBranch(branchId: string) {
  const branch = await request<BackendFleetBranch>(`/fleet/me/branches/${branchId}`, { method: "GET" });
  return {
    id: branch.id,
    name: branch.name,
    address: branch.address ?? "",
    city: branch.city ?? "",
    country: branch.country ?? "",
    phone: branch.phone ?? "",
    managerName: branch.managerName ?? "",
    operatingHours: parseOperatingHours(branch.operatingHours),
  } as FleetBranchResponse;
}

export async function createFleetBranch(input: FleetUpsertBranchInput) {
  const body: Record<string, unknown> = {
    name: input.name.trim(),
    address: input.address?.trim(),
    city: input.city?.trim(),
    country: input.country?.trim(),
    phone: input.phone?.trim(),
    managerName: input.managerName?.trim(),
    operatingHours: stringifyOperatingHours(input.operatingHours),
  };

  const created = await request<BackendFleetBranch>("/fleet/me/branches", {
    method: "POST",
    body,
  });
  await syncFleetWorkspaceState();
  return {
    id: created.id,
    name: created.name,
    address: created.address ?? "",
    city: created.city ?? "",
    country: created.country ?? "",
    phone: created.phone ?? "",
    managerName: created.managerName ?? "",
    operatingHours: parseOperatingHours(created.operatingHours),
  } as FleetBranchResponse;
}

export async function patchFleetBranch(branchId: string, patch: FleetPatchBranchInput) {
  const body: Record<string, unknown> = {};
  if (patch.name !== undefined) body.name = patch.name.trim();
  if (patch.address !== undefined) body.address = patch.address?.trim();
  if (patch.city !== undefined) body.city = patch.city?.trim();
  if (patch.country !== undefined) body.country = patch.country?.trim();
  if (patch.phone !== undefined) body.phone = patch.phone?.trim();
  if (patch.managerName !== undefined) body.managerName = patch.managerName?.trim();
  if (patch.operatingHours !== undefined) body.operatingHours = stringifyOperatingHours(patch.operatingHours);

  const updated = await request<BackendFleetBranch>(`/fleet/me/branches/${branchId}`, {
    method: "PATCH",
    body,
  });
  await syncFleetWorkspaceState();
  return {
    id: updated.id,
    name: updated.name,
    address: updated.address ?? "",
    city: updated.city ?? "",
    country: updated.country ?? "",
    phone: updated.phone ?? "",
    managerName: updated.managerName ?? "",
    operatingHours: parseOperatingHours(updated.operatingHours),
  } as FleetBranchResponse;
}

export async function deleteFleetBranch(branchId: string) {
  const deleted = await request<{ deleted: boolean }>(`/fleet/me/branches/${branchId}`, {
    method: "DELETE",
  });
  await syncFleetWorkspaceState();
  return deleted;
}

// ------------------------------------------------------------------
// Drivers
// ------------------------------------------------------------------

export async function createFleetDriver(input: FleetCreateDriverInput) {
  const fleetAccountId = getFleetAccountId();
  if (!fleetAccountId) {
    throw new Error("Fleet account is not initialized. Please refresh the page.");
  }

  const created = await request<BackendFleetDriver>("/fleet/drivers", {
    method: "POST",
    body: {
      fleetAccountId,
      displayName: input.fullName.trim(),
      email: input.email.trim(),
      phone: input.phone.trim(),
      status: toBackendDriverStatus("active"),
      metadata: {
        city: input.city,
        country: input.country,
        serviceModes: input.serviceModes,
        branchId: input.branchId,
      },
    },
  });
  await syncFleetWorkspaceState();
  return {
    driverId: created.id,
    fullName: created.displayName,
    phone: created.phone ?? "",
    status: toFrontendDriverStatus(created.status),
  } as FleetDriverResponse;
}

export async function patchFleetDriver(driverId: string, patch: FleetUpdateDriverInput) {
  const body: Record<string, unknown> = {};
  if (patch.fullName !== undefined) body.displayName = patch.fullName.trim();
  if (patch.email !== undefined) body.email = patch.email.trim();
  if (patch.phone !== undefined) body.phone = patch.phone.trim();
  if (patch.status !== undefined) body.status = toBackendDriverStatus(patch.status);

  const updated = await request<BackendFleetDriver>(`/fleet/drivers/${driverId}`, {
    method: "PATCH",
    body,
  });
  await syncFleetWorkspaceState();
  return {
    driverId: updated.id,
    fullName: updated.displayName,
    phone: updated.phone ?? "",
    status: toFrontendDriverStatus(updated.status),
  } as FleetDriverResponse;
}

// ------------------------------------------------------------------
// Vehicles
// ------------------------------------------------------------------

export async function createFleetVehicle(input: FleetCreateVehicleInput) {
  const fleetAccountId = getFleetAccountId();
  const userId = auth.getUserId();
  if (!fleetAccountId) {
    throw new Error("Fleet account is not initialized. Please refresh the page.");
  }
  if (!userId) {
    throw new Error("User identity is not available. Please sign in again.");
  }

  const created = await request<BackendFleetVehicle>("/fleet/vehicles", {
    method: "POST",
    body: {
      userId,
      fleetAccountId,
      vehicleName: `${input.make.trim()} ${input.model.trim()}`.trim(),
      make: input.make.trim(),
      model: input.model.trim(),
      yearOfManufacture: input.year,
      licensePlate: input.plate.trim(),
      powertrain: input.powertrain ?? "BEV",
      vehicleStatus: toBackendVehicleStatus(input.status ?? "active"),
      color: input.color,
      vin: input.vin,
      bodyType: input.type,
    },
  });
  await syncFleetWorkspaceState();
  return {
    id: created.id,
    make: created.make,
    model: created.model,
    plate: created.licensePlate,
    licensePlate: created.licensePlate,
    type: created.bodyType ?? input.type,
    status: toFrontendVehicleStatus(created.vehicleStatus),
  } as FleetVehicleResponse;
}

export async function patchFleetVehicle(vehicleId: string, patch: FleetUpdateVehicleInput) {
  const body: Record<string, unknown> = {};
  if (patch.make !== undefined) body.make = patch.make.trim();
  if (patch.model !== undefined) body.model = patch.model.trim();
  if (patch.year !== undefined) body.yearOfManufacture = patch.year;
  if (patch.plate !== undefined) body.licensePlate = patch.plate.trim();
  if (patch.type !== undefined) body.bodyType = patch.type;
  if (patch.status !== undefined) body.vehicleStatus = toBackendVehicleStatus(patch.status);
  if (patch.powertrain !== undefined) body.powertrain = patch.powertrain;
  if (patch.color !== undefined) body.color = patch.color;
  if (patch.vin !== undefined) body.vin = patch.vin;

  const updated = await request<BackendFleetVehicle>(`/fleet/vehicles/${vehicleId}`, {
    method: "PATCH",
    body,
  });
  await syncFleetWorkspaceState();
  return {
    id: updated.id,
    make: updated.make,
    model: updated.model,
    plate: updated.licensePlate,
    licensePlate: updated.licensePlate,
    type: updated.bodyType ?? patch.type ?? "",
    status: toFrontendVehicleStatus(updated.vehicleStatus),
  } as FleetVehicleResponse;
}

// ------------------------------------------------------------------
// Dispatches
// ------------------------------------------------------------------

export async function createFleetDispatch(input: FleetCreateDispatchInput) {
  const created = await request<BackendFleetDispatch>("/fleet/dispatches", {
    method: "POST",
    body: {
      pickup: wrapAddress(input.pickup),
      dropoff: wrapAddress(input.dropoff),
      driverId: input.driverId,
      vehicleId: input.vehicleId,
      type: input.type,
      notes: input.notes,
    },
  });
  await syncFleetWorkspaceState();
  return {
    id: created.id,
    driverId: created.driverId ?? undefined,
    vehicleId: created.vehicleId ?? undefined,
    pickup: readAddress(created.pickup),
    dropoff: readAddress(created.dropoff),
    status: toFrontendDispatchStatus(created.status),
  } as FleetDispatchResponse;
}

// ------------------------------------------------------------------
// Service orders (rentals / tours / shuttles)
// ------------------------------------------------------------------

export async function listFleetRentals() {
  return request<FleetServiceResponse[]>("/fleet/rentals", { method: "GET" });
}

export async function createFleetRental(input: FleetCreateServiceInput) {
  const created = await request<BackendFleetServiceOrder>("/fleet/rentals", {
    method: "POST",
    body: {
      customerName: input.customerName,
      assetId: input.assetId,
      scheduledAt: new Date(input.scheduledAt).toISOString(),
      notes: input.notes,
    },
  });
  await syncFleetWorkspaceState();
  return {
    id: created.id,
    service: "rental" as const,
    status: toFrontendServiceStatus(created.status),
    customerName: created.customerName,
    assetId: created.assetId ?? undefined,
    scheduledAt: safeTimestamp(created.scheduledAt),
    notes: created.notes ?? undefined,
  } as FleetServiceResponse;
}

export async function listFleetTours() {
  return request<FleetServiceResponse[]>("/fleet/tours", { method: "GET" });
}

export async function createFleetTour(input: FleetCreateServiceInput) {
  const created = await request<BackendFleetServiceOrder>("/fleet/tours", {
    method: "POST",
    body: {
      customerName: input.customerName,
      assetId: input.assetId,
      scheduledAt: new Date(input.scheduledAt).toISOString(),
      notes: input.notes,
    },
  });
  await syncFleetWorkspaceState();
  return {
    id: created.id,
    service: "tour" as const,
    status: toFrontendServiceStatus(created.status),
    customerName: created.customerName,
    assetId: created.assetId ?? undefined,
    scheduledAt: safeTimestamp(created.scheduledAt),
    notes: created.notes ?? undefined,
  } as FleetServiceResponse;
}

export async function patchFleetTour(
  tourId: string,
  patch: Partial<{ customerName: string; assetId: string; scheduledAt: number; notes: string; status: string }>
) {
  const body: Record<string, unknown> = {};
  if (patch.customerName !== undefined) body.customerName = patch.customerName;
  if (patch.assetId !== undefined) body.assetId = patch.assetId;
  if (patch.scheduledAt !== undefined) body.scheduledAt = new Date(patch.scheduledAt).toISOString();
  if (patch.notes !== undefined) body.notes = patch.notes;
  if (patch.status !== undefined) body.status = toBackendServiceStatus(patch.status);

  const updated = await request<BackendFleetServiceOrder>(`/fleet/tours/${tourId}`, {
    method: "PATCH",
    body,
  });
  await syncFleetWorkspaceState();
  return {
    id: updated.id,
    service: "tour" as const,
    status: toFrontendServiceStatus(updated.status),
    customerName: updated.customerName,
    assetId: updated.assetId ?? undefined,
    scheduledAt: safeTimestamp(updated.scheduledAt),
    notes: updated.notes ?? undefined,
  } as FleetServiceResponse;
}

export async function getFleetTourById(tourId: string) {
  const tour = await request<BackendFleetServiceOrder>(`/fleet/tours/${tourId}`, { method: "GET" });
  return {
    id: tour.id,
    service: "tour" as const,
    status: toFrontendServiceStatus(tour.status),
    customerName: tour.customerName,
    assetId: tour.assetId ?? undefined,
    scheduledAt: safeTimestamp(tour.scheduledAt),
    notes: tour.notes ?? undefined,
  } as FleetServiceResponse;
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

export async function listFleetSchoolShuttles() {
  return request<FleetServiceResponse[]>("/fleet/school-shuttles", { method: "GET" });
}

export async function createFleetSchoolShuttle(input: FleetCreateServiceInput) {
  const created = await request<BackendFleetServiceOrder>("/fleet/school-shuttles", {
    method: "POST",
    body: {
      customerName: input.customerName,
      assetId: input.assetId,
      scheduledAt: new Date(input.scheduledAt).toISOString(),
      notes: input.notes,
    },
  });
  await syncFleetWorkspaceState();
  return {
    id: created.id,
    service: "school_shuttle" as const,
    status: toFrontendServiceStatus(created.status),
    customerName: created.customerName,
    assetId: created.assetId ?? undefined,
    scheduledAt: safeTimestamp(created.scheduledAt),
    notes: created.notes ?? undefined,
  } as FleetServiceResponse;
}

// ------------------------------------------------------------------
// School shuttle sub-resources
// ------------------------------------------------------------------

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

// ------------------------------------------------------------------
// Compliance / earnings
// ------------------------------------------------------------------

export async function listFleetComplianceIncidents() {
  return request<FleetIncidentResponse[]>("/fleet/compliance/incidents", { method: "GET" });
}

export async function createFleetComplianceIncident(input: FleetCreateComplianceIncidentInput) {
  const reporterId = auth.getUserId();
  if (!reporterId) {
    throw new Error("User identity is not available. Please sign in again.");
  }

  const created = await request<BackendFleetIncident>("/fleet/compliance/incidents", {
    method: "POST",
    body: {
      category: input.category,
      severity: toBackendSeverity(input.severity),
      status: "OPEN",
      description: input.description,
      reporterId,
    },
  });
  await syncFleetWorkspaceState();
  return {
    id: created.id,
    category: created.category,
    severity: toFrontendSeverity(created.severity),
    status: toFrontendIncidentStatus(created.status),
    description: created.description,
    createdAt: safeTimestamp(created.createdAt),
  } as FleetIncidentResponse;
}

export async function refreshFleetWorkspaceState() {
  if (!isFleetBackendEnabled() || !auth.getAccessToken()) {
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

// ------------------------------------------------------------------
// Cached getters
// ------------------------------------------------------------------

export function getCachedFleetDrivers() {
  return readStorage<any[]>("drivers", []);
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

export async function listFleetVehicles() {
  if (!isFleetBackendEnabled() || !auth.getAccessToken()) {
    return getCachedFleetVehicles();
  }

  const vehicles = await request<BackendFleetVehicle[]>("/fleet/vehicles");
  const mappedVehicles = vehicles.map((vehicle, index) => ({
    id: vehicle.id,
    backendId: vehicle.id,
    plate: vehicle.licensePlate ?? "-",
    licensePlate: vehicle.licensePlate ?? "-",
    model: `${vehicle.make} ${vehicle.model}`.trim(),
    status: toFrontendVehicleStatus(vehicle.vehicleStatus),
    opsStatus: vehicle.vehicleStatus === "ACTIVE" || vehicle.isActive ? "ready" : "unavailable",
    driver: "-",
    mileage: 0,
    vehicleType: vehicle.bodyType ?? "Unknown",
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

// ------------------------------------------------------------------
// Local fallbacks (used when backend flag is off)
// ------------------------------------------------------------------

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

export function createFallbackFleetVehicle(
  input: FleetCreateVehicleInput & Partial<{ color: string; vin: string; registrationExpiry: string }>
) {
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

export function createFallbackFleetComplianceIncident(
  input: FleetCreateComplianceIncidentInput & Partial<{ vehicle: string; driver: string }>
) {
  const existing = getCachedFleetIncidents();
  const next = {
    id: Date.now(),
    backendId: undefined,
    incidentId: `INC-${String(existing.length + 1).padStart(3, "0")}`,
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


// ------------------------------------------------------------------
// Settings (portal / security / integrations / roles)
// ------------------------------------------------------------------

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
