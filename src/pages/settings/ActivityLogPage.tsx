import React, { useState } from "react";
import { activityLogger, ActivityLogEntry } from "../../utils/activityLogger";

export default function ActivityLogPage() {
    const [entries, setEntries] = useState<ActivityLogEntry[]>(activityLogger.getAll());
    const [filterCategory, setFilterCategory] = useState<string>("all");

    const categories: { value: string; label: string }[] = [
        { value: "all", label: "All Activities" },
        { value: "driver", label: "Drivers" },
        { value: "vehicle", label: "Vehicles" },
        { value: "trip", label: "Trips" },
        { value: "payout", label: "Payouts" },
        { value: "settings", label: "Settings" },
        { value: "system", label: "System" },
    ];

    const filteredEntries = filterCategory === "all"
        ? entries
        : entries.filter((e) => e.category === filterCategory);

    const getCategoryColor = (category: ActivityLogEntry["category"]) => {
        switch (category) {
            case "driver": return "bg-blue-100 text-blue-700";
            case "vehicle": return "bg-emerald-100 text-emerald-700";
            case "trip": return "bg-purple-100 text-purple-700";
            case "payout": return "bg-orange-100 text-orange-700";
            case "settings": return "bg-slate-100 text-slate-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getCategoryIcon = (category: ActivityLogEntry["category"]) => {
        switch (category) {
            case "driver": return "👤";
            case "vehicle": return "🚗";
            case "trip": return "📍";
            case "payout": return "💰";
            case "settings": return "⚙️";
            default: return "📋";
        }
    };

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleClear = () => {
        activityLogger.clear();
        setEntries([]);
    };

    // Add some demo entries if empty
    React.useEffect(() => {
        if (entries.length === 0) {
            activityLogger.log("Logged into Fleet Partner", "system", "Session started", "Manager");
            activityLogger.log("Viewed driver list", "driver", "Accessed drivers page", "Manager");
            activityLogger.log("Updated vehicle UAA 123B", "vehicle", "Changed status to online", "Manager");
            activityLogger.log("Approved weekly payout", "payout", "UGX 2.5M processed", "Manager");
            setEntries(activityLogger.getAll());
        }
    }, []);

    return (
        <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
            <div className="w-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900 mb-1">Activity Log</h1>
                        <p className="text-sm text-slate-600">Track all actions and changes in your fleet</p>
                    </div>
                    <button
                        onClick={handleClear}
                        className="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Clear Log
                    </button>
                </div>

                {/* Filter */}
                <div className="mb-6">
                    <div className="flex gap-2 flex-wrap">
                        {categories.map((cat) => (
                            <button
                                key={cat.value}
                                onClick={() => setFilterCategory(cat.value)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${filterCategory === cat.value
                                        ? "bg-ev-green text-white"
                                        : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Activity List */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    {filteredEntries.length === 0 ? (
                        <div className="px-6 py-12 text-center text-slate-500">
                            <div className="text-4xl mb-3">📋</div>
                            <p>No activity recorded yet</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Time</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Action</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Category</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">User</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredEntries.map((entry) => (
                                    <tr key={entry.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                                            {formatDate(entry.timestamp)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">{getCategoryIcon(entry.category)}</span>
                                                <span className="text-sm font-medium text-slate-900">{entry.action}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(entry.category)}`}>
                                                {entry.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{entry.user}</td>
                                        <td className="px-4 py-3 text-sm text-slate-500 min-w-[220px]">{entry.details}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
