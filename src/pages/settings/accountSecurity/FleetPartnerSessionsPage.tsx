import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getFleetSecuritySettings, patchFleetSecuritySettings } from "../../../services/api/fleetApi";
import { toastManager } from "../../../utils/toastManager";

type Session = {
  id: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  lastActive: string;
  isCurrent: boolean;
  icon: string;
};

function normalizeSession(raw: Record<string, unknown>, index: number): Session {
  return {
    id: String(raw.id ?? `session-${index + 1}`),
    device: String(raw.device ?? "Unknown device"),
    browser: String(raw.browser ?? "Unknown browser"),
    location: String(raw.location ?? "Unknown"),
    ip: String(raw.ip ?? "Unknown"),
    lastActive: String(raw.lastActive ?? "Unknown"),
    isCurrent: Boolean(raw.isCurrent),
    icon: String(raw.icon ?? "💻"),
  };
}

export default function FleetPartnerSessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showRevokeAllModal, setShowRevokeAllModal] = useState(false);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const response = await getFleetSecuritySettings();
      const rows = Array.isArray(response.sessions)
        ? response.sessions.map((entry, index) => normalizeSession(entry, index))
        : [];
      setSessions(rows);
    } catch (error) {
      console.error("Failed to load security sessions", error);
      toastManager.show("Failed to load sessions from backend", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSessions();
  }, []);

  const persistSessions = async (nextSessions: Session[]) => {
    setSaving(true);
    try {
      await patchFleetSecuritySettings({ sessions: nextSessions });
      setSessions(nextSessions);
    } finally {
      setSaving(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    const session = sessions.find((entry) => entry.id === sessionId);
    if (session?.isCurrent) {
      toastManager.show("Cannot revoke current session", "error");
      return;
    }

    try {
      await persistSessions(sessions.filter((entry) => entry.id !== sessionId));
      toastManager.show("Session revoked successfully", "success");
    } catch (error) {
      console.error("Failed to revoke session", error);
      toastManager.show("Failed to revoke session", "error");
    }
  };

  const handleRevokeAll = async () => {
    try {
      await persistSessions(sessions.filter((entry) => entry.isCurrent));
      setShowRevokeAllModal(false);
      toastManager.show("All other sessions revoked", "success");
    } catch (error) {
      console.error("Failed to revoke sessions", error);
      toastManager.show("Failed to revoke sessions", "error");
    }
  };

  const currentSession = useMemo(() => sessions.find((entry) => entry.isCurrent), [sessions]);
  const otherSessions = useMemo(() => sessions.filter((entry) => !entry.isCurrent), [sessions]);

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      <div className="w-full">
        <div className="mb-6">
          <Link to="/settings/account-security" className="text-sm text-slate-600 hover:text-slate-900 mb-2 inline-block">
            ← Back to Account Security
          </Link>
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">Active Sessions</h1>
          <p className="text-sm text-slate-600">Manage devices where you're logged in</p>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-600">Loading sessions...</div>
        ) : (
          <>
            {currentSession && (
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-5 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Current Session</span>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center text-2xl">{currentSession.icon}</div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{currentSession.device} - {currentSession.browser}</h3>
                    <div className="mt-1 space-y-0.5 text-xs text-slate-600">
                      <div>📍 {currentSession.location}</div>
                      <div>🌐 IP: {currentSession.ip}</div>
                      <div className="text-emerald-700 font-medium">{currentSession.lastActive}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <h2 className="text-sm font-semibold text-slate-900">Other Sessions ({otherSessions.length})</h2>
                {otherSessions.length > 0 && (
                  <button
                    onClick={() => setShowRevokeAllModal(true)}
                    className="text-xs font-medium text-red-600 hover:text-red-700"
                    disabled={saving}
                  >
                    Revoke All
                  </button>
                )}
              </div>

              {otherSessions.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-4xl mb-3">🔒</div>
                  <p className="text-sm text-slate-600">No other active sessions</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {otherSessions.map((session) => (
                    <div key={session.id} className="p-4 hover:bg-slate-50 transition">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-xl">{session.icon}</div>
                          <div>
                            <h3 className="text-sm font-medium text-slate-900">{session.device} - {session.browser}</h3>
                            <div className="mt-1 space-y-0.5 text-xs text-slate-500">
                              <div>📍 {session.location}</div>
                              <div>🌐 {session.ip}</div>
                              <div>Last active: {session.lastActive}</div>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => void handleRevokeSession(session.id)}
                          disabled={saving}
                          className="px-3 py-1.5 rounded-lg border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50 transition disabled:opacity-60"
                        >
                          Revoke
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {showRevokeAllModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
              <div className="text-center mb-4">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-2xl mx-auto mb-3">⚠️</div>
                <h2 className="text-lg font-semibold text-slate-900">Revoke All Sessions?</h2>
                <p className="text-sm text-slate-600 mt-1">This will log you out from all devices except this one.</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRevokeAllModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => void handleRevokeAll()}
                  disabled={saving}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-60"
                >
                  Revoke All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
