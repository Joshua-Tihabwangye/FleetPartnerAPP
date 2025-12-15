import React from "react";
import { Link } from "react-router-dom";
import { ThemeToggle, useTheme } from "../../context/ThemeContext";
import { useLanguage, LANGUAGES } from "../../context/LanguageContext";

export default function FleetPartnerWebsiteHomePage() {
  const { isDark } = useTheme();
  const { language, setLanguage } = useLanguage();

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
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="h-9 w-9 rounded-xl bg-ev-green flex items-center justify-center text-sm font-black text-white shadow-lg shadow-emerald-500/20">
                EV
              </div>
              <div className="hidden sm:block">
                <span className={isDark ? "text-white font-semibold" : "text-slate-900 font-semibold"}>EVzone Fleet Partner</span>
                <p className="text-xs text-slate-500">Rides · Delivery · Rentals · Shuttles · Tours · EMS</p>
              </div>
            </div>

            {/* Nav Links */}
            <nav className={`hidden lg:flex items-center gap-8 text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <a href="#who" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>Who it is for</a>
              <a href="#why" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>Why Fleet Partner</a>
              <a href="#how" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>How it works</a>
              <a href="#features" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>Features</a>
              <a href="#faq" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>FAQ</a>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4 shrink-0">
              {/* Language Selector */}
              <div className="relative hidden sm:block">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as typeof language)}
                  className={`appearance-none pl-8 pr-8 py-2 rounded-xl border text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-ev-green transition-all ${isDark
                    ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.nativeName}
                    </option>
                  ))}
                </select>
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm pointer-events-none">
                  {LANGUAGES.find(l => l.code === language)?.flag}
                </span>
                <span className={`absolute right-2.5 top-1/2 -translate-y-1/2 text-xs pointer-events-none ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  ▼
                </span>
              </div>
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>
              <Link
                to="/login"
                className={`px-4 py-2 text-sm font-medium transition ${isDark ? 'text-white hover:text-ev-green' : 'text-slate-700 hover:text-ev-green'}`}
              >
                Sign in
              </Link>
              <Link
                to="/fleet-partner/register"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-ev-green to-emerald-600 text-white text-sm font-bold hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                Become a Partner
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden w-full">
        {/* Animated background elements - only in dark mode */}
        {isDark && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-96 h-96 bg-ev-green/10 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
          </div>
        )}

        <div className="relative w-full px-4 sm:px-6 lg:px-12 xl:px-16 py-20 sm:py-28">
          <div className="text-center mb-16 max-w-5xl mx-auto">
            <div className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm mb-8 border backdrop-blur-md ${isDark
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 shadow-emerald-500/10 shadow-lg"
              : "border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm"
              }`}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-medium">The EV-first platform for modern fleets</span>
            </div>
            <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-8 leading-tight tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              One Control Room for <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ev-green via-emerald-400 to-teal-500">All Your Operations</span>
            </h1>
            <p className={`text-xl sm:text-2xl max-w-3xl mx-auto mb-10 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Give your dispatchers, fleet managers and finance teams a single workspace to run every
              vehicle, driver and trip — EV-first, but ready for mixed fleets.
            </p>
            <div className="flex flex-wrap justify-center gap-5">
              <Link
                to="/fleet-partner/register"
                className="inline-flex items-center px-8 py-4 rounded-2xl bg-gradient-to-r from-ev-green to-emerald-600 text-white font-bold text-lg hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-1 transition-all duration-300"
              >
                Start Free Trial
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
              <Link
                to="/login"
                className={`inline-flex items-center px-8 py-4 rounded-2xl border-2 font-bold text-lg transition-all duration-300 backdrop-blur-sm ${isDark
                  ? "border-slate-700 bg-slate-800/50 text-white hover:bg-slate-700/80 hover:border-slate-600 hover:-translate-y-1"
                  : "border-slate-200 bg-white/80 text-slate-700 hover:bg-white hover:border-slate-300 hover:shadow-lg hover:-translate-y-1"
                  }`}
              >
                View Demo
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
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
