import React, { useState, useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Typography from "../components/ui/Typography";
import Chip from "../components/ui/Chip";
import { ToastContainer } from "../components/ui/Toast";
import { useToast } from "../hooks/useToast";
import { auth } from "../utils/auth";
import { useTheme, ThemeToggle } from "../context/ThemeContext";

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

// ... (skipping to NavButton usage)

{
  section.items.map((item) => (
    <li key={item.id}>
      <NavButton active={item.id === activeNavId}>
        <span
          className="flex items-center gap-2.5 flex-1"
          onClick={() => onNavClick(item.id)}
        >
          <span className="w-5 text-[15px] flex-shrink-0">
            {(NAV_ICONS as any)[item.id] || "•"}
          </span>
          <span className="truncate text-[13px]">{item.label}</span>
        </span>
        {item.badge && (
          <Chip className="bg-emerald-900/60 text-emerald-100 border border-emerald-500/60">
            {item.badge}
          </Chip>
        )}
      </NavButton>
    </li>
  ))
}
<span
  className="flex items-center gap-2.5 flex-1"
  onClick={() => onNavClick(item.id)}
>
  <span className="w-5 text-[15px] flex-shrink-0">
    {NAV_ICONS[item.id] || "•"}
  </span>
  <span className="truncate text-[13px]">{item.label}</span>
</span>
{
  item.badge && (
    <Chip className="bg-emerald-900/60 text-emerald-100 border border-emerald-500/60">
      {item.badge}
    </Chip>
  )
}
                  </NavButton >
                </li >
              ))}
            </ul >
          </div >
        ))}
      </nav >
  <div className="border-t border-slate-800/60 px-3 py-3 text-[11px] text-slate-500 flex items-center justify-between">
    <span>© {new Date().getFullYear()} EVzone</span>
    <span className="text-slate-400">Fleet Partner</span>
  </div>
    </div >
  );
}
