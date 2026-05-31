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
  clearFleetBackendTokens,
  saveFleetBackendTokens,
  syncFleetWorkspaceState,
} from "../services/api/fleetApi";

const AUTH_KEY = "fleet_partner_auth";

export interface User {
  email: string;
  role: "FleetOwner" | "Manager" | "Dispatcher" | "Finance";
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
  return !isBackendAuthEnabled() || (import.meta.env.DEV && ALLOW_DEV_AUTH_FALLBACK);
}

function mapFleetRole(roles?: string[]): User["role"] {
  if (roles?.includes("fleet_finance")) return "Finance";
  if (roles?.includes("fleet_dispatcher")) return "Dispatcher";
  if (roles?.includes("fleet_manager")) return "Manager";
  return "FleetOwner";
}

function createDevelopmentAuthState(email: string): AuthState {
  return {
    isAuthenticated: true,
    hasFinishedOnboarding: true,
    user: {
      email,
      role: "FleetOwner",
      name: email.split("@")[0] || "fleet-user",
    },
  };
}

function saveDevelopmentRegistration(input: {
  companyName: string;
  email: string;
  phone?: string;
  fleetSize?: string;
  services?: string[];
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
      fleetSize: input.fleetSize ?? "",
      services: input.services ?? [],
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
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      return stored ? JSON.parse(stored) : defaultAuthState;
    } catch {
      return defaultAuthState;
    }
  },

  setAuth(authData: AuthState): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
    }
  },

  async login(email: string, password: string): Promise<AuthState> {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password.trim()) {
      throw new Error("Please enter both email and password.");
    }

    if (shouldUseDevelopmentAuth()) {
      const authData = createDevelopmentAuthState(normalizedEmail);
      clearFleetBackendTokens();
      auth.setAuth(authData);
      return authData;
    }

    try {
      const backend = await backendLogin({ email: normalizedEmail, password });
      saveFleetBackendTokens(backend.accessToken, backend.refreshToken);
      const authData: AuthState = {
        isAuthenticated: true,
        hasFinishedOnboarding: true,
        user: {
          email: backend.user.email,
          role: mapFleetRole(backend.user.roles),
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
    fleetSize?: string;
    services?: string[];
    password: string;
  }): Promise<void> {
    const normalizedEmail = input.email.trim().toLowerCase();
    const password = input.password.trim();
    if (!normalizedEmail || !password) {
      throw new Error("Email and password are required.");
    }

    if (shouldUseDevelopmentAuth()) {
      saveDevelopmentRegistration({
        ...input,
        companyName: input.companyName.trim() || "Fleet Partner",
        email: normalizedEmail,
        password,
      });
      return;
    }

    try {
      await backendRegister({
        fullName: input.companyName.trim() || "Fleet Partner",
        email: normalizedEmail,
        phone: input.phone?.trim(),
        password,
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
    return auth.getAuth().isAuthenticated;
  },

  hasFinishedOnboarding(): boolean {
    return auth.getAuth().hasFinishedOnboarding;
  },

  getUser(): User | null {
    return auth.getAuth().user;
  },
};
