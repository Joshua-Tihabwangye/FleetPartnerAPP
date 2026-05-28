import React, { useEffect, useMemo, useState } from "react";
import { getFleetRoles, patchFleetRoles } from "../../services/api/fleetApi";
import { toastManager } from "../../utils/toastManager";

type RolePermissions = Record<string, boolean | Record<string, boolean>>;

type Role = {
  id: string;
  name: string;
  description: string;
  color: string;
  isSystem: boolean;
  permissions: RolePermissions;
};

const DEFAULT_ROLES: Role[] = [
  {
    id: "fleet-owner",
    name: "Fleet Owner",
    description: "Full access",
    color: "emerald",
    isSystem: true,
    permissions: {
      dashboard: true,
      vehicles: { view: true, create: true, edit: true, delete: true },
      drivers: { view: true, create: true, edit: true, delete: true },
      trips: { view: true, create: true, edit: true, delete: true },
      earnings: { view: true, export: true, manage: true },
      settings: { view: true, edit: true },
      reports: { view: true, export: true },
    },
  },
  {
    id: "dispatcher",
    name: "Dispatcher",
    description: "Dispatch operations",
    color: "purple",
    isSystem: true,
    permissions: {
      dashboard: true,
      vehicles: { view: true, create: false, edit: false, delete: false },
      drivers: { view: true, create: false, edit: false, delete: false },
      trips: { view: true, create: true, edit: true, delete: false },
      earnings: { view: false, export: false, manage: false },
      settings: { view: false, edit: false },
      reports: { view: false, export: false },
    },
  },
];

const PERMISSION_LABELS: Record<string, string> = {
  dashboard: "Dashboard Access",
  vehicles: "Vehicles",
  drivers: "Drivers",
  trips: "Trips & Dispatch",
  earnings: "Earnings",
  settings: "Settings",
  reports: "Reports",
};

function normalizeRoles(rawRoles: Array<Record<string, unknown>>): Role[] {
  return rawRoles.map((entry, index) => ({
    id: String(entry.id ?? `role-${index + 1}`),
    name: String(entry.name ?? "Custom Role"),
    description: String(entry.description ?? ""),
    color: String(entry.color ?? "slate"),
    isSystem: Boolean(entry.isSystem),
    permissions: (entry.permissions && typeof entry.permissions === "object" && !Array.isArray(entry.permissions)
      ? entry.permissions
      : {}) as RolePermissions,
  }));
}

export default function RolesAndPermissionsPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const selectedRole = useMemo(() => roles.find((entry) => entry.id === selectedRoleId) || null, [roles, selectedRoleId]);

  const loadRoles = async () => {
    setLoading(true);
    try {
      const response = await getFleetRoles();
      const fromBackend = Array.isArray(response.roles) ? normalizeRoles(response.roles) : [];
      const rows = fromBackend.length > 0 ? fromBackend : DEFAULT_ROLES;
      setRoles(rows);
      setSelectedRoleId((prev) => prev ?? rows[0]?.id ?? null);
    } catch (error) {
      console.error("Failed to load roles", error);
      setRoles(DEFAULT_ROLES);
      setSelectedRoleId(DEFAULT_ROLES[0]?.id ?? null);
      toastManager.show("Failed to load roles from backend", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRoles();
  }, []);

  const persistRoles = async (nextRoles: Role[], successMessage: string) => {
    setSaving(true);
    try {
      await patchFleetRoles({ roles: nextRoles });
      setRoles(nextRoles);
      toastManager.show(successMessage, "success");
    } catch (error) {
      console.error("Failed to save roles", error);
      toastManager.show("Failed to save role changes", "error");
    } finally {
      setSaving(false);
    }
  };

  const togglePermission = async (category: string, permission: string | null) => {
    if (!selectedRole) return;
    const nextRoles = roles.map((role) => {
      if (role.id !== selectedRole.id) return role;
      const permissions = { ...role.permissions };
      const section = permissions[category];

      if (typeof section === "boolean") {
        permissions[category] = !section;
      } else if (section && permission) {
        permissions[category] = {
          ...section,
          [permission]: !Boolean((section as Record<string, boolean>)[permission]),
        };
      }

      return { ...role, permissions };
    });

    await persistRoles(nextRoles, "Permissions updated");
  };

  const handleAddRole = async () => {
    if (!newRoleName.trim()) {
      toastManager.show("Please enter a role name", "error");
      return;
    }

    const newRole: Role = {
      id: `custom-${Date.now()}`,
      name: newRoleName.trim(),
      description: newRoleDescription.trim() || "Custom role",
      color: "cyan",
      isSystem: false,
      permissions: {
        dashboard: false,
        vehicles: { view: false, create: false, edit: false, delete: false },
        drivers: { view: false, create: false, edit: false, delete: false },
        trips: { view: false, create: false, edit: false, delete: false },
        earnings: { view: false, export: false, manage: false },
        settings: { view: false, edit: false },
        reports: { view: false, export: false },
      },
    };

    const nextRoles = [...roles, newRole];
    await persistRoles(nextRoles, `Role "${newRole.name}" created`);
    setSelectedRoleId(newRole.id);
    setShowAddModal(false);
    setNewRoleName("");
    setNewRoleDescription("");
  };

  const handleDeleteRole = async (roleId: string) => {
    const role = roles.find((entry) => entry.id === roleId);
    if (!role || role.isSystem) {
      toastManager.show("Cannot delete system role", "error");
      return;
    }

    const nextRoles = roles.filter((entry) => entry.id !== roleId);
    await persistRoles(nextRoles, `Role "${role.name}" deleted`);
    if (selectedRoleId === roleId) {
      setSelectedRoleId(nextRoles[0]?.id ?? null);
    }
  };

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 mb-1">Roles & Permissions</h1>
            <p className="text-sm text-slate-600">Manage role-based access with backend-authoritative state</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="px-4 py-2 rounded-lg bg-gradient-to-r from-ev-green to-emerald-600 text-white text-sm font-medium hover:opacity-90 transition shadow-sm">
            + Add Custom Role
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-600">Loading roles...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900 mb-3">Available Roles</h2>
                <div className="space-y-2">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRoleId(role.id)}
                      className={`w-full text-left p-3 rounded-lg border transition ${selectedRoleId === role.id ? "border-ev-green bg-emerald-50" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-900">{role.name}</span>
                        {!role.isSystem && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              void handleDeleteRole(role.id);
                            }}
                            className="text-red-500 text-xs"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">{role.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              {selectedRole && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900">{selectedRole.name}</h2>
                  <p className="text-sm text-slate-500 mb-4">{selectedRole.description}</p>

                  <div className="space-y-4">
                    {Object.entries(PERMISSION_LABELS).map(([category, label]) => {
                      const section = selectedRole.permissions[category];
                      const isBoolean = typeof section === "boolean";
                      return (
                        <div key={category} className="border border-slate-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-900">{label}</span>
                            {isBoolean && (
                              <input
                                type="checkbox"
                                checked={Boolean(section)}
                                onChange={() => void togglePermission(category, null)}
                                disabled={saving}
                                className="w-4 h-4"
                              />
                            )}
                          </div>
                          {!isBoolean && section && (
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(section as Record<string, boolean>).map(([permission, value]) => (
                                <label key={permission} className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs cursor-pointer ${value ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                                  <input
                                    type="checkbox"
                                    checked={value}
                                    disabled={saving}
                                    onChange={() => void togglePermission(category, permission)}
                                    className="w-3 h-3"
                                  />
                                  {permission}
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Add Custom Role</h2>
              <div className="space-y-3">
                <input type="text" value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300" placeholder="Role Name" />
                <input type="text" value={newRoleDescription} onChange={(e) => setNewRoleDescription(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300" placeholder="Description" />
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 rounded-lg border border-slate-300 text-sm">Cancel</button>
                <button onClick={() => void handleAddRole()} disabled={saving} className="flex-1 px-4 py-2 rounded-lg bg-ev-green text-white text-sm disabled:opacity-60">Create</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
