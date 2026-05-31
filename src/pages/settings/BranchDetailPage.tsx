import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteFleetBranch, getFleetBranch, patchFleetBranch } from "../../services/api/fleetApi";
import { toastManager } from "../../utils/toastManager";

type Branch = {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  managerName: string;
};

function toBranch(item: any): Branch {
  return {
    id: String(item.id),
    name: item.name ?? "Unnamed branch",
    address: item.address ?? "",
    city: item.city ?? "",
    country: item.country ?? "",
    phone: item.phone ?? "",
    managerName: item.managerName ?? "",
  };
}

export default function BranchDetailPage() {
  const { branchId } = useParams();
  const navigate = useNavigate();
  const [branch, setBranch] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!branchId) {
        navigate("/settings/branches");
        return;
      }
      setLoading(true);
      try {
        const response = await getFleetBranch(branchId);
        setBranch(toBranch(response));
      } catch (error) {
        console.error("Failed to load branch", error);
        toastManager.show("Branch not found", "error");
        navigate("/settings/branches");
      } finally {
        setLoading(false);
      }
    };

    void load();
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
        <div className="mb-6">
          <Link to="/settings/branches" className="text-sm text-slate-600 hover:text-slate-900 mb-2 inline-block">
            ← Back to branches
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 mb-2">{branch.name}</h1>
              <p className="text-sm text-slate-600">Branch details from backend</p>
            </div>
            <button
              onClick={() => navigate(`/settings/branches?edit=${branch.id}`)}
              className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Edit Branch
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Branch Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-slate-600 mb-1">Branch Name</div>
              <div className="text-base font-medium text-slate-900">{branch.name}</div>
            </div>
            <div>
              <div className="text-sm text-slate-600 mb-1">Branch Manager</div>
              <div className="text-base font-medium text-slate-900 flex items-center gap-2">
                <span>👤</span>
                <span>{branch.managerName || "No manager"}</span>
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="text-sm text-slate-600 mb-1">Address</div>
              <div className="text-base font-medium text-slate-900 flex items-start gap-2">
                <span>📍</span>
                <span>{branch.address || "No address"}</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-600 mb-1">Phone</div>
              <div className="text-base font-medium text-slate-900 flex items-center gap-2">
                <span>📞</span>
                <span>{branch.phone || "No phone"}</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-600 mb-1">City/Country</div>
              <div className="text-base font-medium text-slate-900 flex items-center gap-2">
                <span>🌍</span>
                <span>{[branch.city, branch.country].filter(Boolean).join(", ") || "Not set"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  await patchFleetBranch(branch.id, {
                    managerName: branch.managerName,
                    name: branch.name,
                    address: branch.address,
                    city: branch.city,
                    country: branch.country,
                    phone: branch.phone,
                  });
                  toastManager.show("Branch synced", "success");
                } catch (error) {
                  console.error("Failed to sync branch", error);
                  toastManager.show("Failed to sync branch", "error");
                } finally {
                  setBusy(false);
                }
              }}
              className="px-4 py-3 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 text-left disabled:opacity-50"
            >
              🔄 Re-sync Branch
            </button>
            <button
              disabled={busy}
              onClick={async () => {
                if (!window.confirm("Are you sure you want to delete this branch?")) {
                  return;
                }
                setBusy(true);
                try {
                  await deleteFleetBranch(branch.id);
                  toastManager.show("Branch deleted", "success");
                  navigate("/settings/branches");
                } catch (error) {
                  console.error("Failed to delete branch", error);
                  toastManager.show("Failed to delete branch", "error");
                } finally {
                  setBusy(false);
                }
              }}
              className="px-4 py-3 rounded-lg border border-red-300 bg-red-50 text-sm font-medium text-red-700 hover:bg-red-100 text-left disabled:opacity-50"
            >
              🗑️ Delete Branch
            </button>
            <button
              onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent([branch.address, branch.city, branch.country].filter(Boolean).join(" "))}`, "_blank")}
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
