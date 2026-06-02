import {
  backendForgotPassword,
  backendLogin,
  backendRegister,
  backendVerifyOtp,
  backendResetPassword,
  isBackendAuthEnabled,
} from "../services/api/authApi";
import { ALLOW_DEV_AUTH_FALLBACK } from "../services/api/config";
import {
  normalizeFleetLoginInput,
  normalizeFleetRegistrationInput,
} from "../services/api/validators";
import {
  clearFleetBackendTokens,
  readFleetBackendAccessToken,
  saveFleetBackendTokens,
  syncFleetWorkspaceState,
} from "../services/api/fleetApi";

const AUTH_KEY = "fleet_partner_auth";

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

type FleetRoleClaimStatus = {
  roles: FleetBackendRole[];
  hasUnknownRoles: boolean;
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

const defaultAuthState: AuthState = {
  isAuthenticated: false,
  hasFinishedOnboarding: false,
  user: null,
};

const DEV_REGISTERED_USERS_KEY = "fleet_partner_dev_registered_users";

function shouldUseDevelopmentAuth(): boolean {
  return ALLOW_DEV_AUTH_FALLBACK && !isBackendAuthEnabled();
}

function parseJwtPayload(token: string): { exp?: number; roles?: unknown } | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const normalized = parts[1]!.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const json = atob(padded);
    return JSON.parse(json) as { exp?: number; roles?: unknown };
  } catch {
    return null;
  }
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

function sanitizeFleetRoles(input?: unknown): FleetBackendRole[] {
  return parseFleetRoleClaims(input).roles;
}

function getClaimRolesFromToken(token: string): FleetRoleClaimStatus {
  const payload = parseJwtPayload(token);
  return parseFleetRoleClaims(payload?.roles);
}

function isAccessTokenExpired(token: string): boolean {
  const payload = parseJwtPayload(token);
  if (!payload?.exp) return false;
  return payload.exp * 1000 <= Date.now();
}

function mapFleetPrimaryRole(roles: FleetBackendRole[]): FleetBackendRole {
  if (roles.includes("fleet_finance")) return "fleet_finance";
  if (roles.includes("fleet_dispatcher")) return "fleet_dispatcher";
  if (roles.includes("fleet_manager")) return "fleet_manager";
  return "fleet_owner";
}

function resolveCurrentBackendRoles(): FleetRoleClaimStatus {
  const token = readFleetBackendAccessToken();
  if (!token) return { roles: [], hasUnknownRoles: false };
  return getClaimRolesFromToken(token);
}

function hasAnyFleetPermissionByRoles(roles: FleetBackendRole[], required: readonly FleetPermission[]): boolean {
  if (required.length === 0) return true;
  const granted = new Set<FleetPermission>();
  roles.forEach((role) => {
    FLEET_ROLE_PERMISSIONS[role].forEach((permission) => granted.add(permission));
  });
  return required.some((permission) => granted.has(permission));
}

function createDevelopmentAuthState(email: string): AuthState {
  return {
    isAuthenticated: true,
    hasFinishedOnboarding: true,
    user: {
      email,
      role: "fleet_owner",
      roles: ["fleet_owner"],
      name: email.split("@")[0] || "fleet-user",
    },
  };
}

function saveDevelopmentRegistration(input: {
  companyName: string;
  email: string;
  phone?: string;
  registrationNumber?: string;
  taxId?: string;
  fleetSize?: string;
  services?: string[];
  metadata?: Record<string, unknown>;
  password: string;
}): void {
  if (typeof window === "undefined") return;
  try {
    const stored = window.localStorage.getItem(DEV_REGISTERED_USERS_KEY);
    const existing = stored ? (JSON.parse(stored) as Array<Record<string, unknown>>) : [];
    existing.unshift({
      companyName: input.companyName,
      email: input.email,
      phone: input.phone ?? "",
      registrationNumber: input.registrationNumber ?? "",
      taxId: input.taxId ?? "",
      fleetSize: input.fleetSize ?? "",
      services: input.services ?? [],
      metadata: input.metadata ?? {},
      password: input.password,
      createdAt: new Date().toISOString(),
    });
    window.localStorage.setItem(DEV_REGISTERED_USERS_KEY, JSON.stringify(existing.slice(0, 100)));
  } catch {
    // No-op: local fallback only.
  }
}

export const auth = {
  getAuth(): AuthState {
    if (typeof window === "undefined") {
      return defaultAuthState;
    }

    let storedAuth: AuthState;
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      storedAuth = raw ? (JSON.parse(raw) as AuthState) : defaultAuthState;
    } catch {
      return defaultAuthState;
    }

    if (!storedAuth.isAuthenticated || !storedAuth.user) {
      return storedAuth;
    }

    if (!isBackendAuthEnabled()) {
      return storedAuth;
    }

    const accessToken = readFleetBackendAccessToken();
    if (!accessToken || isAccessTokenExpired(accessToken)) {
      auth.logout();
      return defaultAuthState;
    }

    const claimRoles = resolveCurrentBackendRoles();
    if (claimRoles.hasUnknownRoles) {
      auth.logout();
      return defaultAuthState;
    }

    if (claimRoles.roles.length > 0) {
      const nextUser: User = {
        ...storedAuth.user,
        roles: claimRoles.roles,
        role: mapFleetPrimaryRole(claimRoles.roles),
      };
      const nextAuth = { ...storedAuth, user: nextUser };
      auth.setAuth(nextAuth);
      return nextAuth;
    }

    return storedAuth;
  },

  setAuth(authData: AuthState): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
    }
  },

  async login(email: string, password: string): Promise<AuthState> {
    const credentials = normalizeFleetLoginInput({ email, password });
    const normalizedEmail = credentials.email;

    if (shouldUseDevelopmentAuth()) {
      const authData = createDevelopmentAuthState(normalizedEmail);
      clearFleetBackendTokens();
      auth.setAuth(authData);
      return authData;
    }

    if (!isBackendAuthEnabled()) {
      throw new Error(
        "Fleet backend authentication is disabled. Enable VITE_BACKEND_ENABLED=true or VITE_ALLOW_DEV_AUTH_FALLBACK=true in non-production.",
      );
    }

    try {
      const backend = await backendLogin(credentials);
      saveFleetBackendTokens(backend.accessToken, backend.refreshToken);

      const claimRoles = resolveCurrentBackendRoles();
      if (claimRoles.hasUnknownRoles) {
        auth.logout();
        throw new Error("Received unsupported fleet role claims.");
      }

      const roles = claimRoles.roles.length > 0 ? claimRoles.roles : sanitizeFleetRoles(backend.user.roles);
      if (roles.length === 0) {
        auth.logout();
        throw new Error("Fleet account has no supported backend role.");
      }
      const resolvedRoles: FleetBackendRole[] = roles;

      const authData: AuthState = {
        isAuthenticated: true,
        hasFinishedOnboarding: true,
        user: {
          email: backend.user.email,
          roles: resolvedRoles,
          role: mapFleetPrimaryRole(resolvedRoles),
          name: backend.user.email.split("@")[0] || "fleet-user",
        },
      };
      auth.setAuth(authData);
      void syncFleetWorkspaceState().catch((error) => {
        console.warn("Fleet backend bootstrap sync failed.", error);
      });
      return authData;
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Fleet sign in failed.";
      throw new Error(msg);
    }
  },

  async register(input: {
    companyName: string;
    email: string;
    phone?: string;
    registrationNumber?: string;
    taxId?: string;
    fleetSize?: string;
    services?: string[];
    metadata?: Record<string, unknown>;
    password: string;
  }): Promise<void> {
    const registration = normalizeFleetRegistrationInput(input);

    if (shouldUseDevelopmentAuth()) {
      saveDevelopmentRegistration(registration);
      return;
    }

    if (!isBackendAuthEnabled()) {
      throw new Error(
        "Fleet backend authentication is disabled. Enable VITE_BACKEND_ENABLED=true or VITE_ALLOW_DEV_AUTH_FALLBACK=true in non-production.",
      );
    }

    try {
      await backendRegister({
        fullName: registration.companyName,
        email: registration.email,
        phone: registration.phone,
        password: registration.password,
        fleetProfile: {
          companyName: registration.companyName,
          contactEmail: registration.email,
          contactPhone: registration.phone,
          registrationNumber: registration.registrationNumber,
          taxId: registration.taxId,
          fleetSize: registration.fleetSize,
          services: registration.services,
          metadata: registration.metadata,
        },
      });
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Registration failed.";
      throw new Error(msg);
    }
  },

  async forgotPassword(email: string): Promise<void> {
    if (!isBackendAuthEnabled()) {
      throw new Error("Authentication service is unavailable.");
    }
    try {
      await backendForgotPassword({ email: email.trim().toLowerCase() });
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to send reset link.";
      throw new Error(msg);
    }
  },

  async verifyOtp(email: string, otp: string): Promise<{ verified: boolean; resetRequired?: boolean }> {
    if (!isBackendAuthEnabled()) {
      throw new Error("Authentication service is unavailable.");
    }
    try {
      return await backendVerifyOtp({ email: email.trim().toLowerCase(), otp });
    } catch (error) {
      const msg = error instanceof Error ? error.message : "OTP verification failed.";
      throw new Error(msg);
    }
  },

  async resetPassword(email: string, otp: string, newPassword: string): Promise<{ reset: boolean }> {
    if (!isBackendAuthEnabled()) {
      throw new Error("Authentication service is unavailable.");
    }
    try {
      return await backendResetPassword({ email: email.trim().toLowerCase(), otp, newPassword });
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Password reset failed.";
      throw new Error(msg);
    }
  },

  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_KEY);
    }
    clearFleetBackendTokens();
  },

  isAuthenticated(): boolean {
    const state = auth.getAuth();
    return state.isAuthenticated && !!state.user;
  },

  hasFinishedOnboarding(): boolean {
    return auth.getAuth().hasFinishedOnboarding;
  },

  getUser(): User | null {
    return auth.getAuth().user;
  },

  getUserRoles(): FleetBackendRole[] {
    const user = auth.getUser();
    return user?.roles ?? [];
  },

  hasPermission(permission: FleetPermission): boolean {
    return hasAnyFleetPermissionByRoles(auth.getUserRoles(), [permission]);
  },

  hasAnyPermission(required: FleetPermission[]): boolean {
    return hasAnyFleetPermissionByRoles(auth.getUserRoles(), required);
  },
};
