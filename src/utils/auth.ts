import {
  backendForgotPassword,
  backendLogin,
  backendRegister,
  backendVerifyOtp,
  backendResetPassword,
  isBackendAuthEnabled,
} from "../services/api/authApi";
import { ApiRequestError } from "../services/api/httpClient";
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

function mapFleetRole(roles?: string[]): User["role"] {
  if (roles?.includes("fleet_finance")) return "Finance";
  if (roles?.includes("fleet_dispatcher")) return "Dispatcher";
  if (roles?.includes("fleet_manager")) return "Manager";
  return "FleetOwner";
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
    if (!isBackendAuthEnabled()) {
      throw new Error("Authentication service is unavailable.");
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
      const msg = error instanceof Error ? error.message : "Sign in failed.";
      throw new Error(msg);
    }
  },

  async register(input: {
    companyName: string;
    email: string;
    phone?: string;
    fleetSize?: string;
    services?: string[];
  }): Promise<void> {
    if (!isBackendAuthEnabled()) {
      throw new Error("Authentication service is unavailable.");
    }
    try {
      const normalizedEmail = input.email.trim().toLowerCase();
      const generatedPassword = `Fleet#${Date.now()}Aa1`;
      await backendRegister({
        fullName: input.companyName.trim() || "Fleet Partner",
        email: normalizedEmail,
        phone: input.phone?.trim(),
        password: generatedPassword,
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