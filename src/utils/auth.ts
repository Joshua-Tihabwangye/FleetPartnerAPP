// Simple auth utility for frontend testing without database
// This stores auth state in localStorage for testing purposes

const AUTH_KEY = "fleet_partner_auth";

export interface User {
  email: string;
  role: 'FleetOwner' | 'Manager' | 'Dispatcher' | 'Finance';
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
  user: null
};

export const auth = {
  // Get auth state from localStorage
  getAuth: (): AuthState => {
    if (typeof window === "undefined") {
      return defaultAuthState;
    }
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      try {
        return JSON.parse(stored) as AuthState;
      } catch {
        return defaultAuthState;
      }
    }
    return defaultAuthState;
  },

  // Set auth state
  setAuth: (authData: AuthState): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
    }
  },

  // Login - accepts any email/password for testing
  login: (email: string, _password: string): AuthState => {
    // For testing: accept any email/password
    const authData: AuthState = {
      isAuthenticated: true,
      hasFinishedOnboarding: true, // Set to false if you want to test onboarding flow
      user: {
        email: email,
        role: "FleetOwner", // Can be: FleetOwner, Manager, Dispatcher, Finance
        name: email.split("@")[0]
      }
    };
    auth.setAuth(authData);
    return authData;
  },

  // Logout
  logout: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_KEY);
    }
  },

  // Check if authenticated
  isAuthenticated: (): boolean => {
    return auth.getAuth().isAuthenticated;
  },

  // Check if onboarding is complete
  hasFinishedOnboarding: (): boolean => {
    return auth.getAuth().hasFinishedOnboarding;
  },

  // Get current user
  getUser: (): User | null => {
    return auth.getAuth().user;
  }
};
