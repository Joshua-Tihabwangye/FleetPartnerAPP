import { getBackendEnabled } from "./config";
import { request } from "./httpClient";

interface BackendAuthUser {
  id: string;
  email: string;
  roles?: string[];
  driverId?: string;
}

interface BackendAuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
  user: BackendAuthUser;
}

export interface BackendSessionResponse {
  user: {
    id: string;
    email: string;
    phone?: string | null;
    status: string;
    roles: string[];
    lastLoginAt?: string | null;
  };
  profile: {
    driverProfileId: string | null;
    riderProfileId: string | null;
    fleetProfileId: string | null;
    adminProfileId: string | null;
  };
  permissions: string[];
  defaultRedirect: string;
}

export interface BackendLoginInput {
  email: string;
  password: string;
}

export interface BackendRegisterInput {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  fleetProfile?: {
    companyName?: string;
    contactEmail?: string;
    contactPhone?: string;
    registrationNumber?: string;
    taxId?: string;
    fleetSize?: string;
    services?: string[];
    metadata?: Record<string, unknown>;
  };
}

export interface BackendForgotPasswordInput {
  email: string;
}

export function isBackendAuthEnabled(): boolean {
  return getBackendEnabled();
}

export async function backendLogin(input: BackendLoginInput): Promise<BackendAuthResponse> {
  return request<BackendAuthResponse>("/auth/login", {
    method: "POST",
    body: input,
  });
}

export async function backendFetchSession(): Promise<BackendSessionResponse> {
  return request<BackendSessionResponse>("/auth/session", {
    method: "GET",
  });
}

export async function backendRegister(input: BackendRegisterInput): Promise<BackendAuthResponse> {
  return request<BackendAuthResponse>("/auth/register", {
    method: "POST",
    body: {
      ...input,
      roles: ["fleet_owner"],
    },
  });
}

export async function backendForgotPassword(input: BackendForgotPasswordInput): Promise<{ sent: boolean }> {
  return request<{ sent: boolean }>("/auth/forgot-password", {
    method: "POST",
    body: input,
  });
}

export interface BackendVerifyOtpInput {
  email: string;
  otp: string;
}

export interface BackendVerifyOtpResult {
  verified: boolean;
  resetRequired?: boolean;
}

export async function backendVerifyOtp(input: BackendVerifyOtpInput): Promise<BackendVerifyOtpResult> {
  return request<BackendVerifyOtpResult>("/auth/verify-otp", {
    method: "POST",
    body: input,
  });
}

export interface BackendResetPasswordInput {
  email: string;
  otp: string;
  newPassword: string;
}

export interface BackendResetPasswordResult {
  reset: boolean;
}

export async function backendResetPassword(input: BackendResetPasswordInput): Promise<BackendResetPasswordResult> {
  return request<BackendResetPasswordResult>("/auth/reset-password", {
    method: "POST",
    body: input,
  });
}
