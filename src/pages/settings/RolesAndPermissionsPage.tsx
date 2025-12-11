import React, { useState, useEffect } from "react";
import { toastManager } from "../../utils/toastManager";

interface RolePermissions {
  dashboard: boolean;
  vehicles: { view: boolean; create: boolean; edit: boolean; delete: boolean };
  drivers: { view: boolean; create: boolean; edit: boolean; delete: boolean };
  trips: { view: boolean; create: boolean; edit: boolean; delete: boolean };
  earnings: { view: boolean; export: boolean; manage: boolean };
  settings: { view: boolean; edit: boolean };
  reports: { view: boolean; export: boolean };
}

interface Role {
  id: number;
  name: string;
  description: string;
  color: string;
  isSystem: boolean;
  permissions: RolePermissions;
}

const DEFAULT_ROLES: Role[] = [
  {
    id: 1,
    name: "Fleet Owner",
    description: "Full access to all features and settings",
    color: "emerald",
    isSystem: true,
    permissions: {
      dashboard: true,
      vehicles: { view: true, create: true, edit: true, delete: true },
      drivers: { view: true, create: true, edit: true, delete: true },
      trips: { view: true, create: true, edit: true, delete: true },
      earnings: { view: true, export: true, manage: true },
      settings: { view: true, edit: true },
      reports: { view: true, export: true }
    }
  },
  {
    id: 2,
    name: "Manager",
    description: "Manage operations and staff",
    color: "blue",
    isSystem: true,
    permissions: {
      dashboard: true,
      vehicles: { view: true, create: true, edit: true, delete: false },
      drivers: { view: true, create: true, edit: true, delete: false },
      trips: { view: true, create: true, edit: true, delete: false },
      earnings: { view: true, export: true, manage: false },
      settings: { view: true, edit: false },
      reports: { view: true, export: true }
    }
  },
  {
    id: 3,
    name: "Dispatcher",
    description: "Handle trip assignments and tracking",
    color: "purple",
    isSystem: true,
    permissions: {
      dashboard: true,
      vehicles: { view: true, create: false, edit: false, delete: false },
      drivers: { view: true, create: false, edit: false, delete: false },
      trips: { view: true, create: true, edit: true, delete: false },
      earnings: { view: false, export: false, manage: false },
      settings: { view: false, edit: false },
      reports: { view: false, export: false }
    }
  },
  {
    id: 4,
    name: "Finance",
    description: "Manage financial operations",
    color: "amber",
    isSystem: true,
    permissions: {
      dashboard: true,
      vehicles: { view: true, create: false, edit: false, delete: false },
      drivers: { view: true, create: false, edit: false, delete: false },
      trips: { view: true, create: false, edit: false, delete: false },
      earnings: { view: true, export: true, manage: true },
      settings: { view: false, edit: false },
      reports: { view: true, export: true }
    }
  },
  {
    id: 5,
    name: "Driver",
    description: "Basic driver access",
    color: "slate",
    isSystem: true,
    permissions: {
      dashboard: false,
      vehicles: { view: true, create: false, edit: false, delete: false },
      drivers: { view: false, create: false, edit: false, delete: false },
      trips: { view: true, create: false, edit: false, delete: false },
      earnings: { view: true, export: false, manage: false },
      settings: { view: false, edit: false },
      reports: { view: false, export: false }
    }
  }
];

const PERMISSION_LABELS = {
  dashboard: "Dashboard Access",
  vehicles: "Vehicles",
  drivers: "Drivers",
  trips: "Trips & Dispatch",
  earnings: "Earnings & Payouts",
  settings: "Settings",
  reports: "Reports"
};

export default function RolesAndPermissionsPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("roles") || "null");
    if (stored) {
      setRoles(stored);
    } else {
      setRoles(DEFAULT_ROLES);
      localStorage.setItem("roles", JSON.stringify(DEFAULT_ROLES));
    }
  }, []);

  useEffect(() => {
    if (roles.length > 0 && !selectedRole) {
      setSelectedRole(roles[0]);
    }
  }, [roles, selectedRole]);

  const handlePermissionToggle = (category: keyof typeof PERMISSION_LABELS, permission: string | null) => {
    if (!selectedRole || selectedRole.isSystem) return;

    const updatedRoles = roles.map(role => {
      if (role.id === selectedRole.id) {
        const newPermissions = { ...role.permissions };

        if (category === 'dashboard') {
          // Explicitly handle the boolean case
          newPermissions.dashboard = !newPermissions.dashboard;
        } else if (permission) {
          // Handle object permissions (all non-dashboard permissions)
          // We know if category is not dashboard, it's one of the objects
          const currentSection = newPermissions[category];

          // Type guard to ensure we are working with an object property and not the boolean dashboard
          if (typeof currentSection !== 'boolean' && currentSection && typeof currentSection === 'object') {
            // Create a copy of the section to avoid mutating state directly
            const updatedSection = { ...currentSection } as Record<string, boolean>;

            // Update the specific permission
            if (permission in updatedSection) {
              updatedSection[permission] = !updatedSection[permission];

              // Assign back to newPermissions. We cast to any here ONLY for the assignment 
              // because TS has trouble verifying the intersection type of the key and value 
              // in this specific union structure, but we've verified the types above.
              (newPermissions as any)[category] = updatedSection;
            }
          }
        }
        return { ...role, permissions: newPermissions };
      }
      return role;
    });

    setRoles(updatedRoles);
    setSelectedRole(updatedRoles.find(r => r.id === selectedRole.id) || null);
    localStorage.setItem("roles", JSON.stringify(updatedRoles));
  };

  const handleAddRole = () => {
    if (!newRoleName.trim()) {
      toastManager.show("Please enter a role name", "error");
      return;
    }

    const newRole = {
      id: Date.now(),
      name: newRoleName,
      description: "Custom role",
      color: "cyan",
      isSystem: false,
      permissions: {
        dashboard: false,
        vehicles: { view: false, create: false, edit: false, delete: false },
        drivers: { view: false, create: false, edit: false, delete: false },
        trips: { view: false, create: false, edit: false, delete: false },
        earnings: { view: false, export: false, manage: false },
        settings: { view: false, edit: false },
        reports: { view: false, export: false }
      }
    };

    const updatedRoles = [...roles, newRole];
    setRoles(updatedRoles);
    localStorage.setItem("roles", JSON.stringify(updatedRoles));
    setSelectedRole(newRole);
    setShowAddModal(false);
    setNewRoleName("");
    toastManager.show("Role created successfully", "success");
  };

  const handleDeleteRole = (roleId: number) => {
    const role = roles.find(r => r.id === roleId);
    if (role?.isSystem) {
      toastManager.show("Cannot delete system roles", "error");
      return;
    }

    const updatedRoles = roles.filter(r => r.id !== roleId);
    setRoles(updatedRoles);
    localStorage.setItem("roles", JSON.stringify(updatedRoles));
    if (selectedRole?.id === roleId) {
      setSelectedRole(updatedRoles[0] || null);
    }
    toastManager.show("Role deleted", "success");
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      emerald: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
      blue: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
      purple: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
      amber: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
      slate: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
      cyan: "bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-400 dark:border-cyan-800"
    };
    return colors[color] || colors.slate;
  };

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 mb-1">Roles & Permissions</h1>
            <p className="text-sm text-slate-600">Manage access levels for your team members</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-ev-green to-emerald-600 text-white text-sm font-medium hover:opacity-90 transition shadow-sm"
          >
            + Add Custom Role
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Roles List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900 mb-3">Available Roles</h2>
              <div className="space-y-2">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role)}
                    className={`w-full text-left p-3 rounded-lg border transition ${selectedRole?.id === role.id
                      ? "border-ev-green bg-emerald-50"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${getColorClasses(role.color)}`}>
                          {role.name}
                        </span>
                        {role.isSystem && (
                          <span className="text-[10px] text-slate-400">System</span>
                        )}
                      </div>
                      {!role.isSystem && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRole(role.id);
                          }}
                          className="text-slate-400 hover:text-red-500 text-xs"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">{role.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Permissions Editor */}
          <div className="lg:col-span-2">
            {selectedRole && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">{selectedRole.name}</h2>
                    <p className="text-sm text-slate-500">{selectedRole.description}</p>
                  </div>
                  {selectedRole.isSystem && (
                    <span className="px-2 py-1 rounded bg-amber-100 text-amber-700 text-xs font-medium">
                      🔒 System Role - Read Only
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  {Object.entries(PERMISSION_LABELS).map(([k, label]) => {
                    const key = k as keyof RolePermissions;
                    const perm = selectedRole.permissions[key];
                    const isBoolean = typeof perm === "boolean";

                    return (
                      <div key={key} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-900">{label}</span>
                          {isBoolean && (
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={perm as boolean}
                                onChange={() => handlePermissionToggle(key, null)}
                                disabled={selectedRole.isSystem}
                                className="sr-only peer"
                              />
                              <div className={`w-9 h-5 rounded-full peer peer-checked:bg-ev-green ${selectedRole.isSystem ? "bg-slate-200" : "bg-slate-300"
                                } peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all`}></div>
                            </label>
                          )}
                        </div>
                        {!isBoolean && (
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(perm as Record<string, boolean>).map(([subKey, value]) => (
                              <label
                                key={subKey}
                                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs cursor-pointer transition ${value ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                                  } ${selectedRole.isSystem ? "opacity-60 cursor-not-allowed" : "hover:opacity-80"}`}
                              >
                                <input
                                  type="checkbox"
                                  checked={value}
                                  onChange={() => handlePermissionToggle(key, subKey)}
                                  disabled={selectedRole.isSystem}
                                  className="w-3 h-3 rounded"
                                />
                                {subKey.charAt(0).toUpperCase() + subKey.slice(1)}
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {!selectedRole.isSystem && (
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => toastManager.show("Permissions saved!", "success")}
                      className="px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Add Role Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Add Custom Role</h2>
              <label className="block">
                <span className="text-xs font-medium text-slate-700">Role Name</span>
                <input
                  type="text"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-ev-green focus:outline-none"
                  placeholder="e.g., Supervisor"
                  autoFocus
                />
              </label>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddRole}
                  className="flex-1 px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark"
                >
                  Create Role
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
