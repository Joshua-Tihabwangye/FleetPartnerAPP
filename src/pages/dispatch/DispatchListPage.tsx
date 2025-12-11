import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface Dispatch {
    id: number;
    pickup: string;
    dropoff: string;
    vehicle: string;
    driver: string;
    fare: string;
    status: string;
}

export default function DispatchListPage() {
    const [dispatches, setDispatches] = useState<Dispatch[]>([]);

    useEffect(() => {
        const storedDispatches = JSON.parse(localStorage.getItem("dispatches") || "[]");
        setDispatches(storedDispatches);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "scheduled": return "bg-blue-100 text-blue-700";
            case "in-progress": return "bg-yellow-100 text-yellow-700";
            case "completed": return "bg-emerald-100 text-emerald-700";
            case "cancelled": return "bg-red-100 text-red-700";
            default: return "bg-slate-100 text-slate-700";
        }
    };

    return (
        <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900 mb-2">Dispatches</h1>
                    <p className="text-sm text-slate-600">Manage manual dispatch bookings</p>
                </div>
                <Link
                    to="/dispatch/new"
                    className="px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark transition-colors"
                >
                    + New dispatch
                </Link>
            </div>

            {/* Dispatches List */}
            {dispatches.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <div className="text-3xl mb-3">📋</div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No dispatches yet</h3>
                    <p className="text-sm text-slate-600 mb-4">Create your first manual dispatch booking</p>
                    <Link
                        to="/dispatch/new"
                        className="inline-block px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark"
                    >
                        Create dispatch
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dispatches.map((dispatch) => (
                        <div
                            key={dispatch.id}
                            className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <h3 className="text-lg font-semibold text-slate-900">Dispatch #{dispatch.id.toString().slice(-6)}</h3>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(dispatch.status)}`}>
                                    {dispatch.status}
                                </span>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="text-slate-500">From:</span>
                                    <p className="font-medium text-slate-900">{dispatch.pickup}</p>
                                </div>
                                <div>
                                    <span className="text-slate-500">To:</span>
                                    <p className="font-medium text-slate-900">{dispatch.dropoff}</p>
                                </div>
                                <div className="flex justify-between pt-2 mt-2 border-t border-slate-100">
                                    <span className="text-slate-500">Fare:</span>
                                    <span className="font-semibold text-emerald-600">UGX {parseInt(dispatch.fare).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
