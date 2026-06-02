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

const FLEET_ROLE_SET = new Set<string>(FLEET_BACKEND_ROLE_ENUMS);

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

function sanitizeFleetRoles(input?: unknown): FleetBackendRole[] {
  if (!Array.isArray(input)) return [];

  const normalized = input
    .filter((role): role is string => typeof role === "string")
    .map((role) => role.trim().toLowerCase())
    .filter((role): role is FleetBackendRole => FLEET_ROLE_SET.has(role));

  return Array.from(new Set(normalized));
}

function getClaimRolesFromToken(token: string): FleetBackendRole[] {
  const payload = parseJwtPayload(token);
  return sanitizeFleetRoles(payload?.roles);
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

function resolveCurrentBackendRoles(): FleetBackendRole[] {
  const token = readFleetBackendAccessToken();
  if (!token) return [];
  return getClaimRolesFromToken(token);
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
    if (claimRoles.length > 0) {
      const nextUser: User = {
        ...storedAuth.user,
        roles: claimRoles,
        role: mapFleetPrimaryRole(claimRoles),
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
      const roles = claimRoles.length > 0 ? claimRoles : sanitizeFleetRoles(backend.user.roles);
      const resolvedRoles: FleetBackendRole[] = roles.length > 0 ? roles : ["fleet_owner"];

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
};
