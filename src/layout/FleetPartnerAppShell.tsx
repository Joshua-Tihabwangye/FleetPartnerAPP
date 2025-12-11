import React, { useState, useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Typography from "../components/ui/Typography";
import Chip from "../components/ui/Chip";
import { ToastContainer } from "../components/ui/Toast";
import { useToast } from "../hooks/useToast";
import { auth } from "../utils/auth";
import { useTheme, ThemeToggle } from "../context/ThemeContext";
import {
  Dashboard as DashboardIcon,
  Map as MapIcon,
  LocalTaxi as DispatchIcon,
  Commute as TripsIcon,
  CarRental as RentalsIcon,
  MenuBook as CatalogIcon,
  School as SchoolIcon,
  Tour as ToursIcon,
  MedicalServices as AmbulanceIcon,
  Person as DriversIcon,
  DirectionsCar as VehiclesIcon,
  AttachMoney as EarningsIcon,
  ReceiptLong as StatementsIcon,
  Payments as PayoutsIcon,
  GppGood as ComplianceIcon,
  Warning as IncidentsIcon,
  Emergency as AmbulanceCasesIcon,
  SchoolOutlined as TrainingIcon,
  Help as HelpIcon,
  PersonOutline as ProfileIcon,
  Business as FleetIcon,
  Store as BranchesIcon,
  AdminPanelSettings as RolesIcon,
  IntegrationInstructions as IntegrationsIcon,
  Security as SecurityIcon,
  VpnKey as TwoFAIcon,
  Devices as SessionsIcon
} from "@mui/icons-material";

// Small internal button components
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

function IconButton({ children, className = "", ...rest }: IconButtonProps) {
  return (
    <button
      type="button"
      className={
        "inline-flex items-center justify-center rounded-full p-1.5 text-[13px] " +
        "focus:outline-none focus:ring-2 focus:ring-emerald-500/60 transition " +
        className
      }
      {...rest}
    >
      {children}
    </button>
  );
}

interface NavButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean;
  children: React.ReactNode;
  className?: string;
}

function NavButton({ active, children, className = "", ...rest }: NavButtonProps) {
  const base =
    "w-full flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left transition text-[13px]";
  const activeClasses =
    "bg-ev-green text-ev-slate shadow-sm shadow-emerald-500/40 font-medium";
  const inactiveClasses = "text-slate-200 hover:bg-slate-800/80";
  return (
    <button
      type="button"
      className={base + " " + (active ? activeClasses : inactiveClasses) + " " + className}
      {...rest}
    >
      {children}
    </button>
  );
}

// Navigation sections - RESTRUCTURED
const NAV_SECTIONS = [
  {
    id: "ops",
    label: "Operations",
    items: [
      { id: "dashboard", label: "Dashboard", badge: "Live", path: "/dashboard" },
      { id: "live-map", label: "Live fleet map", path: "/live-map" },
      { id: "dispatch", label: "Manual dispatch", path: "/dispatch/new" },
      { id: "trips", label: "Trips & deliveries", path: "/trips" },
      { id: "rentals", label: "Car rental", path: "/rentals" },
      { id: "rental-catalog", label: "Rental catalog", path: "/rentals/catalog" },
      { id: "school-shuttles", label: "School shuttles", path: "/school-shuttles/routes" },
      { id: "tours", label: "Tours", path: "/tours" },
      { id: "ambulance", label: "Ambulance/EMS", path: "/ambulance/dispatch" }
    ]
  },
  {
    id: "assets",
    label: "Assets",
    items: [
      { id: "drivers", label: "Drivers", path: "/drivers" },
      { id: "vehicles", label: "Vehicles", path: "/vehicles" }
    ]
  },
  {
    id: "money",
    label: "Money",
    items: [
      { id: "earnings-overview", label: "Earnings (overview)", path: "/earnings" },
      { id: "earnings-statements", label: "Statements", path: "/earnings/statements" },
      { id: "driver-payouts", label: "Driver payouts", path: "/earnings/payouts" }
    ]
  },
  {
    id: "safety",
    label: "Safety & compliance",
    items: [
      { id: "compliance-dashboard", label: "Compliance dashboard", path: "/compliance" },
      { id: "incidents", label: "Incidents", path: "/compliance/incidents" },
      { id: "ambulance-cases", label: "Ambulance cases", path: "/ambulance/cases" }
    ]
  },
  {
    id: "support",
    label: "Support",
    items: [
      { id: "training-centre", label: "Training centre", path: "/training" },
      { id: "help", label: "Help & support", path: "/help" }
    ]
  },
  {
    id: "settings",
    label: "Settings",
    items: [
      { id: "settings-profile", label: "My account", path: "/settings/profile" },
      { id: "settings-fleet", label: "Fleet Partner profile", path: "/settings/fleet-partner" },
      { id: "settings-branches", label: "Branches", path: "/settings/branches" },
      { id: "settings-roles", label: "Roles & permissions", path: "/settings/roles" },
      { id: "settings-integrations", label: "Integrations", path: "/settings/integrations" },
      {
        id: "settings-account-security",
        label: "Account security",
        path: "/settings/account-security"
      },
      {
        id: "settings-2fa-setup",
        label: "Two-factor setup",
        path: "/settings/account-security/2fa-setup"
      },
      {
        id: "settings-sessions",
        label: "Sessions",
        path: "/settings/account-security/sessions"
      }
    ]
  }
];

const NAV_PATHS = NAV_SECTIONS.reduce((acc, section) => {
  section.items.forEach((item) => {
    acc[item.id] = item.path;
  });
  return acc;
}, {} as Record<string, string>);

const NAV_ICONS: Record<string, React.ReactNode> = {
  dashboard: <DashboardIcon fontSize="inherit" />,
  "live-map": <MapIcon fontSize="inherit" />,
  dispatch: <DispatchIcon fontSize="inherit" />,
  trips: <TripsIcon fontSize="inherit" />,
  rentals: <RentalsIcon fontSize="inherit" />,
  "rental-catalog": <CatalogIcon fontSize="inherit" />,
  "school-shuttles": <SchoolIcon fontSize="inherit" />,
  tours: <ToursIcon fontSize="inherit" />,
  ambulance: <AmbulanceIcon fontSize="inherit" />,
  drivers: <DriversIcon fontSize="inherit" />,
  vehicles: <VehiclesIcon fontSize="inherit" />,
  "earnings-overview": <EarningsIcon fontSize="inherit" />,
  "earnings-statements": <StatementsIcon fontSize="inherit" />,
  "driver-payouts": <PayoutsIcon fontSize="inherit" />,
  "compliance-dashboard": <ComplianceIcon fontSize="inherit" />,
  incidents: <IncidentsIcon fontSize="inherit" />,
  "ambulance-cases": <AmbulanceCasesIcon fontSize="inherit" />,
  "training-centre": <TrainingIcon fontSize="inherit" />,
  help: <HelpIcon fontSize="inherit" />,
  "settings-profile": <ProfileIcon fontSize="inherit" />,
  "settings-fleet": <FleetIcon fontSize="inherit" />,
  "settings-branches": <BranchesIcon fontSize="inherit" />,
  "settings-roles": <RolesIcon fontSize="inherit" />,
  "settings-integrations": <IntegrationsIcon fontSize="inherit" />,
  "settings-account-security": <SecurityIcon fontSize="inherit" />,
  "settings-2fa-setup": <TwoFAIcon fontSize="inherit" />,
  "settings-sessions": <SessionsIcon fontSize="inherit" />,
};

export default function FleetPartnerAppShell() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Determine active nav ID strictly
  const activeNavId = Object.entries(NAV_PATHS).find(([_, path]) =>
    pathname === path || (pathname.startsWith(path + '/') && path !== '/')
  )?.[0] || '';

  const onNavClick = (id: string) => {
    const path = NAV_PATHS[id];
    if (path) navigate(path);
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside className={`w-64 flex-shrink-0 bg-slate-900 text-white border-r border-slate-800 transition-all duration-300 md:relative fixed inset-y-0 z-50 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center px-4 border-b border-slate-800/60 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold">
                FP
              </div>
              <span className="font-bold text-lg tracking-tight">Fleet Partner</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6 scrollbar-thin scrollbar-thumb-slate-700">
            {NAV_SECTIONS.map((section) => (
              <div key={section.id}>
                <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  {section.label}
                </div>
                <ul className="space-y-0.5">
                  {section.items.map((item) => (
                    <li key={item.id}>
                      <NavButton
                        active={item.id === activeNavId}
                        onClick={() => onNavClick(item.id)}
                      >
                        <span className="flex items-center gap-2.5 flex-1 min-w-0">
                          <span className={`w-5 flex items-center justify-center text-[18px] flex-shrink-0 transition-colors ${item.id === activeNavId ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-300'}`}>
                            {NAV_ICONS[item.id] || "•"}
                          </span>
                          <span className="truncate text-[13px]">{item.label}</span>
                        </span>
                        {item.badge && (
                          <Chip className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] h-5 px-1.5 leading-none flex items-center">
                            {item.badge}
                          </Chip>
                        )}
                      </NavButton>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-800/60 text-[11px] text-slate-500 flex-shrink-0 bg-slate-900">
            <div className="flex justify-between items-center mb-2">
              <span>© {new Date().getFullYear()} EVzone</span>
              <span className="text-slate-600">v0.1.0</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 flex-shrink-0 z-10 relative">
          <div className="flex items-center gap-4">
            {/* Mobile sidebar toggle could go here */}
            <h1 className="text-xl font-semibold text-slate-900 hidden sm:block">
              {Object.values(NAV_PATHS).includes(pathname)
                ? NAV_SECTIONS.flatMap(s => s.items).find(i => i.path === pathname)?.label
                : ''}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="h-4 w-px bg-slate-300 mx-2"></div>
            {/* User profile could go here */}
            <div className="text-sm font-medium text-slate-700">Manager</div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-auto bg-slate-50">
          <Outlet />
          <div className="h-10"></div> {/* Spacer */}
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}
