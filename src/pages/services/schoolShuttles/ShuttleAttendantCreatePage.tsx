import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createFleetShuttleAttendant } from "../../../services/api/fleetApi";
import { toastManager } from "../../../utils/toastManager";

export default function ShuttleAttendantCreatePage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    assignedRoute: "",
    certificationDate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createFleetShuttleAttendant({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        assignedRoute: formData.assignedRoute || undefined,
        certificationDate: formData.certificationDate || undefined,
      });
      toastManager.show("Attendant created", "success");
      navigate("/school-shuttles/attendants");
    } catch (error) {
      console.error("Failed to create attendant", error);
      toastManager.show("Failed to create attendant", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50 dark:bg-slate-900">
      <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
        <Link to="/school-shuttles/attendants" className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition mb-2 inline-block">← Back to Attendants List</Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Add New Attendant</h1>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">First Name</label>
                <input type="text" required value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Last Name</label>
                <input type="text" required value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Phone Number</label>
                <input type="tel" required placeholder="+256..." value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Primary Route Assignment</label>
                <input type="text" value={formData.assignedRoute} onChange={(e) => setFormData({ ...formData, assignedRoute: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" placeholder="Optional route id" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">First Aid Certification Date</label>
                <input type="date" value={formData.certificationDate} onChange={(e) => setFormData({ ...formData, certificationDate: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
              <button type="button" onClick={() => navigate("/school-shuttles/attendants")} className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition">Cancel</button>
              <button type="submit" disabled={saving} className="px-6 py-2 rounded-lg bg-ev-green text-white font-medium hover:bg-emerald-600 transition shadow-lg shadow-emerald-500/20 disabled:opacity-60">{saving ? "Creating..." : "Create Attendant"}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
