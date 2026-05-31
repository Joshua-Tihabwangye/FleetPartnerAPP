// Previously re-exported from "@shared/config" which does not exist.
// Backend feature flag is controlled by the VITE_BACKEND_ENABLED env var.

export function getBackendEnabled(): boolean {
  const val = import.meta.env.VITE_BACKEND_ENABLED as string | undefined;
  if (!val) return true; // default on when not set
  return val !== "false" && val !== "0";
}

export const BACKEND_FLAG_EVENT = "evzone:backend_flag_changed";
export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001/api/v1";
export const SOCKET_BASE_URL = import.meta.env.VITE_SOCKET_BASE_URL || API_BASE_URL.replace(/\/api\/v1\/?$/, "");
export const SOCKET_PATH = import.meta.env.VITE_SOCKET_PATH || "/socket.io";
export const ALLOW_DEV_AUTH_FALLBACK = import.meta.env.VITE_ALLOW_DEV_AUTH_FALLBACK !== "false";
