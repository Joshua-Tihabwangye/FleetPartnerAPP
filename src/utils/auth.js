// Simple auth utility for frontend testing without database
// This stores auth state in localStorage for testing purposes

const AUTH_KEY = "fleet_partner_auth";

export const auth = {
  // Get auth state from localStorage
  getAuth: () => {
    if (typeof window === "undefined") {
      return { isAuthenticated: false, hasFinishedOnboarding: false, user: null };
    }
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return { isAuthenticated: false, hasFinishedOnboarding: false, user: null };
      }
    }
    return { isAuthenticated: false, hasFinishedOnboarding: false, user: null };
  },

  // Set auth state
  setAuth: (authData) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
    }
  },

  // Login - accepts any email/password for testing
  login: (email, password) => {
    // For testing: accept any email/password
    const authData = {
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
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_KEY);
    }
  },

  // Check if authenticated
  isAuthenticated: () => {
    return auth.getAuth().isAuthenticated;
  },

  // Check if onboarding is complete
  hasFinishedOnboarding: () => {
    return auth.getAuth().hasFinishedOnboarding;
  },

  // Get current user
  getUser: () => {
    return auth.getAuth().user;
  }
};

