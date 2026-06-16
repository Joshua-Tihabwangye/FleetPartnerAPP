const env = import.meta.env as Record<string, string | undefined>;

function parseBooleanFlag(value: string | undefined, fallback = false): boolean {
  if (!value) return fallback;
  const normalized = value.trim().toLowerCase();
  return normalized === "true" || normalized === "1" || normalized === "yes";
}

function normalizeBaseUrl(value: string | undefined): string | undefined {
  const raw = value?.trim();
  if (!raw) return undefined;
  return raw.replace(/\/+$/, "");
}

function normalizeSocketBaseUrl(value: string | undefined, apiBaseUrl: string): string {
  const raw = value?.trim();
  if (raw) return raw.replace(/\/+$/, "");
  return apiBaseUrl.replace(/\/api(?:\/v\d+)?$/, "");
}

const IS_PROD = (env.MODE?.trim().toLowerCase() ?? "development") === "production";
const rawBaseUrl = env.VITE_API_BASE_URL ?? env.VITE_BACKEND_BASE_URL;
const normalizedBaseUrl = normalizeBaseUrl(rawBaseUrl);

if (IS_PROD && !normalizedBaseUrl) {
  throw new Error(
    "VITE_API_BASE_URL (or VITE_BACKEND_BASE_URL) must be set in production.",
  );
}

export const ALLOW_CACHE_FALLBACK = !IS_PROD;
export const API_BASE_URL = normalizedBaseUrl ?? "http://localhost:3000/api/v1";
export const SOCKET_BASE_URL = normalizeSocketBaseUrl(env.VITE_SOCKET_BASE_URL, API_BASE_URL);
export const SOCKET_PATH = (env.VITE_SOCKET_PATH || "/socket.io").trim() || "/socket.io";
export const APP_ID = (env.VITE_APP_ID || "fleet").trim() || "fleet";
export const BACKEND_FLAG_ENABLED = parseBooleanFlag(
  env.VITE_BACKEND_FLAG_ENABLED,
  !IS_PROD, // default true in dev, false in prod
);
export const BACKEND_FLAG_EVENT = "evzone:backend-flag";

const BACKEND_FLAG_STORAGE_KEY = `evzone_backend_flag_${APP_ID}`;

interface RuntimeFlagEnvelope {
  data?: {
    backendEnabled?: boolean;
  };
  backendEnabled?: boolean;
}

function readStoredBackendFlag(): boolean | undefined {
  if (typeof window === "undefined") return undefined;
  const raw = window.localStorage.getItem(BACKEND_FLAG_STORAGE_KEY);
  if (!raw) return undefined;

  try {
    const parsed = JSON.parse(raw) as { enabled?: boolean };
    return typeof parsed.enabled === "boolean" ? parsed.enabled : undefined;
  } catch {
    return undefined;
  }
}

let runtimeBackendEnabled: boolean | undefined = readStoredBackendFlag();
let runtimeFlagLoadPromise: Promise<boolean> | null = null;

export function getBackendEnabled(): boolean {
  return runtimeBackendEnabled ?? true;
}

export function setBackendEnabled(enabled: boolean): void {
  runtimeBackendEnabled = enabled;
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    BACKEND_FLAG_STORAGE_KEY,
    JSON.stringify({ enabled, updatedAt: Date.now() }),
  );
  window.dispatchEvent(new CustomEvent(BACKEND_FLAG_EVENT, { detail: { appId: APP_ID, enabled } }));
}

export async function loadBackendRuntimeFlag(force = false): Promise<boolean> {
  if (typeof window === "undefined") {
    return getBackendEnabled();
  }

  if (!BACKEND_FLAG_ENABLED && !force) {
    return getBackendEnabled();
  }

  if (!force && runtimeFlagLoadPromise) {
    return runtimeFlagLoadPromise;
  }

  if (force) {
    runtimeBackendEnabled = true;
  }

  runtimeFlagLoadPromise = (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/compat/flags/${APP_ID}`);
      if (!response.ok) {
        throw new Error(`Runtime flag request failed with status ${response.status}`);
      }

      const payload = (await response.json()) as RuntimeFlagEnvelope;
      const enabled = payload.data?.backendEnabled ?? payload.backendEnabled;
      if (typeof enabled === "boolean") {
        setBackendEnabled(enabled);
      }
      return getBackendEnabled();
    } catch {
      return runtimeBackendEnabled ?? true;
    }
  })();

  return runtimeFlagLoadPromise;
}

if (typeof window !== "undefined" && BACKEND_FLAG_ENABLED) {
  void loadBackendRuntimeFlag().catch(() => undefined);
}
