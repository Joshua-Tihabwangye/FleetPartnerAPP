import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toastManager } from "../../../utils/toastManager";

const DEFAULT_SESSIONS = [
  {
    id: 1,
    device: "Windows PC",
    browser: "Chrome 120",
    location: "Kampala, Uganda",
    ip: "102.89.xx.xx",
    lastActive: "Active now",
    isCurrent: true,
    icon: "💻"
  },
  {
    id: 2,
    device: "iPhone 13",
    browser: "Safari 17",
    location: "Kampala, Uganda",
    ip: "102.89.xx.xx",
    lastActive: "2 hours ago",
    isCurrent: false,
    icon: "📱"
  },
  {
    id: 3,
    device: "MacBook Pro",
    browser: "Firefox 121",
    location: "Entebbe, Uganda",
    ip: "41.210.xx.xx",
    lastActive: "Yesterday",
    isCurrent: false,
    icon: "💻"
  },
  {
    id: 4,
    device: "Android Tablet",
    browser: "Chrome Mobile",
    location: "Jinja, Uganda",
    ip: "197.157.xx.xx",
    lastActive: "3 days ago",
    isCurrent: false,
    icon: "📱"
  }
];

export default function FleetPartnerSessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [showRevokeAllModal, setShowRevokeAllModal] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("sessions") || "null");
    if (stored) {
      setSessions(stored);
    } else {
      setSessions(DEFAULT_SESSIONS);
      localStorage.setItem("sessions", JSON.stringify(DEFAULT_SESSIONS));
    }
  }, []);

  const handleRevokeSession = (sessionId) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session?.isCurrent) {
      toastManager.show("Cannot revoke current session", "error");
      return;
    }

    const updated = sessions.filter(s => s.id !== sessionId);
    setSessions(updated);
    localStorage.setItem("sessions", JSON.stringify(updated));
    toastManager.show("Session revoked successfully", "success");
  };

  const handleRevokeAll = () => {
    const updated = sessions.filter(s => s.isCurrent);
    setSessions(updated);
    localStorage.setItem("sessions", JSON.stringify(updated));
    setShowRevokeAllModal(false);
    toastManager.show("All other sessions revoked", "success");
  };

  const currentSession = sessions.find(s => s.isCurrent);
  const otherSessions = sessions.filter(s => !s.isCurrent);

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      <div className="w-full">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/settings/account-security"
            className="text-sm text-slate-600 hover:text-slate-900 mb-2 inline-block"
          >
            ← Back to Account Security
          </Link>
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">Active Sessions</h1>
          <p className="text-sm text-slate-600">Manage devices where you're logged in</p>
        </div>

        {/* Current Session */}
        {currentSession && (
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Current Session
              </span>
            </div>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center text-2xl">
                  {currentSession.icon}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {currentSession.device} - {currentSession.browser}
                  </h3>
                  <div className="mt-1 space-y-0.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <span>📍</span>
                      <span>{currentSession.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🌐</span>
                      <span>IP: {currentSession.ip}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-emerald-700 font-medium">{currentSession.lastActive}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Sessions */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <h2 className="text-sm font-semibold text-slate-900">Other Sessions ({otherSessions.length})</h2>
            {otherSessions.length > 0 && (
              <button
                onClick={() => setShowRevokeAllModal(true)}
                className="text-xs font-medium text-red-600 hover:text-red-700"
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
                      <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-xl">
                        {session.icon}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-slate-900">
                          {session.device} - {session.browser}
                        </h3>
                        <div className="mt-1 space-y-0.5 text-xs text-slate-500">
                          <div className="flex items-center gap-4">
                            <span>📍 {session.location}</span>
                            <span>🌐 {session.ip}</span>
                          </div>
                          <div>Last active: {session.lastActive}</div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRevokeSession(session.id)}
                      className="px-3 py-1.5 rounded-lg border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50 transition"
                    >
                      Revoke
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Security Tips */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">🔐 Security Tips</h3>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Revoke sessions from unknown devices immediately</li>
            <li>• Enable two-factor authentication for extra security</li>
            <li>• Avoid logging in from public or shared devices</li>
            <li>• Log out when using borrowed devices</li>
          </ul>
        </div>

        {/* Revoke All Modal */}
        {showRevokeAllModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
              <div className="text-center mb-4">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-2xl mx-auto mb-3">
                  ⚠️
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Revoke All Sessions?</h2>
                <p className="text-sm text-slate-600 mt-1">
                  This will log you out from all devices except this one.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRevokeAllModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRevokeAll}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700"
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
