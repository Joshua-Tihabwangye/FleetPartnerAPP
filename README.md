# EVzone Fleet Partner (Vite + React + TypeScript + MUI + Tailwind)

This project is a **starter implementation** of the EVzone Fleet Partner portal:

- Built with **Vite + React + TypeScript**.
- Styling with **Tailwind CSS** and EVzone-inspired colors.
- **MUI (Material UI)** theme wired at the root so you can introduce MUI components where needed.
- Routing with **React Router v6**.
- A powerful **FleetPartnerAppShell** with top bar and sidebar that covers all of your fleet partner pages.

## Getting started

```bash
npm install
npm run dev
```

The app runs on `http://localhost:3000`.

If you prefer legacy start command support:

```bash
npm start
```

(`start` is mapped to Vite.)

## Where to plug in the detailed page designs

All pages are already **wired and stubbed** under `src/pages/**`.

For each page you have a dedicated canvas/design, open the matching file and replace the stub component with your full implementation. Examples:

- `/dashboard` → `src/pages/dashboard/DashboardOverviewPage.tsx`
- `/drivers` → `src/pages/drivers/DriversListPage.tsx`
- `/vehicles/:vehicleId/maintenance` → `src/pages/vehicles/VehicleMaintenanceHistoryPage.tsx`
- `/school-shuttles/students/:studentId` → `src/pages/services/schoolShuttles/ShuttleStudentDetailPage.tsx`
- `/rentals/catalog` → `src/pages/services/rentals/FleetPartnerRentalCatalogPage.tsx`

The **shell** (`src/layout/FleetPartnerAppShell.tsx`) already includes:

- Top bar with workspace chip, notification icon and theme toggle.
- Left sidebar with navigation for Operations, Assets, Earnings, Compliance, Training, Settings.
- Mobile sidebar toggle for small screens.

Pages rendered inside the shell are wrapped via React Router `<Outlet />`.

## Tailwind & MUI

Tailwind is configured via:

- `tailwind.config.js`
- `postcss.config.js`
- `src/index.css` (contains the `@tailwind` directives).

MUI theme lives in `src/theme/muiTheme.ts` and is applied at the root in `src/main.tsx`.

You can safely introduce MUI components into any page — the theme is already in place.

## Auth & guards

For now, `ProtectedRoute`, `OnboardingGuard` and `RoleGuard` use **fake auth objects**. Replace them with real auth state from your backend / auth provider when you integrate:

- `src/routes/ProtectedRoute.tsx`
- `src/routes/OnboardingGuard.tsx`
- `src/routes/RoleGuard.tsx`
