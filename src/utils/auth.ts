import { useEffect, useState } from "react";
import { User as OidcUser, UserManager } from "oidc-client-ts";
import { oidcSettings } from "../services/auth/oidcConfig";

export const FLEET_BACKEND_ROLE_ENUMS = [
  "fleet_owner",
  "fleet_manager",
  "fleet_dispatcher",
  "fleet_finance",
] as const;

export type FleetBackendRole = (typeof FLEET_BACKEND_ROLE_ENUMS)[number];
export type FleetPermission =
  | "drivers:view"
  | "drivers:write"
  | "drivers:export"
  | "vehicles:view"
  | "vehicles:write"
  | "vehicles:export"
  | "dispatch:view"
  | "dispatch:write"
  | "settings:roles:view"
  | "settings:roles:write";

export interface User {
  email: string;
  role: FleetBackendRole;
  roles: FleetBackendRole[];
  name: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  hasFinishedOnboarding: boolean;
  user: User | null;
}

export interface FleetOrganization {
  id: string;
  name: string;
  role?: string;
}

type AuthListener = () => void;

type FleetRoleClaimStatus = {
  roles: FleetBackendRole[];
  hasUnknownRoles: boolean;
};

const defaultAuthState: AuthState = {
  isAuthenticated: false,
  hasFinishedOnboarding: false,
  user: null,
};

const FLEET_ROLE_SET = new Set<string>(FLEET_BACKEND_ROLE_ENUMS);

const FLEET_ROLE_PERMISSIONS: Record<FleetBackendRole, readonly FleetPermission[]> = {
  fleet_owner: [
    "drivers:view",
    "drivers:write",
    "drivers:export",
    "vehicles:view",
    "vehicles:write",
    "vehicles:export",
    "dispatch:view",
    "dispatch:write",
    "settings:roles:view",
    "settings:roles:write",
  ],
  fleet_manager: [
    "drivers:view",
    "drivers:write",
    "drivers:export",
    "vehicles:view",
    "vehicles:write",
    "vehicles:export",
    "dispatch:view",
    "settings:roles:view",
    "settings:roles:write",
  ],
  fleet_dispatcher: ["drivers:view", "vehicles:view", "dispatch:view", "dispatch:write"],
  fleet_finance: ["dispatch:view"],
};

const SELECTED_ORG_KEY = "evz_fleet_selected_org";

let userManager: UserManager | null = null;
let currentOidcUser: OidcUser | null = null;
let currentAuthState: AuthState = defaultAuthState;
let initPromise: Promise<void> | null = null;
const listeners = new Set<AuthListener>();

function getManager(): UserManager {
  if (userManager) return userManager;

  userManager = new UserManager(oidcSettings);
  userManager.events.addUserLoaded(handleUserLoaded);
  userManager.events.addUserUnloaded(handleUserUnloaded);
  userManager.events.addUserSignedOut(handleUserUnloaded);
  userManager.events.addAccessTokenExpired(handleTokenExpired);
  return userManager;
}

function notifyListeners(): void {
  listeners.forEach((listener) => listener());
}

function handleUserLoaded(user: OidcUser): void {
  currentOidcUser = user;
  currentAuthState = buildAuthState(user);
  notifyListeners();
}

function handleUserUnloaded(): void {
  currentOidcUser = null;
  currentAuthState = defaultAuthState;
  notifyListeners();
}

function handleTokenExpired(): void {
  void getManager()
    .signinSilent()
    .then((user) => {
      if (user) handleUserLoaded(user);
    })
    .catch(() => {
      handleUserUnloaded();
    });
}

function parseFleetRoleClaims(input?: unknown): FleetRoleClaimStatus {
  if (!Array.isArray(input)) return { roles: [], hasUnknownRoles: false };

  const normalized = new Set<FleetBackendRole>();
  let hasUnknownRoles = false;

  for (const value of input) {
    if (typeof value !== "string") {
      hasUnknownRoles = true;
      continue;
    }

    const role = value.trim().toLowerCase();
    if (!role) continue;

    if (FLEET_ROLE_SET.has(role)) {
      normalized.add(role as FleetBackendRole);
    } else {
      hasUnknownRoles = true;
    }
  }

  return { roles: Array.from(normalized), hasUnknownRoles };
}

function getNestedClaim(profile: Record<string, unknown>, ...keys: string[]): unknown {
  for (const key of keys) {
    if (key in profile) return profile[key];
  }
  return undefined;
}

function extractRolesFromProfile(profile: Record<string, unknown>): FleetBackendRole[] {
  const rawRoles = getNestedClaim(
    profile,
    "roles",
    "evzone.principal",
    "evzone_principal",
    "https://evzone.app/roles",
    "fleet_roles",
  );

  if (Array.isArray(rawRoles)) {
    return parseFleetRoleClaims(rawRoles).roles;
  }

  if (rawRoles && typeof rawRoles === "object") {
    const nested = (rawRoles as Record<string, unknown>).roles;
    if (Array.isArray(nested)) {
      return parseFleetRoleClaims(nested).roles;
    }
  }

  return [];
}

function mapFleetPrimaryRole(roles: FleetBackendRole[]): FleetBackendRole {
  if (roles.includes("fleet_finance")) return "fleet_finance";
  if (roles.includes("fleet_dispatcher")) return "fleet_dispatcher";
  if (roles.includes("fleet_manager")) return "fleet_manager";
  return "fleet_owner";
}

function normalizeUser(user: OidcUser): User | null {
  if (!user || user.expired) return null;

  const profile = user.profile || {};
  const email = String(
    profile.email ?? profile.preferred_username ?? "",
  ).toLowerCase();
  const name = String(
    profile.name ?? profile.given_name ?? email.split("@")[0] ?? "Fleet User",
  );
  const roles = extractRolesFromProfile(profile);
  const resolvedRoles = roles.length > 0 ? roles : ["fleet_owner" as FleetBackendRole];

  return {
    email: email || "fleet-user@evzone.com",
    name,
    roles: resolvedRoles,
    role: mapFleetPrimaryRole(resolvedRoles),
  };
}

function buildAuthState(user: OidcUser | null): AuthState {
  if (!user) return defaultAuthState;
  const fleetUser = normalizeUser(user);
  if (!fleetUser) return defaultAuthState;

  return {
    isAuthenticated: true,
    hasFinishedOnboarding: hasOrganization(),
    user: fleetUser,
  };
}

function canUseSessionStorage(): boolean {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

function parseOrganizations(raw: unknown): FleetOrganization[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((entry: unknown) => {
      if (!entry || typeof entry !== "object") return null;
      const item = entry as Record<string, unknown>;
      const id = String(item.id ?? item.organizationId ?? item.orgId ?? "");
      const name = String(item.name ?? item.displayName ?? item.organizationName ?? "");
      const role = item.role ? String(item.role) : undefined;
      if (!id || !name) return null;
      const org: FleetOrganization = { id, name, role: role ? role : undefined };
      return org;
    })
    .filter((org): org is FleetOrganization => org !== null);
}

export function getOrganizations(): FleetOrganization[] {
  if (!currentOidcUser) return [];
  const profile = currentOidcUser.profile || {};
  const raw = getNestedClaim(
    profile,
    "evzone.organizations",
    "evzone_organizations",
    "organizations",
    "org_memberships",
  );
  return parseOrganizations(raw);
}

export function hasOrganization(): boolean {
  return getOrganizations().length > 0;
}

export function getSelectedOrganization(): FleetOrganization | null {
  if (!canUseSessionStorage()) return null;
  try {
    const raw = window.sessionStorage.getItem(SELECTED_ORG_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as FleetOrganization;
    if (parsed?.id && parsed?.name) return parsed;
    return null;
  } catch {
    return null;
  }
}

export function setSelectedOrganization(org: FleetOrganization): void {
  if (!canUseSessionStorage()) return;
  window.sessionStorage.setItem(SELECTED_ORG_KEY, JSON.stringify(org));
}

export function clearSelectedOrganization(): void {
  if (!canUseSessionStorage()) return;
  window.sessionStorage.removeItem(SELECTED_ORG_KEY);
}

export function hasSelectedOrganization(): boolean {
  return hasOrganization() && !!getSelectedOrganization();
}

export function isAal2(): boolean {
  if (!currentOidcUser) return false;
  const profile = currentOidcUser.profile || {};
  const acr = String(profile.acr ?? "").toLowerCase();
  const amr = profile.amr;

  if (acr === "aal2" || acr.includes("mfa")) return true;
  if (Array.isArray(amr)) {
    return amr.some((method) =>
      String(method).toLowerCase().includes("mfa") ||
      String(method).toLowerCase().includes("aal2"),
    );
  }
  return false;
}

export function isCallbackUrl(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.pathname === "/auth/callback" ||
    window.location.pathname === "/auth/callback/";
}

export function subscribe(listener: AuthListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getAuth(): AuthState {
  return currentAuthState;
}

export function getUser(): User | null {
  return currentAuthState.user;
}

export function getUserEmail(): string {
  return currentAuthState.user?.email ?? "";
}

export function getUserRoles(): FleetBackendRole[] {
  return currentAuthState.user?.roles ?? [];
}

export function isAuthenticated(): boolean {
  return currentAuthState.isAuthenticated;
}

export function hasFinishedOnboarding(): boolean {
  return currentAuthState.hasFinishedOnboarding;
}

export function getAccessToken(): string | null {
  return currentOidcUser?.access_token ?? null;
}

export function getRefreshToken(): string | null {
  return currentOidcUser?.refresh_token ?? null;
}

export function getUserId(): string | null {
  return currentOidcUser?.profile?.sub ?? null;
}

export function hasPermission(permission: FleetPermission): boolean {
  return hasAnyPermission([permission]);
}

export function hasAnyPermission(required: FleetPermission[]): boolean {
  if (required.length === 0) return true;
  const roles = getUserRoles();
  const granted = new Set<FleetPermission>();
  roles.forEach((role) => {
    FLEET_ROLE_PERMISSIONS[role].forEach((permission) => granted.add(permission));
  });
  return required.some((permission) => granted.has(permission));
}

export async function initializeAuth(): Promise<void> {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const user = await getManager().getUser();
    if (user) {
      handleUserLoaded(user);
    } else {
      handleUserUnloaded();
    }
  })();

  return initPromise;
}

export async function signinRedirect(
  extra: Record<string, unknown> = {},
): Promise<void> {
  await getManager().signinRedirect(extra);
}

export async function signinRedirectCallback(url?: string): Promise<OidcUser> {
  const user = await getManager().signinRedirectCallback(url);
  handleUserLoaded(user);
  return user;
}

export async function signinSilent(): Promise<OidcUser | null> {
  return getManager().signinSilent();
}

export async function requestAal2StepUp(): Promise<void> {
  const loginHint = getUserEmail() || undefined;
  await signinRedirect({
    acr_values: "aal2",
    prompt: "login",
    login_hint: loginHint,
  });
}

export async function logout(): Promise<void> {
  clearSelectedOrganization();
  const mgr = getManager();
  try {
    await mgr.signoutRedirect();
  } catch {
    await mgr.removeUser();
    handleUserUnloaded();
  }
}

export function useAuthState(): { authState: AuthState; loading: boolean } {
  const [authState, setAuthState] = useState(() => getAuth());
  const [loading, setLoading] = useState(
    () => !currentAuthState.isAuthenticated && typeof window !== "undefined",
  );

  useEffect(() => {
    let mounted = true;
    const listener = () => {
      if (mounted) setAuthState(getAuth());
    };

    const unsubscribe = subscribe(listener);
    initializeAuth().finally(() => {
      if (mounted) {
        setAuthState(getAuth());
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  return { authState, loading };
}

export const auth = {
  getAuth,
  setAuth: () => {
    // Intentional no-op: auth state is driven by the OIDC user manager.
  },
  login: (_email?: string, _password?: string) => signinRedirect(),
  register: (_input?: Record<string, unknown>) => signinRedirect({ screen_hint: "signup" }),
  forgotPassword: (_email?: string) => signinRedirect({ screen_hint: "reset" }),
  async verifyOtp(_email?: string, _otp?: string): Promise<{ verified: boolean; resetRequired?: boolean }> {
    return { verified: false, resetRequired: false };
  },
  async resetPassword(_email?: string, _otp?: string, _newPassword?: string): Promise<{ reset: boolean }> {
    return { reset: false };
  },
  logout,
  signinRedirect,
  signinRedirectCallback,
  signinSilent,
  initializeAuth,
  isCallbackUrl,
  isAuthenticated,
  hasFinishedOnboarding,
  getUser,
  getUserEmail,
  getUserRoles,
  getAccessToken,
  getRefreshToken,
  getUserId,
  getOrganizations,
  hasOrganization,
  hasSelectedOrganization,
  setSelectedOrganization,
  clearSelectedOrganization,
  hasPermission,
  hasAnyPermission,
  isAal2,
  requestAal2StepUp,
};
