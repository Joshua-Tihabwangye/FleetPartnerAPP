import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toastManager } from "../../utils/toastManager";
import { isFleetBackendEnabled, listFleetComplianceIncidents } from "../../services/api/fleetApi";

interface Message {
    id: number | string;
    subject: string;
    message: string;
    status: "sent" | "pending" | "resolved";
    createdAt: string;
    email: string;
    name: string;
}

export default function SupportMessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [filter, setFilter] = useState<"all" | "sent" | "pending" | "resolved">("all");
    const [searchQuery, setSearchQuery] = useState<string>("");

    useEffect(() => {
        const hydrate = async () => {
            if (isFleetBackendEnabled()) {
                try {
                    const incidents = await listFleetComplianceIncidents();
                    const supportIncidents = incidents
                        .filter((incident) => incident.category.toLowerCase() === "support")
                        .map((incident) => {
                            const subjectMatch = incident.description.match(/^\[(.*?)\]\s*/);
                            const subject = subjectMatch?.[1] || "Support request";
                            const message = incident.description.replace(/^\[(.*?)\]\s*/, "");
                            const mappedStatus =
                                incident.status === "resolved"
                                    ? "resolved"
                                    : "pending";
                            return {
                                id: incident.id,
                                subject,
                                message,
                                status: mappedStatus,
                                createdAt: new Date(incident.createdAt).toISOString(),
                                email: "n/a",
                                name: "Fleet support",
                            } as Message;
                        });
                    setMessages(supportIncidents);
                    return;
                } catch (error) {
                    console.warn("Failed to load backend support incidents. Falling back to local messages.", error);
                }
            }
            const storedMessages = JSON.parse(localStorage.getItem("support_messages") || "[]");
            setMessages(storedMessages);
        };
        void hydrate();
    }, []);

    const filteredMessages = messages.filter(msg => {
        const matchesFilter = filter === "all" || msg.status === filter;
        const matchesSearch = msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            msg.message.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const handleDeleteMessage = (id: number | string) => {
        if (isFleetBackendEnabled()) {
            toastManager.show("Delete is not available for backend support incidents yet.", "info");
            return;
        }
        const updatedMessages = messages.filter(msg => msg.id !== id);
        setMessages(updatedMessages);
        localStorage.setItem("support_messages", JSON.stringify(updatedMessages));
        toastManager.show("Message deleted", "success");
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            sent: "bg-emerald-100 text-emerald-700",
            pending: "bg-amber-100 text-amber-700",
            resolved: "bg-blue-100 text-blue-700",
        };
        return styles[status] || styles.sent;
    };

    return (
        <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
            {/* Header */}
            <div className="mb-6">
                <Link
                    to="/help"
                    className="text-sm text-slate-600 hover:text-slate-900 mb-2 inline-block"
                >
                    ← Back to Help & Support
                </Link>
                <h1 className="text-2xl font-semibold text-slate-900 mb-2">Support Messages</h1>
                <p className="text-sm text-slate-600">View and manage your support messages</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex-1 min-w-0 w-full sm:min-w-[200px]">
                        <div className="flex items-center rounded-lg border border-slate-300 bg-slate-50 px-3 py-2">
                            <span className="mr-2 text-slate-400">🔍</span>
                            <input
                                type="text"
                                placeholder="Search messages..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 bg-transparent outline-none text-sm text-slate-900"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {["all", "sent", "pending", "resolved"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status as "all" | "sent" | "pending" | "resolved")}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${filter === status
                                    ? "bg-ev-green text-white"
                                    : "border border-slate-300 hover:bg-slate-50"
                                    }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Messages List */}
            {filteredMessages.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <div className="text-4xl mb-4">📭</div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No messages yet</h3>
                    <p className="text-sm text-slate-600 mb-4">
                        Messages you send through Contact Support will appear here.
                    </p>
                    <Link
                        to="/help"
                        className="inline-flex items-center px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark transition"
                    >
                        Contact Support
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredMessages.map((msg) => (
                        <div
                            key={msg.id}
                            className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-sm font-semibold text-slate-900">{msg.subject}</h3>
                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusBadge(msg.status)}`}>
                                            {msg.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        {new Date(msg.createdAt).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDeleteMessage(msg.id)}
                                    className="text-slate-400 hover:text-red-500 p-1 transition"
                                    title="Delete message"
                                >
                                    🗑️
                                </button>
                            </div>
                            <p className="text-sm text-slate-600 line-clamp-2">{msg.message}</p>
                            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-slate-500">
                                <span>📧 {msg.email}</span>
                                <span>👤 {msg.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Stats Footer */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                    <div className="text-2xl font-semibold text-slate-900">{messages.length}</div>
                    <div className="text-xs text-slate-500">Total Messages</div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                    <div className="text-2xl font-semibold text-emerald-600">
                        {messages.filter(m => m.status === "resolved").length}
                    </div>
                    <div className="text-xs text-slate-500">Resolved</div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                    <div className="text-2xl font-semibold text-amber-600">
                        {messages.filter(m => m.status === "pending").length}
                    </div>
                    <div className="text-xs text-slate-500">Pending</div>
                </div>
            </div>
        </div>
    );
}
