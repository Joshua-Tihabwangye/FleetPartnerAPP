import { WebStorageStateStore, type UserManagerSettings } from "oidc-client-ts";

const env = import.meta.env as Record<string, string | undefined>;

export const OIDC_AUTHORITY =
  env.VITE_OIDC_AUTHORITY?.trim() || "https://accounts.evzone.app";
export const OIDC_CLIENT_ID =
  env.VITE_OIDC_CLIENT_ID?.trim() || "evzone-charging-fleet-web";
export const OIDC_REDIRECT_URI =
  env.VITE_OIDC_REDIRECT_URI?.trim() ||
  "https://fleet.evzonecharging.com/auth/callback";
export const OIDC_POST_LOGOUT_REDIRECT_URI =
  env.VITE_OIDC_POST_LOGOUT_REDIRECT_URI?.trim() ||
  "https://fleet.evzonecharging.com/";
export const OIDC_SCOPE =
  env.VITE_OIDC_SCOPE?.trim() ||
  "openid profile email phone evzone.principal evzone.trust evzone.organizations evzone.tenants charging.fleet charging.fleet.vehicles.manage charging.fleet.drivers.manage charging.fleet.sessions.read charging.fleet.policies.manage";

function createUserStore() {
  if (typeof window === "undefined") return undefined;
  return new WebStorageStateStore({ store: window.sessionStorage });
}

export const oidcSettings: UserManagerSettings = {
  authority: OIDC_AUTHORITY,
  client_id: OIDC_CLIENT_ID,
  redirect_uri: OIDC_REDIRECT_URI,
  post_logout_redirect_uri: OIDC_POST_LOGOUT_REDIRECT_URI,
  response_type: "code",
  scope: OIDC_SCOPE,
  userStore: createUserStore(),
  automaticSilentRenew: true,
};
