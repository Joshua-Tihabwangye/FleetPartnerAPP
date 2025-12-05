import React from "react";
import { Link } from "react-router-dom";
import { ThemeToggle, useTheme } from "../../context/ThemeContext";

export default function FleetPartnerWebsiteHomePage() {
  const { isDark } = useTheme();

  const features = [
    { icon: "🚗", title: "Rides & Delivery", desc: "Electric rides and package delivery across the city" },
    { icon: "🚘", title: "Car Rentals", desc: "Premium EV fleet for short and long-term rentals" },
    { icon: "🚌", title: "School Shuttles", desc: "Safe, reliable student transportation" },
    { icon: "🌍", title: "Tours", desc: "Guided tours with sustainable transportation" },
    { icon: "🚑", title: "Ambulance/EMS", desc: "Emergency medical services with rapid response" },
    { icon: "📊", title: "Analytics", desc: "Real-time fleet performance insights" }
  ];

  const stats = [
    { value: "500+", label: "Active Vehicles" },
    { value: "1,200+", label: "Drivers" },
    { value: "50K+", label: "Daily Trips" },
    { value: "99.9%", label: "Uptime" }
  ];

  return (
    <div className={isDark
      ? "min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900"
      : "min-h-screen bg-white"
    }>
      {/* Header Nav - SINGLE HEADER */}
      <header className={isDark
        ? "sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800"
        : "sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm"
      }>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-ev-green flex items-center justify-center text-sm font-black text-white">
                EV
              </div>
              <div className="hidden sm:block">
                <span className={isDark ? "text-white font-semibold" : "text-slate-900 font-semibold"}>EVzone Fleet Partner</span>
                <p className="text-xs text-slate-500">Rides · Delivery · Rentals · Shuttles · Tours · EMS</p>
              </div>
            </div>

            {/* Nav Links */}
            <nav className={`hidden md:flex items-center gap-6 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <a href="#who" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>Who it is for</a>
              <a href="#why" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>Why Fleet Partner</a>
              <a href="#how" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>How it works</a>
              <a href="#features" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>Features</a>
              <a href="#faq" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>FAQ</a>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link
                to="/login"
                className={`px-4 py-2 text-sm font-medium transition ${isDark ? 'text-white hover:text-ev-green' : 'text-slate-700 hover:text-ev-green'}`}
              >
                Sign in
              </Link>
              <Link
                to="/fleet-partner/register"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-ev-green to-orange-500 text-white text-sm font-semibold hover:opacity-90 hover:scale-105 transition-all shadow-lg shadow-emerald-500/20"
              >
                Become a Fleet Partner
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background elements - only in dark mode */}
        {isDark && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-ev-green/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          </div>
        )}

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-24">
          <div className="text-center mb-12">
            <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm mb-6 ${isDark
              ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : "border border-ev-green/30 bg-ev-green/10 text-ev-green"
              }`}>
              <span className="h-2 w-2 rounded-full bg-ev-green animate-pulse" />
              <span>EV-first platform for fleet operators</span>
            </div>
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              One Control Room for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ev-green to-orange-500">All Your Fleet Operations</span>
            </h1>
            <p className={`text-lg sm:text-xl max-w-3xl mx-auto mb-8 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Give your dispatchers, fleet managers and finance teams a single workspace to run every
              vehicle, driver and trip — EV-first, but ready for mixed fleets where you need it.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/fleet-partner/register"
                className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-ev-green to-orange-500 text-white font-semibold hover:opacity-90 transition shadow-lg shadow-emerald-500/25 hover-lift"
              >
                Become a Fleet Partner
                <span className="ml-2">→</span>
              </Link>
              <Link
                to="/login"
                className={`inline-flex items-center px-6 py-3 rounded-xl border font-semibold transition backdrop-blur ${isDark
                  ? "border-slate-600 bg-slate-800/50 text-white hover:bg-slate-700/50 hover:border-ev-green"
                  : "border-slate-300 bg-white text-slate-700 hover:border-ev-green hover:text-ev-green"
                  }`}
              >
                Sign in to Dashboard
              </Link>
            </div>
          </div>

          {/* Live Stats Preview */}
          <div className={`rounded-2xl border p-6 shadow-2xl ${isDark
            ? "bg-slate-800/50 backdrop-blur-xl border-slate-700/50"
            : "bg-slate-100 border-slate-200"
            }`}>
            <div className="flex items-center justify-between mb-4">
              <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Fleet snapshot (sample)</span>
              <span className="flex items-center gap-2 text-xs text-emerald-500">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Updated 15 sec ago
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl border p-4 text-center transition hover-lift ${isDark
                    ? "bg-slate-900/50 border-slate-700/50 hover:border-emerald-500/50"
                    : "bg-white border-slate-200 hover:border-ev-green"
                    }`}
                >
                  <div className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</div>
                  <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className={`py-16 ${isDark ? '' : 'bg-slate-50'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Everything You Need to Run Your Fleet
            </h2>
            <p className={`max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              From ride-hailing to ambulance dispatch, manage all your fleet operations from one powerful platform.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className={`rounded-xl border p-6 transition-all duration-300 hover-lift group cursor-pointer ${isDark
                  ? "bg-slate-800/50 border-slate-700/50 hover:border-emerald-500/50 hover:bg-slate-800"
                  : "bg-white border-slate-200 hover:border-ev-green hover:shadow-lg"
                  }`}
              >
                <div className="text-4xl mb-4 feature-icon">{feature.icon}</div>
                <h3 className={`text-lg font-semibold mb-2 group-hover:text-ev-green transition ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {feature.title}
                </h3>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className={`py-16 ${isDark ? 'bg-slate-800/30' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className={`rounded-2xl border p-6 hover-lift ${isDark
              ? "bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 border-emerald-700/50"
              : "bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200"
              }`}>
              <div className="text-3xl mb-3">🏢</div>
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Built for Real Operators</h3>
              <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Multi-service fleets, dispatch desks, branches and real payouts — not just a rider app.
              </p>
            </div>
            <div className={`rounded-2xl border p-6 hover-lift ${isDark
              ? "bg-gradient-to-br from-orange-900/50 to-orange-800/30 border-orange-700/50"
              : "bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200"
              }`}>
              <div className="text-3xl mb-3">⚡</div>
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>EV-first, Mixed Where Needed</h3>
              <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Enforce EV-only for rides and delivery, but allow shuttles, tours and ambulances to stay mixed.
              </p>
            </div>
            <div className={`rounded-2xl border p-6 hover-lift ${isDark
              ? "bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-700/50"
              : "bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200"
              }`}>
              <div className="text-3xl mb-3">🎓</div>
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Operator-Friendly Onboarding</h3>
              <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Setup wizard, training tracks and clear roles for Fleet Owners, Managers, Dispatchers and Finance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className={`py-16 ${isDark ? '' : 'bg-slate-50'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className={`rounded-2xl border p-8 sm:p-12 text-center ${isDark
            ? "bg-gradient-to-r from-ev-green/20 to-emerald-600/20 border-emerald-500/30"
            : "bg-gradient-to-r from-ev-green/10 to-orange-500/10 border-ev-green/30"
            }`}>
            <h2 className={`text-2xl sm:text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Ready to Transform Your Fleet?
            </h2>
            <p className={`mb-6 max-w-xl mx-auto ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Join hundreds of fleet operators who trust EVzone to manage their operations efficiently.
            </p>
            <Link
              to="/fleet-partner/register"
              className="inline-flex items-center px-8 py-4 rounded-xl bg-gradient-to-r from-ev-green to-orange-500 text-white font-semibold text-lg hover:opacity-90 transition shadow-lg shadow-emerald-500/25 hover-lift"
            >
              Get Started Today
              <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={`border-t py-8 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-ev-green flex items-center justify-center text-[9px] font-bold text-white">
                EV
              </div>
              <span>© {new Date().getFullYear()} EVzone Fleet Partner</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className={`transition ${isDark ? 'hover:text-slate-300' : 'hover:text-slate-700'}`}>Privacy</a>
              <a href="#" className={`transition ${isDark ? 'hover:text-slate-300' : 'hover:text-slate-700'}`}>Terms</a>
              <a href="#" className={`transition ${isDark ? 'hover:text-slate-300' : 'hover:text-slate-700'}`}>Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
