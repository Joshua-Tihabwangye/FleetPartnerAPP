import {
  backendForgotPassword,
  backendLogin,
  backendRegister,
  isBackendAuthEnabled,
} from "../services/api/authApi";
import { ApiRequestError } from "../services/api/httpClient";

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

function shouldFallbackToLocal(error: unknown): boolean {
  if (error instanceof TypeError) return true;
  if (error instanceof ApiRequestError) {
    return error.status >= 500;
  }
  return false;
}

function buildLocalAuthState(email: string): AuthState {
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

export const auth = {
  getAuth: (): AuthState => {
    if (typeof window === "undefined") {
      return defaultAuthState;
    }

    const stored = localStorage.getItem(AUTH_KEY);
    if (!stored) return defaultAuthState;

    try {
      return JSON.parse(stored) as AuthState;
    } catch {
      return defaultAuthState;
    }
  },

  setAuth: (authData: AuthState): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
    }
  },

  login: async (email: string, password: string): Promise<AuthState> => {
    const normalizedEmail = email.trim().toLowerCase();

    if (isBackendAuthEnabled()) {
      try {
        const backend = await backendLogin({
          email: normalizedEmail,
          password,
        });

        const authData = buildLocalAuthState(backend.user.email);
        auth.setAuth(authData);
        return authData;
      } catch (error) {
        if (!shouldFallbackToLocal(error)) {
          throw error;
        }
        console.warn("Fleet backend login unavailable. Falling back to local auth.", error);
      }
    }

    const authData = buildLocalAuthState(normalizedEmail || email);
    auth.setAuth(authData);
    return authData;
  },

  register: async (input: {
    companyName: string;
    email: string;
    phone?: string;
    fleetSize?: string;
    services?: string[];
  }): Promise<void> => {
    if (!isBackendAuthEnabled()) return;

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
      if (!shouldFallbackToLocal(error)) {
        throw error;
      }
      console.warn("Fleet backend registration unavailable. Continuing local flow.", error);
    }
  },

  forgotPassword: async (email: string): Promise<void> => {
    if (!isBackendAuthEnabled()) return;

    try {
      await backendForgotPassword({ email: email.trim().toLowerCase() });
    } catch (error) {
      if (!shouldFallbackToLocal(error)) {
        throw error;
      }
      console.warn("Fleet backend forgot-password unavailable. Continuing local flow.", error);
    }
  },

  logout: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_KEY);
    }
  },

  isAuthenticated: (): boolean => {
    return auth.getAuth().isAuthenticated;
  },

  hasFinishedOnboarding: (): boolean => {
    return auth.getAuth().hasFinishedOnboarding;
  },

  getUser: (): User | null => {
    return auth.getAuth().user;
  },
};
