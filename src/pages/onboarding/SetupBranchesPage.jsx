import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SetupBranchesPage() {
  const navigate = useNavigate();
  const [branches, setBranches] = useState([
    { id: 1, name: "", address: "", phone: "" }
  ]);

  const handleAddBranch = () => {
    setBranches([...branches, { id: branches.length + 1, name: "", address: "", phone: "" }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Branches saved. Wire to your API.");
    navigate("/setup/roles");
  };

  return (
    <div className="min-h-[calc(100vh-56px)] px-4 sm:px-6 lg:px-10 py-6 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Setup branches</h1>
          <p className="text-sm text-slate-600">Add your fleet branches and locations</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {branches.map((branch, idx) => (
              <div key={branch.id} className="p-4 border border-slate-200 rounded-lg space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-slate-900">Branch {idx + 1}</h3>
                  {branches.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setBranches(branches.filter((b) => b.id !== branch.id))}
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700 mb-1 block">
                      Branch name *
                    </span>
                    <input
                      type="text"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
                      placeholder="Main Branch"
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700 mb-1 block">
                      Phone number *
                    </span>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
                      placeholder="+256 700 000 000"
                      required
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700 mb-1 block">Address *</span>
                  <textarea
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
                    placeholder="Enter branch address"
                    required
                  />
                </label>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddBranch}
              className="w-full px-4 py-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              + Add another branch
            </button>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => navigate("/setup/fleet-partner-profile")}
                className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark"
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
