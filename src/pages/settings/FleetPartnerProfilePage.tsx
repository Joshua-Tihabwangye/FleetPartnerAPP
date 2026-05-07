import React from "react";
import { Link } from "react-router-dom";
import { toastManager } from "../../utils/toastManager";

interface FleetProfile {
  name: string;
  email: string;
  phone: string;
  language: string;
  notifications: {
    email: boolean;
    sms: boolean;
    portal: boolean;
  };
}

interface SessionSummary {
  id: number;
  device: string;
  browser: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

const DEFAULT_PROFILE: FleetProfile = {
  name: "Fleet Owner",
  email: "owner@examplefleet.com",
  phone: "+256 700 000000",
  language: "English",
  notifications: {
    email: true,
    sms: false,
    portal: true,
  },
};

const DEFAULT_SESSIONS: SessionSummary[] = [
  {
    id: 1,
    device: "Windows PC",
    browser: "Chrome 120",
    location: "Kampala, Uganda",
    lastActive: "Active now",
    isCurrent: true,
  },
  {
    id: 2,
    device: "iPhone 13",
    browser: "Safari 17",
    location: "Kampala, Uganda",
    lastActive: "2 hours ago",
    isCurrent: false,
  },
  {
    id: 3,
    device: "MacBook Pro",
    browser: "Firefox 121",
    location: "Entebbe, Uganda",
    lastActive: "Yesterday",
    isCurrent: false,
  },
];

const badgeBase =
  "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide";

interface ToggleRowProps {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}

function ToggleRow({ title, description, enabled, onToggle }: ToggleRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 p-3">
      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</p>
        <p className="text-xs text-slate-600 dark:text-slate-400">{description}</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={enabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400/60 ${
          enabled ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

export default function FleetPartnerProfilePage() {
  const [profile, setProfile] = React.useState<FleetProfile>(DEFAULT_PROFILE);
  const [avatarDataUrl, setAvatarDataUrl] = React.useState<string | null>(null);
  const [sessions, setSessions] = React.useState<SessionSummary[]>(DEFAULT_SESSIONS);
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const profileFormRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const storedProfile = JSON.parse(localStorage.getItem("fleet_partner_profile") || "null");
    if (storedProfile) {
      setProfile(storedProfile);
    }

    const storedAvatar = localStorage.getItem("fleet_partner_avatar");
    if (storedAvatar) {
      setAvatarDataUrl(storedAvatar);
    }

    const storedSessions = JSON.parse(localStorage.getItem("sessions") || "null");
    if (storedSessions && Array.isArray(storedSessions) && storedSessions.length > 0) {
      setSessions(storedSessions);
    }

    setTwoFactorEnabled(localStorage.getItem("2fa_enabled") === "true");
  }, []);

  const handleSaveProfile = () => {
    localStorage.setItem("fleet_partner_profile", JSON.stringify(profile));
    toastManager.show("Profile saved successfully!", "success");
  };

  const handleSaveNotifications = () => {
    localStorage.setItem("fleet_partner_profile", JSON.stringify(profile));
    toastManager.show("Notification settings saved!", "success");
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : null;
      if (result) {
        setAvatarDataUrl(result);
        localStorage.setItem("fleet_partner_avatar", result);
        toastManager.show("Avatar updated successfully!", "success");
      }
    };
    reader.readAsDataURL(file);
  };

  const initials = profile.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "FP";

  const activeSessions = sessions.length;
  const currentSession = sessions.find((session) => session.isCurrent) || sessions[0];
  const lastLogin = currentSession?.lastActive || "Active now";

  const emailVerified = localStorage.getItem("email_verified") !== "false";
  const phoneVerified = profile.phone.trim().length > 8;
  const personalDetailsComplete =
    profile.name.trim().length > 1 && profile.phone.trim().length > 8 && profile.language.trim().length > 0;
  const notificationsConfigured =
    profile.notifications.email || profile.notifications.sms || profile.notifications.portal;

  const completionChecks = [
    { label: "Personal details completed", done: personalDetailsComplete },
    { label: "Email verified", done: emailVerified },
    { label: "Phone verified", done: phoneVerified },
    { label: "Two-factor authentication", done: twoFactorEnabled },
    { label: "Notification preferences", done: notificationsConfigured },
  ];

  const completionScore = Math.round(
    (completionChecks.filter((item) => item.done).length / completionChecks.length) * 100
  );

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50 dark:bg-slate-900">
      <div className="w-full space-y-6">
        <div className="pb-5 border-b border-slate-200 dark:border-slate-700">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">My account</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Manage your identity, preferences and security posture for Fleet Partner operations.
          </p>
        </div>

        <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 shadow-sm p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div className="flex items-start gap-4 sm:gap-5 min-w-0">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-xl sm:text-2xl font-bold shadow-lg shadow-emerald-500/25 overflow-hidden flex-shrink-0">
                {avatarDataUrl ? (
                  <img src={avatarDataUrl} alt={profile.name} className="h-full w-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {profile.name}
                  </h2>
                  <span className={`${badgeBase} bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300`}>
                    Active account
                  </span>
                  <span className={`${badgeBase} ${emailVerified ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"}`}>
                    {emailVerified ? "Verified identity" : "Verification pending"}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 font-medium mb-3">Fleet Owner • Operations Administrator</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                  <p className="text-slate-600 dark:text-slate-300 truncate">{profile.email}</p>
                  <p className="text-slate-600 dark:text-slate-300">{profile.phone}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3 lg:justify-end">
              <button
                type="button"
                onClick={() => profileFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
              >
                Edit profile
              </button>
              <Link
                to="/settings/account-security"
                className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-medium hover:bg-slate-800 dark:hover:bg-white transition"
              >
                Security settings
              </Link>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark transition"
              >
                Upload avatar
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/70 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Profile completion</p>
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">{completionScore}%</p>
            </div>
            <div className="h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden mb-3">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                style={{ width: `${completionScore}%` }}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {completionChecks.map((item) => (
                <div
                  key={item.label}
                  className={`rounded-lg border px-3 py-2 text-xs font-medium flex items-center justify-between gap-2 ${item.done
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
                    : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-300"
                    }`}
                >
                  <span className="truncate">{item.label}</span>
                  <span className="flex-shrink-0">{item.done ? "Done" : "Pending"}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <section
              ref={profileFormRef}
              className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-4 sm:p-6"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Personal and contact information</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Keep your profile details accurate for communication and operational alerts.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full name</span>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                    placeholder="Fleet Owner"
                  />
                </label>

                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Work email</span>
                  <input
                    type="email"
                    disabled
                    value={profile.email}
                    readOnly
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/60 px-3 py-2.5 text-sm text-slate-500 dark:text-slate-300"
                  />
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Managed by account provisioning.</span>
                </label>

                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Mobile phone</span>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                    placeholder="+256 700 000000"
                  />
                </label>

                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Language and locale</span>
                  <select
                    value={profile.language}
                    onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                  >
                    <option>English</option>
                    <option>Luganda</option>
                    <option>Swahili</option>
                  </select>
                </label>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Changes are saved to your fleet profile workspace.
                </p>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark transition"
                >
                  Save profile
                </button>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-4 sm:p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Notification preferences</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Choose how operations updates and urgent events reach you.
                </p>
              </div>

              <div className="space-y-3">
                <ToggleRow
                  title="Email updates"
                  description="Receive daily operational summaries and account updates."
                  enabled={profile.notifications.email}
                  onToggle={() =>
                    setProfile({
                      ...profile,
                      notifications: {
                        ...profile.notifications,
                        email: !profile.notifications.email,
                      },
                    })
                  }
                />

                <ToggleRow
                  title="SMS for urgent issues"
                  description="Get critical dispatch, outage, and incident alerts by SMS."
                  enabled={profile.notifications.sms}
                  onToggle={() =>
                    setProfile({
                      ...profile,
                      notifications: {
                        ...profile.notifications,
                        sms: !profile.notifications.sms,
                      },
                    })
                  }
                />

                <ToggleRow
                  title="In-portal notifications"
                  description="See alerts and reminders in your Fleet Partner workspace."
                  enabled={profile.notifications.portal}
                  onToggle={() =>
                    setProfile({
                      ...profile,
                      notifications: {
                        ...profile.notifications,
                        portal: !profile.notifications.portal,
                      },
                    })
                  }
                />
              </div>

              <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveNotifications}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                >
                  Save notification settings
                </button>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-4 sm:p-5">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3">Security summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Password status</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-300">Updated recently</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Two-factor auth</span>
                  <span
                    className={`font-medium ${
                      twoFactorEnabled
                        ? "text-emerald-600 dark:text-emerald-300"
                        : "text-amber-600 dark:text-amber-300"
                    }`}
                  >
                    {twoFactorEnabled ? "Enabled" : "Not enabled"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Active sessions</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">{activeSessions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Last login</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">{lastLogin}</span>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Link
                  to="/settings/account-security"
                  className="block w-full text-center px-3 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-medium hover:bg-slate-800 dark:hover:bg-white transition"
                >
                  Open account security
                </Link>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Link
                    to="/settings/account-security/2fa-setup"
                    className="text-center px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                  >
                    Manage 2FA
                  </Link>
                  <Link
                    to="/settings/account-security/sessions"
                    className="text-center px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                  >
                    View sessions
                  </Link>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-4 sm:p-5">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3">Account status</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-900/60 px-3 py-2">
                  <span className="text-slate-600 dark:text-slate-400">Workspace</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-300">Operational</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-900/60 px-3 py-2">
                  <span className="text-slate-600 dark:text-slate-400">Identity check</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-300">Verified</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-900/60 px-3 py-2">
                  <span className="text-slate-600 dark:text-slate-400">Risk state</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-300">Low</span>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-4 sm:p-5">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3">Recent session activity</h3>
              <div className="space-y-3">
                {sessions.slice(0, 3).map((session) => (
                  <div key={session.id} className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2.5 bg-slate-50 dark:bg-slate-900/60">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {session.device} • {session.browser}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{session.location}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      {session.isCurrent ? "Current session" : `Last active ${session.lastActive}`}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-4 sm:p-5">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3">Quick links</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-2">
                <Link
                  to="/settings/activity-log"
                  className="rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                >
                  Activity log
                </Link>
                <Link
                  to="/settings/account-security"
                  className="rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                >
                  Password and security
                </Link>
                <Link
                  to="/support/messages"
                  className="rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                >
                  Contact support
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
