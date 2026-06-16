# Authentication Testing Guide

The Fleet Partner app authenticates through **EVzone Accounts OIDC**. It no longer uses localStorage-based fake auth or a local email/password form.

## OIDC Configuration

Defaults are in `src/services/auth/oidcConfig.ts` and can be overridden via environment variables in `.env`:

- `VITE_OIDC_AUTHORITY` (default: `https://accounts.evzone.app`)
- `VITE_OIDC_CLIENT_ID` (default: `evzone-charging-fleet-web`)
- `VITE_OIDC_REDIRECT_URI` (default: `https://fleet.evzonecharging.com/auth/callback`)
- `VITE_OIDC_POST_LOGOUT_REDIRECT_URI`
- `VITE_OIDC_SCOPE`

## Authentication Flow

1. User visits `/login` and clicks **Sign in with EVzone Accounts**.
2. The app redirects to EVzone Accounts with PKCE enabled.
3. After successful authentication, EVzone Accounts redirects back to `/auth/callback`.
4. The app completes the OIDC callback and redirects to `/dashboard`.

## Organization Membership

Protected routes require the authenticated user to have at least one organization in the `evzone.organizations` claim. If the user has multiple organizations, they are redirected to `/switch-organisation` to select a workspace.

## AAL2 Step-Up

Sensitive actions (role/policy changes, payment/payout operations, pricing updates) call `requireAal2()` before mutating data. If the current session is not AAL2, the user is redirected back to EVzone Accounts with `acr_values=aal2`.

## Files That Handle Authentication

- `src/services/auth/oidcConfig.ts` — OIDC client settings.
- `src/utils/auth.ts` — Auth state helpers, role/permission parsing, AAL2 helpers.
- `src/utils/stepUp.ts` — AAL2 guard helper.
- `src/services/auth/OidcAuthInitializer.tsx` — Bootstraps OIDC on app load and handles `/auth/callback`.
- `src/routes/ProtectedRoute.tsx` — Requires authentication + organization membership.
- `src/routes/OnboardingGuard.tsx` — Guards onboarding routes.
- `src/routes/RoleGuard.tsx` — Role-based access control.
