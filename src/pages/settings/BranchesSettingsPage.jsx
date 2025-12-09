import React, { useState, useEffect } from "react";
import { toastManager } from "../../utils/toastManager";

export default function BranchesSettingsPage() {
  const [branches, setBranches] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    manager: "",
    email: "",
    isActive: true
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("branches") || "[]");
    if (stored.length === 0) {
      // Default branches
      const defaultBranches = [
        { id: 1, name: "Headquarters", address: "Plot 45, Kampala Road, Kampala", phone: "+256 700 123 456", manager: "John Mukasa", email: "hq@evzone.com", isActive: true },
        { id: 2, name: "Entebbe Branch", address: "123 Airport Road, Entebbe", phone: "+256 700 234 567", manager: "Sarah Namatovu", email: "entebbe@evzone.com", isActive: true },
        { id: 3, name: "Jinja Branch", address: "56 Nile Avenue, Jinja", phone: "+256 700 345 678", manager: "Peter Ochieng", email: "jinja@evzone.com", isActive: false }
      ];
      setBranches(defaultBranches);
      localStorage.setItem("branches", JSON.stringify(defaultBranches));
    } else {
      setBranches(stored);
    }
  }, []);

  const handleSave = () => {
    if (!formData.name || !formData.address) {
      toastManager.show("Please fill in required fields", "error");
      return;
    }

    let updatedBranches;
    if (editingBranch) {
      updatedBranches = branches.map(b =>
        b.id === editingBranch.id ? { ...formData, id: b.id } : b
      );
      toastManager.show("Branch updated successfully", "success");
    } else {
      const newBranch = { ...formData, id: Date.now() };
      updatedBranches = [...branches, newBranch];
      toastManager.show("Branch added successfully", "success");
    }

    setBranches(updatedBranches);
    localStorage.setItem("branches", JSON.stringify(updatedBranches));
    setShowAddModal(false);
    setEditingBranch(null);
    setFormData({ name: "", address: "", phone: "", manager: "", email: "", isActive: true });
  };

  const handleEdit = (branch) => {
    setEditingBranch(branch);
    setFormData(branch);
    setShowAddModal(true);
  };

  const handleDelete = (id) => {
    const updatedBranches = branches.filter(b => b.id !== id);
    setBranches(updatedBranches);
    localStorage.setItem("branches", JSON.stringify(updatedBranches));
    toastManager.show("Branch deleted", "success");
  };

  const handleToggleStatus = (id) => {
    const updatedBranches = branches.map(b =>
      b.id === id ? { ...b, isActive: !b.isActive } : b
    );
    setBranches(updatedBranches);
    localStorage.setItem("branches", JSON.stringify(updatedBranches));
  };

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 mb-1">Branches</h1>
            <p className="text-sm text-slate-600">Manage your fleet partner branch locations</p>
          </div>
          <button
            onClick={() => {
              setEditingBranch(null);
              setFormData({ name: "", address: "", phone: "", manager: "", email: "", isActive: true });
              setShowAddModal(true);
            }}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-ev-green to-emerald-600 text-white text-sm font-medium hover:opacity-90 transition shadow-sm"
          >
            + Add Branch
          </button>
        </div>

        {/* Branches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className={`bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition ${branch.isActive ? "border-slate-200" : "border-slate-300 opacity-60"
                }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center text-xl">
                    🏢
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{branch.name}</h3>
                    <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${branch.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"
                      }`}>
                      {branch.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(branch)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(branch.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <span className="text-slate-400">📍</span>
                  <span>{branch.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">📞</span>
                  <span>{branch.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">👤</span>
                  <span>{branch.manager}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">📧</span>
                  <span>{branch.email}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={branch.isActive}
                    onChange={() => handleToggleStatus(branch.id)}
                    className="w-4 h-4 rounded text-ev-green focus:ring-ev-green"
                  />
                  <span className="text-xs text-slate-600">Active</span>
                </label>
                <button className="text-xs text-ev-green hover:text-ev-green-dark font-medium">
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                {editingBranch ? "Edit Branch" : "Add New Branch"}
              </h2>
              <div className="space-y-3">
                <label className="block">
                  <span className="text-xs font-medium text-slate-700">Branch Name *</span>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-ev-green focus:outline-none"
                    placeholder="e.g., Kampala Branch"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-slate-700">Address *</span>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-ev-green focus:outline-none"
                    placeholder="Full address"
                  />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-xs font-medium text-slate-700">Phone</span>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-ev-green focus:outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-medium text-slate-700">Email</span>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-ev-green focus:outline-none"
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="text-xs font-medium text-slate-700">Branch Manager</span>
                  <input
                    type="text"
                    value={formData.manager}
                    onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-ev-green focus:outline-none"
                  />
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-ev-green focus:ring-ev-green"
                  />
                  <span className="text-sm text-slate-600">Branch is active</span>
                </label>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingBranch(null);
                  }}
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark"
                >
                  {editingBranch ? "Update" : "Add Branch"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
