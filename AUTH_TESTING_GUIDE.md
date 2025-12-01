# Authentication Testing Guide

## How to Test Login Without Database

The app now uses **localStorage-based authentication** for frontend testing. You can login with **any email and password** to test all pages.

## Quick Start

1. **Go to login page**: `/login`
2. **Enter any email and password** (e.g., `test@example.com` / `password123`)
3. **Click "Continue"** - you'll be redirected to `/dashboard`
4. **You're now logged in!** You can navigate to any page.

## Files That Handle Authentication

### 1. **`src/utils/auth.js`** - Auth Utility
   - Stores auth state in `localStorage`
   - Functions: `login()`, `logout()`, `isAuthenticated()`, `getUser()`
   - **Location**: This is where authentication logic lives

### 2. **`src/routes/ProtectedRoute.jsx`** - Protected Routes Guard
   - **Blocks access** if not authenticated
   - Redirects to `/login` if not logged in
   - **Used for**: All main app pages (dashboard, drivers, vehicles, etc.)

### 3. **`src/routes/OnboardingGuard.jsx`** - Onboarding Flow Guard
   - **Blocks access** if onboarding not complete
   - Redirects to `/setup/fleet-partner-profile` if onboarding incomplete
   - **Used for**: Onboarding setup pages

### 4. **`src/routes/RoleGuard.jsx`** - Role-Based Access Control
   - **Blocks access** if user role doesn't match
   - Redirects to `/access-denied` if role doesn't match
   - **Used for**: Pages that require specific roles (e.g., `/settings/roles`, `/ambulance/dispatch`)

### 5. **`src/pages/auth/FleetPartnerLoginPage.jsx`** - Login Page
   - **Accepts any email/password** for testing
   - Sets auth state in localStorage
   - Redirects to dashboard after login

## Testing Different Scenarios

### Test Onboarding Flow
1. Open browser console (F12)
2. Run: `localStorage.setItem('fleet_partner_auth', JSON.stringify({isAuthenticated: true, hasFinishedOnboarding: false, user: {email: 'test@test.com', role: 'FleetOwner'}}))`
3. Navigate to any protected route
4. You'll be redirected to `/setup/fleet-partner-profile`

### Test Role-Based Access
1. Login normally
2. Open browser console (F12)
3. Run: `localStorage.setItem('fleet_partner_auth', JSON.stringify({isAuthenticated: true, hasFinishedOnboarding: true, user: {email: 'test@test.com', role: 'Dispatcher'}}))`
4. Try accessing `/settings/roles` (requires FleetOwner or Manager)
5. You'll be redirected to `/access-denied`

### Test Logout
1. Open browser console (F12)
2. Run: `localStorage.removeItem('fleet_partner_auth')`
3. Refresh page - you'll be redirected to login

## Pages That Require Authentication

All pages under these routes require login:
- `/dashboard` and all dashboard pages
- `/drivers` and all driver pages
- `/vehicles` and all vehicle pages
- `/trips` and all trip pages
- `/earnings` and all earnings pages
- `/compliance` and all compliance pages
- `/settings` and all settings pages
- All service pages (rentals, tours, shuttles)

## Pages That Don't Require Authentication

- `/` (homepage)
- `/login`
- `/forgot-password`
- `/reset-password/:token`
- `/fleet-partner/register`
- `/verify-email`
- `/access-denied`
- `/*` (404 page)

## Default User Role

When you login, the default role is **"FleetOwner"** which has access to all pages.

Available roles:
- `FleetOwner` - Full access
- `Manager` - Most access except some settings
- `Dispatcher` - Operations access
- `Finance` - Financial pages access

## Switching to Real Backend

When you're ready to connect to a real backend:

1. **Update `src/utils/auth.js`**:
   - Replace `login()` function to call your API
   - Replace localStorage with API calls
   - Handle tokens/sessions from your backend

2. **Update guards** (`ProtectedRoute.jsx`, etc.):
   - They already use `auth.getAuth()` so they'll work automatically once you update `auth.js`

3. **Update login page**:
   - Replace the simple login with API call
   - Handle errors from backend
   - Store tokens/sessions appropriately

