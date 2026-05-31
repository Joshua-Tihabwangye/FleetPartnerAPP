import React, { useEffect, useState } from "react";
import { getFleetProfile, patchFleetProfile } from "../../services/api/fleetApi";
import { toastManager } from "../../utils/toastManager";

type FleetSettingsForm = {
  companyName: string;
  contactEmail: string;
  contactPhone: string;
  registrationNumber: string;
  taxId: string;
};

const INITIAL_FORM: FleetSettingsForm = {
  companyName: "",
  contactEmail: "",
  contactPhone: "",
  registrationNumber: "",
  taxId: "",
};

export default function FleetPartnerSettingsPage() {
  const [formData, setFormData] = useState<FleetSettingsForm>(INITIAL_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const profile = await getFleetProfile();
        setFormData({
          companyName: profile.companyName ?? "",
          contactEmail: profile.contactEmail ?? "",
          contactPhone: profile.contactPhone ?? "",
          registrationNumber: profile.registrationNumber ?? "",
          taxId: profile.taxId ?? "",
        });
      } catch (error) {
        console.error("Failed to load fleet partner settings", error);
        toastManager.show("Failed to load fleet settings from backend", "error");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      await patchFleetProfile({
        companyName: formData.companyName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        registrationNumber: formData.registrationNumber || undefined,
        taxId: formData.taxId || undefined,
      });
      toastManager.show("Fleet partner settings saved", "success");
    } catch (error) {
      console.error("Failed to save fleet partner settings", error);
      toastManager.show("Failed to save settings", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Fleet Partner settings</h1>
          <p className="text-sm text-slate-600">Manage your fleet organization profile from backend records</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          {loading ? (
            <div className="py-8 text-center text-slate-600">Loading settings...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-1 block">Company name *</span>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
                  required
                />
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700 mb-1 block">Email address *</span>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData((prev) => ({ ...prev, contactEmail: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700 mb-1 block">Phone number *</span>
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, contactPhone: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
                    required
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700 mb-1 block">Registration number</span>
                  <input
                    type="text"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData((prev) => ({ ...prev, registrationNumber: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700 mb-1 block">Tax ID</span>
                  <input
                    type="text"
                    value={formData.taxId}
                    onChange={(e) => setFormData((prev) => ({ ...prev, taxId: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
                  />
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save settings"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
