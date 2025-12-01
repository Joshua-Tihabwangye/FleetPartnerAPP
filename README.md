# EVzone Fleet Partner (CRA + MUI + Tailwind, JavaScript)

This project is a **starter implementation** of the EVzone Fleet Partner portal:

- Built with **Create React App (JavaScript)**.
- Styling with **Tailwind CSS** and EVzone-inspired colors.
- **MUI (Material UI)** theme wired at the root so you can introduce MUI components where needed.
- Routing with **React Router v6**.
- A powerful **FleetPartnerAppShell** with top bar and sidebar that covers all of your fleet partner pages.

## Getting started

```bash
npm install
npm start
```

The app will start at `http://localhost:3000`.

## Where to plug in the detailed page designs

All pages are already **wired and stubbed** under `src/pages/**`.

For each page you have a dedicated canvas/design, open the matching file and replace the stub component with your full implementation. Examples:

- `/dashboard` → `src/pages/dashboard/DashboardOverviewPage.jsx`
- `/drivers` → `src/pages/drivers/DriversListPage.jsx`
- `/vehicles/:vehicleId/maintenance` → `src/pages/vehicles/VehicleMaintenanceHistoryPage.jsx`
- `/school-shuttles/students/:studentId` → `src/pages/services/schoolShuttles/ShuttleStudentDetailPage.jsx`
- `/rentals/catalog` → `src/pages/services/rentals/FleetPartnerRentalCatalogPage.jsx`

The **shell** (`src/layout/FleetPartnerAppShell.jsx`) already includes:

- Top bar with workspace chip, notification icon and theme toggle.
- Left sidebar with navigation for Operations, Assets, Earnings, Compliance, Training, Settings.
- Mobile sidebar toggle for small screens.

Pages rendered inside the shell are wrapped via React Router `<Outlet />`.

## Tailwind & MUI

Tailwind is configured via:

- `tailwind.config.cjs`
- `postcss.config.cjs`
- `src/index.css` (contains the `@tailwind` directives).

MUI theme lives in `src/theme/muiTheme.js` and is applied at the root in `src/index.js`.

You can safely introduce MUI components into any page — the theme is already in place.

## Auth & guards

For now, `ProtectedRoute`, `OnboardingGuard` and `RoleGuard` use **fake auth objects**. Replace them with real auth state from your backend / auth provider when you integrate:

- `src/routes/ProtectedRoute.jsx`
- `src/routes/OnboardingGuard.jsx`
- `src/routes/RoleGuard.jsx`

