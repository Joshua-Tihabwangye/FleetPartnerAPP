import React from "react";

export default function FleetPartnerProfilePage() {
  return (
    <div className="min-h-[calc(100vh-56px)] px-4 sm:px-6 lg:px-10 py-4">
      <div className="max-w-3xl space-y-4">
        <h1 className="text-lg sm:text-xl font-semibold text-slate-900">My account</h1>
        <p className="text-sm text-slate-600">
          Manage your personal profile, language and notification preferences for the Fleet Partner
          portal.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[13px]">
          <div className="md:col-span-2 space-y-3">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm shadow-black/5 p-4 space-y-3">
              <h2 className="text-[13px] font-semibold text-slate-900">Profile details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block text-xs space-y-1">
                  <span className="text-[11px] text-slate-700">Full name</span>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                    placeholder="Fleet Owner"
                  />
                </label>
                <label className="block text-xs space-y-1">
                  <span className="text-[11px] text-slate-700">Work email</span>
                  <input
                    type="email"
                    disabled
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500"
                    value="owner@examplefleet.com"
                    readOnly
                  />
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block text-xs space-y-1">
                  <span className="text-[11px] text-slate-700">Mobile phone</span>
                  <input
                    type="tel"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                    placeholder="+256 700 000000"
                  />
                </label>
                <label className="block text-xs space-y-1">
                  <span className="text-[11px] text-slate-700">Language</span>
                  <select className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/60">
                    <option>English</option>
                  </select>
                </label>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-1.5 rounded-xl bg-ev-green text-ev-slate text-xs font-medium hover:bg-ev-green-dark"
                >
                  Save profile
                </button>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm shadow-black/5 p-4 space-y-3">
              <h2 className="text-[13px] font-semibold text-slate-900">Notifications</h2>
              <p className="text-[11px] text-slate-600">
                Control which channels EVzone uses to reach you.
              </p>
              <div className="space-y-2 text-[11px]">
                <label className="flex items-center justify-between gap-2">
                  <span>Email updates</span>
                  <input type="checkbox" className="h-3 w-3 rounded border border-slate-400" />
                </label>
                <label className="flex items-center justify-between gap-2">
                  <span>SMS for urgent issues</span>
                  <input type="checkbox" className="h-3 w-3 rounded border border-slate-400" />
                </label>
                <label className="flex items-center justify-between gap-2">
                  <span>In-portal notifications</span>
                  <input type="checkbox" className="h-3 w-3 rounded border border-slate-400" />
                </label>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-medium hover:bg-slate-50"
                >
                  Save notification settings
                </button>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm shadow-black/5 p-4 text-[11px]">
              <h2 className="text-[13px] font-semibold text-slate-900 mb-1">Security</h2>
              <p className="text-slate-600 mb-2">
                Manage your password, 2FA and active sessions from the account security section.
              </p>
              <a
                href="/settings/account-security"
                className="inline-flex items-center px-3 py-1.5 rounded-xl bg-slate-900 text-slate-50 hover:bg-slate-800"
              >
                Open account security
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
