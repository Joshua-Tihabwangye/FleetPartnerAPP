import React, { useState, useEffect } from "react";
import { toastManager } from "../../utils/toastManager";

const INTEGRATIONS = [
  {
    id: "mobile_money",
    name: "Mobile Money",
    description: "Accept payments via MTN, Airtel, and other mobile money providers",
    icon: "📱",
    category: "payments",
    status: "connected",
    provider: "MTN MoMo",
    connectedAt: "2024-01-15"
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Process card payments and international transactions",
    icon: "💳",
    category: "payments",
    status: "disconnected",
    provider: null,
    connectedAt: null
  },
  {
    id: "flutterwave",
    name: "Flutterwave",
    description: "African payment gateway for multiple payment methods",
    icon: "🌍",
    category: "payments",
    status: "disconnected",
    provider: null,
    connectedAt: null
  },
  {
    id: "gps_tracking",
    name: "GPS Tracking",
    description: "Real-time vehicle location tracking and monitoring",
    icon: "📍",
    category: "telematics",
    status: "connected",
    provider: "TeltonikA",
    connectedAt: "2024-02-01"
  },
  {
    id: "obd_diagnostics",
    name: "OBD Diagnostics",
    description: "Vehicle health monitoring and diagnostics",
    icon: "🔧",
    category: "telematics",
    status: "connected",
    provider: "Geotab",
    connectedAt: "2024-01-20"
  },
  {
    id: "quickbooks",
    name: "QuickBooks",
    description: "Sync financial data with QuickBooks accounting",
    icon: "📊",
    category: "accounting",
    status: "disconnected",
    provider: null,
    connectedAt: null
  },
  {
    id: "xero",
    name: "Xero",
    description: "Cloud accounting integration for invoices and reports",
    icon: "📈",
    category: "accounting",
    status: "disconnected",
    provider: null,
    connectedAt: null
  },
  {
    id: "slack",
    name: "Slack",
    description: "Get fleet alerts and notifications in Slack",
    icon: "💬",
    category: "communication",
    status: "connected",
    provider: "#fleet-alerts",
    connectedAt: "2024-03-01"
  },
  {
    id: "whatsapp_business",
    name: "WhatsApp Business",
    description: "Send notifications to drivers via WhatsApp",
    icon: "📲",
    category: "communication",
    status: "disconnected",
    provider: null,
    connectedAt: null
  }
];

const CATEGORIES = [
  { id: "all", label: "All Integrations" },
  { id: "payments", label: "Payments" },
  { id: "telematics", label: "Telematics" },
  { id: "accounting", label: "Accounting" },
  { id: "communication", label: "Communication" }
];

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  status: string;
  provider: string | null;
  connectedAt: string | null;
}

export default function IntegrationsSettingsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectingIntegration, setConnectingIntegration] = useState<Integration | null>(null);
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("integrations") || "null");
    if (stored) {
      setIntegrations(stored);
    } else {
      setIntegrations(INTEGRATIONS);
      localStorage.setItem("integrations", JSON.stringify(INTEGRATIONS));
    }
  }, []);

  const filteredIntegrations = selectedCategory === "all"
    ? integrations
    : integrations.filter(i => i.category === selectedCategory);

  const handleConnect = (integration: Integration) => {
    setConnectingIntegration(integration);
    setShowConnectModal(true);
  };

  const handleDisconnect = (integrationId: string) => {
    const updated = integrations.map(i =>
      i.id === integrationId
        ? { ...i, status: "disconnected", provider: null, connectedAt: null }
        : i
    );
    setIntegrations(updated);
    localStorage.setItem("integrations", JSON.stringify(updated));
    toastManager.show("Integration disconnected", "success");
  };

  const handleConfirmConnect = () => {
    if (!apiKey.trim()) {
      toastManager.show("Please enter API key or credentials", "error");
      return;
    }

    if (!connectingIntegration) return;

    const updated = integrations.map(i =>
      i.id === connectingIntegration.id
        ? { ...i, status: "connected", provider: "Connected", connectedAt: new Date().toISOString().split('T')[0] }
        : i
    );
    setIntegrations(updated);
    localStorage.setItem("integrations", JSON.stringify(updated));
    setShowConnectModal(false);
    setConnectingIntegration(null);
    setApiKey("");
    toastManager.show(`${connectingIntegration.name} connected successfully!`, "success");
  };

  const connectedCount = integrations.filter(i => i.status === "connected").length;

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      <div className="w-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">Integrations</h1>
          <p className="text-sm text-slate-600">Connect third-party services to enhance your fleet operations</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="text-2xl font-semibold text-slate-900">{integrations.length}</div>
            <div className="text-xs text-slate-500">Available Integrations</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="text-2xl font-semibold text-emerald-600">{connectedCount}</div>
            <div className="text-xs text-slate-500">Connected</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="text-2xl font-semibold text-amber-600">{integrations.length - connectedCount}</div>
            <div className="text-xs text-slate-500">Available to Connect</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="text-2xl font-semibold text-blue-600">99.9%</div>
            <div className="text-xs text-slate-500">Uptime</div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${selectedCategory === cat.id
                ? "bg-ev-green text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIntegrations.map((integration) => (
            <div
              key={integration.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl">
                    {integration.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{integration.name}</h3>
                    <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${integration.status === "connected"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                      }`}>
                      {integration.status === "connected" ? "✓ Connected" : "Not Connected"}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 mb-4">{integration.description}</p>

              {integration.status === "connected" && (
                <div className="text-[11px] text-slate-500 mb-3">
                  <div>Provider: <span className="text-slate-700">{integration.provider}</span></div>
                  <div>Connected: <span className="text-slate-700">{integration.connectedAt}</span></div>
                </div>
              )}

              <div className="flex gap-2">
                {integration.status === "connected" ? (
                  <>
                    <button className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50">
                      Configure
                    </button>
                    <button
                      onClick={() => handleDisconnect(integration.id)}
                      className="px-3 py-1.5 rounded-lg border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleConnect(integration)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-ev-green to-emerald-600 text-white text-xs font-medium hover:opacity-90"
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Connect Modal */}
        {showConnectModal && connectingIntegration && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl">
                  {connectingIntegration.icon}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Connect {connectingIntegration.name}</h2>
                  <p className="text-xs text-slate-500">{connectingIntegration.description}</p>
                </div>
              </div>

              <div className="space-y-4">
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
                <p className="text-[11px] text-slate-500">
                  You can find your API key in your {connectingIntegration.name} dashboard settings.
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowConnectModal(false);
                    setConnectingIntegration(null);
                    setApiKey("");
                  }}
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmConnect}
                  className="flex-1 px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark"
                >
                  Connect
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
