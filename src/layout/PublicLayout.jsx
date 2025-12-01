import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <header className="h-14 flex items-center justify-between px-4 lg:px-10 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-ev-green flex items-center justify-center text-[11px] font-black text-white">
            EV
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-slate-900">EVzone Fleet Partner</span>
            <span className="text-[11px] text-slate-600">
              Rides · Delivery · Rentals · Shuttles · Tours · EMS
            </span>
          </div>
        </div>
        <nav className="hidden sm:flex items-center gap-4 text-[11px]">
          <Link to="/" className="text-slate-600 hover:text-ev-green">
            Who it is for
          </Link>
          <Link to="/" className="text-slate-600 hover:text-ev-green">
            Why Fleet Partner
          </Link>
          <Link to="/" className="text-slate-600 hover:text-ev-green">
            How it works
          </Link>
          <Link to="/" className="text-slate-600 hover:text-ev-green">
            Features
          </Link>
          <Link to="/" className="text-slate-600 hover:text-ev-green">
            FAQ
          </Link>
        </nav>
        <div className="flex items-center gap-2 text-[11px]">
          <Link
            to="/login"
            className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700"
          >
            Sign in
          </Link>
          <Link
            to="/fleet-partner/register"
            className="inline-flex items-center px-3 py-1.5 rounded-xl bg-ev-green text-white font-medium hover:bg-ev-green-dark"
          >
            Become a Fleet Partner
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 px-4 lg:px-10 py-3 text-[11px] text-slate-600 bg-slate-50">
        © {new Date().getFullYear()} EVzone • Fleet Partner
      </footer>
    </div>
  );
}
