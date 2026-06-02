import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  getFleetPortalSettings,
  getFleetProfile,
  getFleetSecuritySettings,
  patchFleetPortalSettings,
  patchFleetProfile,
} from "../../services/api/fleetApi";
import { normalizeFleetProfileInput } from "../../services/api/validators";
import { toastManager } from "../../utils/toastManager";

type ProfileForm = {
  companyName: string;
  contactEmail: string;
  contactPhone: string;
  language: string;
  notifications: {
    email: boolean;
    sms: boolean;
    portal: boolean;
  };
};

const DEFAULT_FORM: ProfileForm = {
  companyName: "",
  contactEmail: "",
  contactPhone: "",
  language: "English",
  notifications: {
    email: true,
    sms: false,
    portal: true,
  },
};

export default function FleetPartnerProfilePage() {
  const [form, setForm] = useState<ProfileForm>(DEFAULT_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [profile, settings, security] = await Promise.all([
          getFleetProfile(),
          getFleetPortalSettings(),
          getFleetSecuritySettings(),
        ]);

        setForm({
          companyName: profile.companyName ?? "",
          contactEmail: profile.contactEmail ?? "",
          contactPhone: profile.contactPhone ?? "",
          language: settings.language ?? "English",
          notifications: settings.notifications ?? DEFAULT_FORM.notifications,
        });

        setTwoFactorEnabled(Boolean(security.twoFactorEnabled));
        setSessionCount(Array.isArray(security.sessions) ? security.sessions.length : 0);
      } catch (error) {
        console.error("Failed to load profile data", error);
        toastManager.show("Failed to load profile from backend", "error");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const completionScore = useMemo(() => {
    const checks = [
      form.companyName.trim().length > 1,
      form.contactEmail.trim().length > 3,
      form.contactPhone.trim().length > 8,
      form.language.trim().length > 0,
      twoFactorEnabled,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [form, twoFactorEnabled]);

  const handleSaveProfile = async () => {
    let profilePayload;
    try {
      profilePayload = normalizeFleetProfileInput({
        companyName: form.companyName,
        contactEmail: form.contactEmail,
        contactPhone: form.contactPhone,
      });
    } catch (validationError) {
      const message = validationError instanceof Error ? validationError.message : "Please review the profile form.";
      toastManager.show(message, "error");
      return;
    }

    setSaving(true);
    try {
      await Promise.all([
        patchFleetProfile(profilePayload),
        patchFleetPortalSettings({
          language: form.language,
          notifications: form.notifications,
        }),
      ]);
      toastManager.show("Profile saved", "success");
    } catch (error) {
      console.error("Failed to save profile", error);
      toastManager.show("Failed to save profile", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      <div className="w-full space-y-6">
        <div className="pb-5 border-b border-slate-200">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">My account</h1>
          <p className="text-sm text-slate-600">Backend-authoritative profile, notification, and security posture.</p>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{form.companyName || "Fleet profile"}</h2>
              <p className="text-sm text-slate-600 mt-1">{form.contactEmail || "No email"} • {form.contactPhone || "No phone"}</p>
            </div>
            <div className="flex gap-2">
              <Link to="/settings/account-security" className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
                Security settings
              </Link>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-slate-800">Profile completion</p>
              <p className="text-sm font-semibold text-emerald-600">{completionScore}%</p>
            </div>
            <div className="h-2.5 rounded-full bg-slate-200 overflow-hidden mb-3">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: `${completionScore}%` }} />
            </div>
            <p className="text-xs text-slate-600">2FA: {twoFactorEnabled ? "Enabled" : "Disabled"} • Active sessions: {sessionCount}</p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-6 space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Profile details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs font-semibold text-slate-700">Company Name</span>
              <input type="text" value={form.companyName} onChange={(e) => setForm((prev) => ({ ...prev, companyName: e.target.value }))} className="w-full mt-1 rounded-xl border border-slate-300 px-3 py-2.5 text-sm" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-slate-700">Email</span>
              <input type="email" value={form.contactEmail} onChange={(e) => setForm((prev) => ({ ...prev, contactEmail: e.target.value }))} className="w-full mt-1 rounded-xl border border-slate-300 px-3 py-2.5 text-sm" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-slate-700">Phone</span>
              <input type="tel" value={form.contactPhone} onChange={(e) => setForm((prev) => ({ ...prev, contactPhone: e.target.value }))} className="w-full mt-1 rounded-xl border border-slate-300 px-3 py-2.5 text-sm" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-slate-700">Language</span>
              <select value={form.language} onChange={(e) => setForm((prev) => ({ ...prev, language: e.target.value }))} className="w-full mt-1 rounded-xl border border-slate-300 px-3 py-2.5 text-sm">
                <option>English</option>
                <option>Luganda</option>
                <option>Swahili</option>
              </select>
            </label>
          </div>

          <h4 className="text-sm font-semibold text-slate-900">Notifications</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {([
              ["email", "Email alerts"],
              ["sms", "SMS alerts"],
              ["portal", "Portal alerts"],
            ] as const).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.notifications[key]}
                  onChange={(e) => setForm((prev) => ({ ...prev, notifications: { ...prev.notifications, [key]: e.target.checked } }))}
                  className="w-4 h-4"
                />
                {label}
              </label>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => void handleSaveProfile()}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save profile"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
