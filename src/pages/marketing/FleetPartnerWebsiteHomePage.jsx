import React from "react";
import { Link } from "react-router-dom";

export default function FleetPartnerWebsiteHomePage() {
  return (
    <div className="min-h-[calc(100vh-56px)] bg-white text-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-16 lg:py-20 flex flex-col gap-10">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-ev-green animate-pulse" />
              <span>EV-first platform for serious fleet operators</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight text-slate-900">
              Fleet Partner: one control room for rides, delivery, rentals, shuttles, tours and EMS.
            </h1>
            <p className="text-[13px] sm:text-sm text-slate-600 max-w-xl">
              Give your dispatchers, fleet managers and finance teams a single workspace to run every
              vehicle, driver and trip — EV-first, but ready for mixed fleets where you need it.
            </p>
            <div className="flex flex-wrap gap-3 text-[11px] pt-1">
              <Link
                to="/fleet-partner/register"
                className="inline-flex items-center rounded-xl px-4 py-2 bg-ev-green text-ev-slate font-medium hover:bg-ev-green-dark"
              >
                Become a Fleet Partner
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center rounded-xl px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700"
              >
                Sign in to dashboard
              </Link>
            </div>
          </div>
          <div className="space-y-3 text-[11px]">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold text-slate-900">
                  Fleet snapshot (sample)
                </span>
                <span className="text-[10px] text-slate-500">Updated 15 sec ago</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div className="rounded-xl bg-white border border-slate-200 px-3 py-2">
                  <div className="text-slate-600 text-[10px]">Vehicles online</div>
                  <div className="text-sm font-semibold text-slate-900">128</div>
                </div>
                <div className="rounded-xl bg-white border border-slate-200 px-3 py-2">
                  <div className="text-slate-600 text-[10px]">Active drivers</div>
                  <div className="text-sm font-semibold text-slate-900">94</div>
                </div>
                <div className="rounded-xl bg-white border border-slate-200 px-3 py-2">
                  <div className="text-slate-600 text-[10px]">Trips today</div>
                  <div className="text-sm font-semibold text-slate-900">1,420</div>
                </div>
                <div className="rounded-xl bg-white border border-slate-200 px-3 py-2">
                  <div className="text-slate-600 text-[10px]">Net revenue</div>
                  <div className="text-sm font-semibold text-ev-green">UGX 12.4M</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2">
                <div className="text-[11px] font-semibold text-slate-900 mb-1">
                  Built for real operators
                </div>
                <p className="text-[11px] text-slate-600">
                  Multi-service fleets, dispatch desks, branches and real payouts — not just a rider app.
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2">
                <div className="text-[11px] font-semibold text-slate-900 mb-1">
                  EV-first, mixed where needed
                </div>
                <p className="text-[11px] text-slate-600">
                  Enforce EV-only for rides and delivery, but allow shuttles, tours and ambulances to stay mixed.
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2">
                <div className="text-[11px] font-semibold text-slate-900 mb-1">
                  Operator-friendly onboarding
                </div>
                <p className="text-[11px] text-slate-600">
                  Setup wizard, training tracks and clear roles for Fleet Owners, Managers, Dispatchers and Finance.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
