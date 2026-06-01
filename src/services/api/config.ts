const env = import.meta.env as Record<string, string | undefined>;

function parseBooleanFlag(value: string | undefined, fallback = false): boolean {
  if (!value) return fallback;
  const normalized = value.trim().toLowerCase();
  return normalized === "true" || normalized === "1" || normalized === "yes";
}

function normalizeBaseUrl(value: string | undefined): string {
  const raw = value?.trim();
  if (!raw) return "http://localhost:3001/api/v1";
  return raw.replace(/\/+$/, "");
}

function normalizeSocketBaseUrl(value: string | undefined, apiBaseUrl: string): string {
  const raw = value?.trim();
  if (raw) return raw.replace(/\/+$/, "");
  return apiBaseUrl.replace(/\/api(?:\/v\d+)?$/, "");
}

const IS_NON_PROD = (env.MODE?.trim().toLowerCase() ?? "development") !== "production";

export const USE_BACKEND = parseBooleanFlag(env.VITE_USE_BACKEND, true);
export const BACKEND_FLAG_EVENT = "evzone:backend_flag_changed";
export const API_BASE_URL = normalizeBaseUrl(env.VITE_API_BASE_URL);
export const SOCKET_BASE_URL = normalizeSocketBaseUrl(env.VITE_SOCKET_BASE_URL, API_BASE_URL);
export const SOCKET_PATH = (env.VITE_SOCKET_PATH || "/socket.io").trim() || "/socket.io";
export const APP_ID = (env.VITE_APP_ID || "fleet").trim() || "fleet";
export const ALLOW_DEV_AUTH_FALLBACK = parseBooleanFlag(env.VITE_ALLOW_DEV_AUTH_FALLBACK, false) && IS_NON_PROD;

export function getBackendEnabled(): boolean {
  return USE_BACKEND;
}
