import React from "react";
import { Link } from "react-router-dom";

export default function FleetPartnerAccessDeniedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-50 px-4">
      <div className="max-w-md text-center space-y-3">
        <div className="text-4xl">🔒</div>
        <h1 className="text-xl font-semibold">You don&apos;t have access to this area</h1>
        <p className="text-sm text-slate-300">
          Your current role doesn&apos;t include permissions for this section. Contact your Fleet
          Owner or administrator if you think this is a mistake.
        </p>
        <div className="flex flex-wrap justify-center gap-2 text-[12px] mt-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center px-3 py-1.5 rounded-xl bg-ev-green text-ev-slate font-medium hover:bg-ev-green-dark"
          >
            Back to dashboard
          </Link>
          <Link
            to="/settings/profile"
            className="inline-flex items-center px-3 py-1.5 rounded-xl border border-slate-500 bg-slate-900 hover:bg-slate-800"
          >
            Go to my account
          </Link>
        </div>
      </div>
    </div>
  );
}
