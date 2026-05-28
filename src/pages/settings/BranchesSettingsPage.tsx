import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  createFleetBranch,
  deleteFleetBranch,
  listFleetBranches,
  patchFleetBranch,
  type FleetUpsertBranchInput,
} from "../../services/api/fleetApi";
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

const EMPTY_FORM: FleetUpsertBranchInput = {
  name: "",
  address: "",
  city: "",
  country: "",
  phone: "",
  managerName: "",
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

export default function BranchesSettingsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [formData, setFormData] = useState<FleetUpsertBranchInput>(EMPTY_FORM);

  const editBranchId = searchParams.get("edit");

  const loadBranches = async () => {
    setLoading(true);
    try {
      const response = await listFleetBranches();
      setBranches(response.map(toBranch));
    } catch (error) {
      console.error("Failed to load fleet branches", error);
      toastManager.show("Failed to load branches from backend", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadBranches();
  }, []);

  useEffect(() => {
    if (!editBranchId || branches.length === 0) return;
    const branch = branches.find((entry) => entry.id === editBranchId);
    if (!branch) return;
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      address: branch.address,
      city: branch.city,
      country: branch.country,
      phone: branch.phone,
      managerName: branch.managerName,
    });
    setShowAddModal(true);
  }, [editBranchId, branches]);

  const sortedBranches = useMemo(
    () => [...branches].sort((a, b) => a.name.localeCompare(b.name)),
    [branches],
  );

  const closeModal = () => {
    setShowAddModal(false);
    setEditingBranch(null);
    setFormData(EMPTY_FORM);
    if (searchParams.has("edit")) {
      setSearchParams((prev) => {
        prev.delete("edit");
        return prev;
      });
    }
  };

  const handleSave = async () => {
    if (!formData.name?.trim()) {
      toastManager.show("Branch name is required", "error");
      return;
    }

    setSaving(true);
    try {
      if (editingBranch) {
        await patchFleetBranch(editingBranch.id, {
          ...formData,
          name: formData.name.trim(),
        });
        toastManager.show("Branch updated", "success");
      } else {
        await createFleetBranch({
          ...formData,
          name: formData.name.trim(),
        });
        toastManager.show("Branch created", "success");
      }
      closeModal();
      await loadBranches();
    } catch (error) {
      console.error("Failed to save branch", error);
      toastManager.show("Failed to save branch", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteFleetBranch(id);
      setBranches((prev) => prev.filter((entry) => entry.id !== id));
      toastManager.show("Branch deleted", "success");
    } catch (error) {
      console.error("Failed to delete branch", error);
      toastManager.show("Failed to delete branch", "error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 mb-1">Branches</h1>
            <p className="text-sm text-slate-600">Manage your fleet branch locations from backend data</p>
          </div>
          <button
            onClick={() => {
              setEditingBranch(null);
              setFormData(EMPTY_FORM);
              setShowAddModal(true);
            }}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-ev-green to-emerald-600 text-white text-sm font-medium hover:opacity-90 transition shadow-sm"
          >
            + Add Branch
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-600">Loading branches...</div>
        ) : sortedBranches.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
            <p className="text-slate-700 font-medium">No branches yet</p>
            <p className="text-sm text-slate-500 mt-1">Create your first branch to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedBranches.map((branch) => (
              <div key={branch.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center text-xl">🏢</div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">{branch.name}</h3>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setEditingBranch(branch);
                        setFormData({
                          name: branch.name,
                          address: branch.address,
                          city: branch.city,
                          country: branch.country,
                          phone: branch.phone,
                          managerName: branch.managerName,
                        });
                        setShowAddModal(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => void handleDelete(branch.id)}
                      disabled={deletingId === branch.id}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-50"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <span className="text-slate-400">📍</span>
                    <span>{branch.address || "No address"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">🌍</span>
                    <span>{[branch.city, branch.country].filter(Boolean).join(", ") || "No city/country"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">📞</span>
                    <span>{branch.phone || "No phone"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">👤</span>
                    <span>{branch.managerName || "No manager"}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
                  <button
                    onClick={() => navigate(`/settings/branches/${branch.id}`)}
                    className="text-xs text-ev-green hover:text-ev-green-dark font-medium"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">{editingBranch ? "Edit Branch" : "Add New Branch"}</h2>
              <div className="space-y-3">
                <label className="block">
                  <span className="text-xs font-medium text-slate-700">Branch Name *</span>
                  <input
                    type="text"
                    value={formData.name ?? ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-ev-green focus:outline-none"
                    placeholder="e.g., Kampala Branch"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-slate-700">Address</span>
                  <input
                    type="text"
                    value={formData.address ?? ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-ev-green focus:outline-none"
                  />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-xs font-medium text-slate-700">City</span>
                    <input
                      type="text"
                      value={formData.city ?? ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                      className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-ev-green focus:outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-medium text-slate-700">Country</span>
                    <input
                      type="text"
                      value={formData.country ?? ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, country: e.target.value }))}
                      className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-ev-green focus:outline-none"
                    />
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-xs font-medium text-slate-700">Phone</span>
                    <input
                      type="tel"
                      value={formData.phone ?? ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-ev-green focus:outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-medium text-slate-700">Manager</span>
                    <input
                      type="text"
                      value={formData.managerName ?? ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, managerName: e.target.value }))}
                      className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-ev-green focus:outline-none"
                    />
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => void handleSave()}
                  disabled={saving}
                  className="flex-1 px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark disabled:opacity-60"
                >
                  {saving ? "Saving..." : editingBranch ? "Update" : "Add Branch"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
