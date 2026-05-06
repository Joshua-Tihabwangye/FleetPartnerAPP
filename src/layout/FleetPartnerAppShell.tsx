import React, { useState, useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Typography from "../components/ui/Typography";
import Chip from "../components/ui/Chip";
import { ToastContainer } from "../components/ui/Toast";
import { useToast } from "../hooks/useToast";
import NotificationCenter from "../components/NotificationCenter";
import GlobalSearch from "../components/GlobalSearch";
import UserProfileMenu from "../components/UserProfileMenu";
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
  LocalHospital as AmbulanceCasesIcon,
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
    "bg-ev-green text-white shadow-sm shadow-emerald-500/40 font-medium";
  const inactiveClasses = "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80";
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
      { id: "school-shuttles", label: "School Shuttles", path: "/school-shuttles" },
      { id: "tours", label: "Tours", path: "/tours" },
      { id: "ambulance", label: "Ambulance/EMS", path: "/ambulance" }
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
      { id: "earnings-overview", label: "Earnings (overview)", path: "/earnings" }
    ]
  },
  {
    id: "safety",
    label: "Safety & compliance",
    items: [
      { id: "compliance-dashboard", label: "Compliance dashboard", path: "/compliance" }
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
  "compliance-dashboard": <ComplianceIcon fontSize="inherit" />,
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
  const { toasts, removeToast } = useToast();

  // Determine active nav ID strictly - check more specific paths first
  const activeNavId = Object.entries(NAV_PATHS)
    .sort(([_, a], [__, b]) => b.length - a.length) // Sort by path length (longer paths first)
    .find(([_, path]) => {
      // Exact match
      if (pathname === path) return true;
      // Sub-path match (but ensure we don't match partial names like /setting-up vs /settings)
      if (pathname.startsWith(path + '/')) return true;
      return false;
    })?.[0] || '';

  const onNavClick = (id: string) => {
    const path = NAV_PATHS[id];
    if (path) {
      navigate(path);
      // Auto-close sidebar on mobile when nav item is clicked
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* Mobile Overlay Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full md:translate-x-0 md:w-16'
        } flex-shrink-0 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 md:relative fixed inset-y-0 left-0 z-50 overflow-hidden`}>
        <div className="h-full flex flex-col">
          {/* Logo & Toggle */}
          <div className={`h-16 flex items-center justify-between px-3 border-b border-slate-200 dark:border-slate-700/60 flex-shrink-0 ${!sidebarOpen && 'md:px-2'}`}>
            <div className={`flex items-center gap-2 ${!sidebarOpen ? 'justify-center w-full md:w-auto' : ''}`}>
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                FP
              </div>
              {sidebarOpen && <span className="font-bold text-lg tracking-tight whitespace-nowrap">Fleet Partner</span>}
            </div>
            {sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden md:block"
                title="Collapse sidebar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
            )}
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden md:block"
                title="Expand sidebar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          {/* Mobile Utility Controls */}
          <div className="md:hidden px-3 py-3 border-b border-slate-200 dark:border-slate-700/60 space-y-3">
            <GlobalSearch />
            <div className="flex items-center justify-between">
              <NotificationCenter />
              <ThemeToggle />
              <UserProfileMenu userName="Fleet Manager" userEmail="manager@evzone.com" />
            </div>
          </div>

          {/* Nav Items */}
          <nav className={`sidebar-scrollbar-hide flex-1 overflow-y-auto py-4 space-y-6 ${sidebarOpen ? 'px-2' : 'px-1'}`}>
            {NAV_SECTIONS.map((section) => (
              <div key={section.id}>
                {sidebarOpen && (
                  <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {section.label}
                  </div>
                )}
                <ul className="space-y-0.5">
                  {section.items.map((item) => (
                    <li key={item.id}>
                      <NavButton
                        active={item.id === activeNavId}
                        onClick={() => onNavClick(item.id)}
                        className={!sidebarOpen ? 'justify-center px-2' : ''}
                        title={!sidebarOpen ? item.label : undefined}
                      >
                        <span className={`flex items-center ${sidebarOpen ? 'gap-2.5 flex-1 min-w-0' : 'justify-center'}`}>
                          <span className={`w-5 flex items-center justify-center text-[18px] flex-shrink-0 transition-colors ${item.id === activeNavId ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                            {NAV_ICONS[item.id] || "•"}
                          </span>
                          {sidebarOpen && <span className="truncate text-[13px]">{item.label}</span>}
                        </span>
                        {sidebarOpen && item.badge && (
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
          {sidebarOpen && (
            <div className="p-4 border-t border-slate-200 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400 flex-shrink-0 bg-slate-50 dark:bg-slate-900">
              <div className="flex justify-between items-center">
                <span>© {new Date().getFullYear()} EVzone</span>
                <span className="text-slate-500 dark:text-slate-500">v0.1.0</span>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 flex-shrink-0 z-10 relative gap-2">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile sidebar toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              title="Toggle sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-white hidden lg:block truncate max-w-[55vw]">
              {Object.values(NAV_PATHS).includes(pathname)
                ? NAV_SECTIONS.flatMap(s => s.items).find(i => i.path === pathname)?.label
                : ''}
            </h1>
          </div>
          
          {/* Desktop Header Items */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3 min-w-0">
            <GlobalSearch />
            <NotificationCenter />
            <div className="h-4 w-px bg-slate-300 dark:bg-slate-600 mx-1"></div>
            <ThemeToggle />
            <div className="h-4 w-px bg-slate-300 dark:bg-slate-600 mx-1"></div>
            <UserProfileMenu userName="Fleet Manager" userEmail="manager@evzone.com" />
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden min-w-0 bg-slate-50 dark:bg-slate-900">
          <Outlet />
          <div className="h-10"></div> {/* Spacer */}
        </main>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
