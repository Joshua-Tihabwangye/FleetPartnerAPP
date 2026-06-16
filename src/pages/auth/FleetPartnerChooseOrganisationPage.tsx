import React, { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { auth, useAuthState } from "../../utils/auth";

export default function FleetPartnerChooseOrganisationPage() {
  const navigate = useNavigate();
  const { authState, loading } = useAuthState();
  const organizations = useMemo(() => auth.getOrganizations(), []);
  const [selectedOrg, setSelectedOrg] = useState("");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
        <div className="h-8 w-8 border-2 border-ev-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (organizations.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 text-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-emerald-500/40 bg-black/40 shadow-xl shadow-black/40 p-5 sm:p-6 text-center space-y-4">
          <div className="text-4xl">🏢</div>
          <h1 className="text-[18px] font-semibold">No Fleet Partner workspace</h1>
          <p className="text-[12px] text-emerald-100/80">
            Your EVzone account is not linked to any Fleet Partner organization. Contact your
            administrator to request access.
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const org = organizations.find((o) => o.id === selectedOrg);
    if (org) {
      auth.setSelectedOrganization(org);
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 text-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-emerald-500/40 bg-black/40 shadow-xl shadow-black/40 p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-xl bg-ev-green flex items-center justify-center text-[11px] font-black text-ev-slate">
            EV
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">EVzone Fleet Partner</span>
            <span className="text-[11px] text-emerald-100/90">Fleet Partner workspace</span>
          </div>
        </div>
        <h1 className="text-[18px] font-semibold mb-1">Switch organisation</h1>
        <p className="text-[12px] text-emerald-100/80 mb-4">
          You have access to multiple Fleet Partner workspaces. Select one to continue.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3 text-[12px]">
          <div className="space-y-2">
            {organizations.map((org) => (
              <label
                key={org.id}
                className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition ${selectedOrg === org.id
                    ? "border-emerald-500 bg-emerald-950/30"
                    : "border-emerald-500/30 bg-black/20 hover:bg-black/30"
                  }`}
              >
                <input
                  type="radio"
                  name="organisation"
                  value={org.id}
                  checked={selectedOrg === org.id}
                  onChange={(e) => setSelectedOrg(e.target.value)}
                  className="h-4 w-4 text-ev-green focus:ring-emerald-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-slate-50">{org.name}</div>
                  <div className="text-[11px] text-emerald-200/80">{org.role || "Member"}</div>
                </div>
              </label>
            ))}
          </div>
          <button
            type="submit"
            disabled={!selectedOrg}
            className="w-full rounded-xl bg-ev-green text-ev-slate font-semibold py-2 text-[12px] hover:bg-ev-green-dark focus:outline-none focus:ring-2 focus:ring-emerald-500/80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to workspace
          </button>
        </form>
      </div>
    </div>
  );
}
