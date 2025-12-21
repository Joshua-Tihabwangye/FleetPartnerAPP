import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toastManager } from "../../utils/toastManager";

interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string;
  manager: string;
  email: string;
  isActive: boolean;
}

export default function BranchDetailPage() {
  const { branchId } = useParams();
  const navigate = useNavigate();
  const [branch, setBranch] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load branch from localStorage
    const stored = JSON.parse(localStorage.getItem("branches") || "[]");
    const foundBranch = stored.find((b: Branch) => b.id === parseInt(branchId || "0"));
    
    if (foundBranch) {
      setBranch(foundBranch);
    } else {
      toastManager.show("Branch not found", "error");
      navigate("/settings/branches");
    }
    setLoading(false);
  }, [branchId, navigate]);

  if (loading) {
    return (
      <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!branch) {
    return null;
  }

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/settings/branches"
            className="text-sm text-slate-600 hover:text-slate-900 mb-2 inline-block"
          >
            ← Back to branches
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 mb-2">{branch.name}</h1>
              <p className="text-sm text-slate-600">Branch details and information</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/settings/branches?edit=${branch.id}`)}
                className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Edit Branch
              </button>
              <span className={`px-3 py-2 text-sm font-medium rounded-full ${
                branch.isActive 
                  ? "bg-emerald-100 text-emerald-700" 
                  : "bg-slate-200 text-slate-600"
              }`}>
                {branch.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        {/* Branch Information Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Branch Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-slate-600 mb-1">Branch Name</div>
              <div className="text-base font-medium text-slate-900">{branch.name}</div>
            </div>
            <div>
              <div className="text-sm text-slate-600 mb-1">Status</div>
              <div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  branch.isActive 
                    ? "bg-emerald-100 text-emerald-700" 
                    : "bg-slate-200 text-slate-600"
                }`}>
                  {branch.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="text-sm text-slate-600 mb-1">Address</div>
              <div className="text-base font-medium text-slate-900 flex items-start gap-2">
                <span>📍</span>
                <span>{branch.address}</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-600 mb-1">Phone</div>
              <div className="text-base font-medium text-slate-900 flex items-center gap-2">
                <span>📞</span>
                <a href={`tel:${branch.phone}`} className="hover:text-ev-green">
                  {branch.phone}
                </a>
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-600 mb-1">Email</div>
              <div className="text-base font-medium text-slate-900 flex items-center gap-2">
                <span>📧</span>
                <a href={`mailto:${branch.email}`} className="hover:text-ev-green">
                  {branch.email}
                </a>
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="text-sm text-slate-600 mb-1">Branch Manager</div>
              <div className="text-base font-medium text-slate-900 flex items-center gap-2">
                <span>👤</span>
                <span>{branch.manager}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => navigate(`/settings/branches?edit=${branch.id}`)}
              className="px-4 py-3 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 text-left"
            >
              ✏️ Edit Branch Details
            </button>
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this branch?")) {
                  const stored = JSON.parse(localStorage.getItem("branches") || "[]");
                  const updated = stored.filter((b: Branch) => b.id !== branch.id);
                  localStorage.setItem("branches", JSON.stringify(updated));
                  toastManager.show("Branch deleted", "success");
                  navigate("/settings/branches");
                }
              }}
              className="px-4 py-3 rounded-lg border border-red-300 bg-red-50 text-sm font-medium text-red-700 hover:bg-red-100 text-left"
            >
              🗑️ Delete Branch
            </button>
            <button
              onClick={() => {
                const stored = JSON.parse(localStorage.getItem("branches") || "[]");
                const updated = stored.map((b: Branch) =>
                  b.id === branch.id ? { ...b, isActive: !b.isActive } : b
                );
                localStorage.setItem("branches", JSON.stringify(updated));
                setBranch({ ...branch, isActive: !branch.isActive });
                toastManager.show(
                  branch.isActive ? "Branch deactivated" : "Branch activated",
                  "success"
                );
              }}
              className="px-4 py-3 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 text-left"
            >
              {branch.isActive ? "⏸️ Deactivate Branch" : "▶️ Activate Branch"}
            </button>
            <button
              onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(branch.address)}`, '_blank')}
              className="px-4 py-3 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 text-left"
            >
              🗺️ View on Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

