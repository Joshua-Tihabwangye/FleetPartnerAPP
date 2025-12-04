import React, { useState, useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Typography from "../components/ui/Typography";
import Chip from "../components/ui/Chip";
import { ToastContainer } from "../components/ui/Toast";
import { useToast } from "../hooks/useToast";

// Small internal button components
function IconButton({ children, className = "", ...rest }) {
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

function NavButton({ active, children, className = "", ...rest }) {
  const base =
    "w-full flex items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-left transition text-[10px]";
  const activeClasses =
    "bg-ev-green text-ev-slate shadow-sm shadow-emerald-500/40";
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
}, {});

const NAV_ICONS = {
  dashboard: "🏠",
  "live-map": "🗺️",
  dispatch: "📲",
  trips: "🚗",
  rentals: "🚘",
  "rental-catalog": "🧾",
  "school-shuttles": "🚌",
  tours: "🌍",
  ambulance: "🚑",
  drivers: "👤",
  vehicles: "🚙",
  "earnings-overview": "💰",
  "earnings-statements": "📄",
  "driver-payouts": "🧾",
  "compliance-dashboard": "⚖️",
  incidents: "⚠️",
  "ambulance-cases": "🚨",
  "training-centre": "🎓",
  help: "❓",
  "settings-profile": "🙋",
  "settings-fleet": "⚙️",
  "settings-branches": "🏢",
  "settings-roles": "👥",
  "settings-integrations": "🔌",
  "settings-account-security": "🔐",
  "settings-2fa-setup": "📲",
  "settings-sessions": "🖥️"
};

// Example search queries for dropdown
const EXAMPLE_QUERIES = [
  "UAX 123A",
  "John Doe",
  "Trip #23421"
];

export default function FleetPartnerAppShell() {
  const [theme, setTheme] = useState("light");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [hasSearchedBefore, setHasSearchedBefore] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const notificationsRef = useRef(null);
  const searchRef = useRef(null);
  const { toasts, removeToast } = useToast();

  const isLight = theme === "light";

  // Close notifications panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };

    if (notificationsOpen || showSearchDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notificationsOpen, showSearchDropdown]);

  // active nav determined by current path
  const pathname = location.pathname;
  let activeNavId = "dashboard";
  Object.entries(NAV_PATHS).forEach(([id, path]) => {
    if (pathname === path || (pathname.startsWith(path) && path !== "/")) {
      activeNavId = id;
    }
  });

  const handleNavClick = (id) => {
    const path = NAV_PATHS[id];
    if (path) {
      navigate(path);
      setSidebarOpen(false);
    }
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleSearchFocus = () => {
    if (!hasSearchedBefore) {
      setShowSearchDropdown(true);
    }
  };

  const handleExampleClick = (query) => {
    setSearchQuery(query);
    setShowSearchDropdown(false);
    setHasSearchedBefore(true);
  };

  const rootBg = isLight ? "bg-slate-50 text-slate-900" : "bg-slate-900 text-slate-50";
  const mainBg = isLight ? "bg-slate-50" : "bg-slate-800";
  const topBarBg = isLight
    ? "bg-white/90 border-b border-slate-200"
    : "bg-slate-950/95 border-b border-slate-800";
  const sideBarBg = "bg-[#041427] text-slate-50";

  return (
    <div className={"min-h-screen flex flex-col " + rootBg}>
      {/* Top bar */}
      <header className={topBarBg + " backdrop-blur sticky top-0 z-40 shadow-sm shadow-black/5"}>
        <div className="h-14 px-3 sm:px-4 lg:px-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <IconButton
              className="sm:hidden bg-slate-900 text-slate-50"
              aria-label="Toggle sidebar"
              onClick={() => setSidebarOpen((prev) => !prev)}
            >
              ☰
            </IconButton>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity cursor-pointer"
              aria-label="Go to dashboard"
            >
              <div className="h-8 w-8 rounded-xl bg-ev-green flex items-center justify-center text-[11px] font-black tracking-tight text-ev-slate">
                EV
              </div>
              <div className="flex flex-col leading-tight">
                <Typography variant="subtitle2" className="text-[13px] font-semibold tracking-tight">
                  EVzone Fleet Partner
                </Typography>
                <Typography variant="caption" className="text-[11px] text-slate-500">
                  Rides · Delivery · Rentals · Shuttles · Tours · EMS
                </Typography>
              </div>
            </button>
          </div>

          {/* Global Search Bar with Dropdown */}
          <div className="hidden md:flex flex-1 max-w-xl items-center gap-2 mx-4 relative" ref={searchRef}>
            <div className="flex-1 flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px]">
              <span className="mr-2 text-slate-500">🔍</span>
              <input
                type="text"
                placeholder="Search drivers, vehicles, trips or bookings (global search)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleSearchFocus}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    setShowSearchDropdown(false);
                    setHasSearchedBefore(true);
                    console.log('Searching for:', searchQuery);
                  }
                }}
                className="flex-1 bg-transparent outline-none text-slate-900 placeholder:text-slate-500"
              />
            </div>

            {/* Search Dropdown */}
            {showSearchDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                <div className="px-3 py-1.5 text-[10px] text-slate-400 uppercase tracking-wide">
                  Example queries
                </div>
                {EXAMPLE_QUERIES.map((query, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleExampleClick(query)}
                    className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <span className="text-slate-400">🔍</span>
                    {query}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Chip
              className={
                (isLight
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                  : "bg-emerald-950 text-emerald-300 border border-emerald-800") +
                " hidden sm:inline-flex"
              }
            >
              Staging workspace
            </Chip>
            <div className="relative" ref={notificationsRef}>
              <IconButton
                aria-label="Notifications"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className={isLight ? "bg-slate-100 text-slate-800" : "bg-slate-800 text-slate-100"}
              >
                <span className="relative">
                  <span>🔔</span>
                  <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500 border border-slate-950" />
                </span>
              </IconButton>

              {notificationsOpen && (
                <div className={"absolute right-0 top-12 w-80 rounded-lg shadow-lg border z-50 " + (isLight ? "bg-white border-slate-200" : "bg-slate-800 border-slate-700")}>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-sm">Notifications</h3>
                      <button
                        onClick={() => setNotificationsOpen(false)}
                        className="text-slate-500 hover:text-slate-700"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div className="text-center py-8 text-slate-500 text-sm">
                        No notifications present
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <IconButton
              onClick={handleToggleTheme}
              className={isLight ? "bg-slate-100 text-slate-900" : "bg-slate-800 text-slate-100"}
              aria-label="Toggle theme"
            >
              {isLight ? "🌙" : "☀️"}
            </IconButton>
            <div className="h-8 w-8 rounded-full bg-slate-900 text-slate-50 flex items-center justify-center text-[11px] font-semibold">
              FO
            </div>
          </div>
        </div>
      </header>

      {/* Main area */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar desktop */}
        <aside
          className={
            sideBarBg + " w-64 flex-shrink-0 border-r border-slate-900/60 hidden sm:flex flex-col"
          }
        >
          <SidebarContent activeNavId={activeNavId} onNavClick={handleNavClick} />
        </aside>

        {/* Sidebar mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-30 flex sm:hidden">
            <div className={sideBarBg + " w-64 flex-shrink-0 shadow-2xl flex flex-col h-full"}>
              <SidebarContent activeNavId={activeNavId} onNavClick={handleNavClick} />
            </div>
            <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
          </div>
        )}

        {/* Routed content */}
        <main className={"flex-1 min-w-0 overflow-y-auto " + mainBg}>
          <Outlet />
        </main>
      </div>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

function SidebarContent({ activeNavId, onNavClick }) {
  return (
    <div className="h-full flex flex-col">
      <div className="px-3 pt-3 pb-2 text-[10px] uppercase tracking-wider text-slate-400 opacity-60">
        Fleet navigation
      </div>
      <nav className="flex-1 overflow-y-auto px-2 pb-4 text-[10px]">
        {NAV_SECTIONS.map((section, sectionIdx) => (
          <div key={section.id} className={sectionIdx > 0 ? "mt-5" : ""}>
            <Typography
              variant="caption"
              className="text-[9px] uppercase tracking-wider text-slate-500 opacity-60 px-2 mb-1.5"
            >
              {section.label}
            </Typography>
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.id}>
                  <NavButton active={item.id === activeNavId} onNavClick={onNavClick}>
                    <span
                      className="flex items-center gap-2 flex-1"
                      onClick={() => onNavClick(item.id)}
                    >
                      <span className="w-4 text-[12px] opacity-70 flex-shrink-0">
                        {NAV_ICONS[item.id] || "•"}
                      </span>
                      <span className="truncate text-[10px]">{item.label}</span>
                    </span>
                    {item.badge && (
                      <Chip className="bg-emerald-900/60 text-emerald-100 border border-emerald-500/60">
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
      <div className="border-t border-slate-800/60 px-3 py-3 text-[10px] text-slate-500 flex items-center justify-between">
        <span>© {new Date().getFullYear()} EVzone</span>
        <span className="text-slate-400">Fleet Partner</span>
      </div>
    </div>
  );
}
