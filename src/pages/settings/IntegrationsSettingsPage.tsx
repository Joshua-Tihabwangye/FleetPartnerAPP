import React, { useEffect, useMemo, useState } from "react";
import { getFleetIntegrations, patchFleetIntegrations } from "../../services/api/fleetApi";
import { toastManager } from "../../utils/toastManager";

type Integration = {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  status: "connected" | "disconnected";
  provider: string | null;
  connectedAt: string | null;
};

const DEFAULT_INTEGRATIONS: Integration[] = [
  { id: "mobile_money", name: "Mobile Money", description: "Accept mobile money", icon: "📱", category: "payments", status: "disconnected", provider: null, connectedAt: null },
  { id: "stripe", name: "Stripe", description: "Card payments", icon: "💳", category: "payments", status: "disconnected", provider: null, connectedAt: null },
  { id: "gps_tracking", name: "GPS Tracking", description: "Vehicle tracking", icon: "📍", category: "telematics", status: "disconnected", provider: null, connectedAt: null },
  { id: "quickbooks", name: "QuickBooks", description: "Accounting sync", icon: "📊", category: "accounting", status: "disconnected", provider: null, connectedAt: null },
  { id: "slack", name: "Slack", description: "Alert notifications", icon: "💬", category: "communication", status: "disconnected", provider: null, connectedAt: null },
];

const CATEGORIES = [
  { id: "all", label: "All Integrations" },
  { id: "payments", label: "Payments" },
  { id: "telematics", label: "Telematics" },
  { id: "accounting", label: "Accounting" },
  { id: "communication", label: "Communication" },
];

function normalizeIntegration(raw: Record<string, unknown>): Integration {
  return {
    id: String(raw.id ?? "unknown"),
    name: String(raw.name ?? "Integration"),
    description: String(raw.description ?? ""),
    icon: String(raw.icon ?? "🔌"),
    category: String(raw.category ?? "other"),
    status: raw.status === "connected" ? "connected" : "disconnected",
    provider: raw.provider ? String(raw.provider) : null,
    connectedAt: raw.connectedAt ? String(raw.connectedAt) : null,
  };
}

export default function IntegrationsSettingsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectingIntegration, setConnectingIntegration] = useState<Integration | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadIntegrations = async () => {
    setLoading(true);
    try {
      const response = await getFleetIntegrations();
      const rows = Array.isArray(response.integrations) ? response.integrations.map((entry) => normalizeIntegration(entry)) : [];
      setIntegrations(rows.length > 0 ? rows : DEFAULT_INTEGRATIONS);
    } catch (error) {
      console.error("Failed to load integrations", error);
      toastManager.show("Failed to load integrations from backend", "error");
      setIntegrations(DEFAULT_INTEGRATIONS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadIntegrations();
  }, []);

  const filteredIntegrations = useMemo(
    () => (selectedCategory === "all" ? integrations : integrations.filter((i) => i.category === selectedCategory)),
    [integrations, selectedCategory],
  );

  const persist = async (next: Integration[], successMessage: string) => {
    setSaving(true);
    try {
      await patchFleetIntegrations({ integrations: next });
      setIntegrations(next);
      toastManager.show(successMessage, "success");
    } catch (error) {
      console.error("Failed to persist integrations", error);
      toastManager.show("Failed to save integration changes", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDisconnect = async (integrationId: string) => {
    const next = integrations.map((item) =>
      item.id === integrationId ? { ...item, status: "disconnected" as const, provider: null, connectedAt: null } : item,
    );
    await persist(next, "Integration disconnected");
  };

  const handleConfirmConnect = async () => {
    if (!apiKey.trim() || !connectingIntegration) {
      toastManager.show("Please enter API key or credentials", "error");
      return;
    }

    const next = integrations.map((item) =>
      item.id === connectingIntegration.id
        ? { ...item, status: "connected" as const, provider: "Connected", connectedAt: new Date().toISOString().slice(0, 10) }
        : item,
    );

    await persist(next, `${connectingIntegration.name} connected successfully`);
    setShowConnectModal(false);
    setConnectingIntegration(null);
    setApiKey("");
  };

  const connectedCount = integrations.filter((item) => item.status === "connected").length;

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">Integrations</h1>
          <p className="text-sm text-slate-600">Connect third-party services to your fleet workspace</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm"><div className="text-2xl font-semibold text-slate-900">{integrations.length}</div><div className="text-xs text-slate-500">Available</div></div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm"><div className="text-2xl font-semibold text-emerald-600">{connectedCount}</div><div className="text-xs text-slate-500">Connected</div></div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm"><div className="text-2xl font-semibold text-amber-600">{integrations.length - connectedCount}</div><div className="text-xs text-slate-500">Pending</div></div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm"><div className="text-2xl font-semibold text-blue-600">Backend</div><div className="text-xs text-slate-500">Authoritative</div></div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${selectedCategory === cat.id ? "bg-ev-green text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-600">Loading integrations...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIntegrations.map((integration) => (
              <div key={integration.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl">{integration.icon}</div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">{integration.name}</h3>
                      <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${integration.status === "connected" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                        {integration.status === "connected" ? "Connected" : "Not Connected"}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-600 mb-4">{integration.description}</p>
                <div className="flex gap-2">
                  {integration.status === "connected" ? (
                    <button onClick={() => void handleDisconnect(integration.id)} disabled={saving} className="w-full px-3 py-1.5 rounded-lg border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60">
                      Disconnect
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setConnectingIntegration(integration);
                        setShowConnectModal(true);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-gradient-to-r from-ev-green to-emerald-600 text-white text-xs font-medium hover:opacity-90"
                    >
                      Connect
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {showConnectModal && connectingIntegration && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Connect {connectingIntegration.name}</h2>
              <p className="text-xs text-slate-500 mb-4">Enter credentials to activate this integration.</p>
              <label className="block">
                <span className="text-xs font-medium text-slate-700">API Key / Credentials</span>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-ev-green focus:outline-none"
                  placeholder="Enter API key..."
                />
              </label>
              <div className="flex gap-3 mt-6">
                <button onClick={() => { setShowConnectModal(false); setConnectingIntegration(null); setApiKey(""); }} className="flex-1 px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
                <button onClick={() => void handleConfirmConnect()} disabled={saving} className="flex-1 px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark disabled:opacity-60">Connect</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
