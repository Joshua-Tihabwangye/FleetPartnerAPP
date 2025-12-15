import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ShuttleAttendantCreatePage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        assignedRoute: "",
        certificationDate: ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Saving attendant:", formData);
        navigate("/school-shuttles/attendants");
    };

    return (
        <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50 dark:bg-slate-900">
            {/* Header */}
            <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                <Link to="/school-shuttles/attendants" className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition mb-2 inline-block">
                    ← Back to Attendants List
                </Link>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                    Add New Attendant
                </h1>
            </div>

            <div className="max-w-2xl mx-auto">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name Fields */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-ev-green focus:border-transparent outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-ev-green focus:border-transparent outline-none"
                                />
                            </div>

                            {/* Contact Fields */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    required
                                    placeholder="+256..."
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-ev-green focus:border-transparent outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-ev-green focus:border-transparent outline-none"
                                />
                            </div>

                            {/* Assignment */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Primary Route Assignment
                                </label>
                                <select
                                    value={formData.assignedRoute}
                                    onChange={(e) => setFormData({ ...formData, assignedRoute: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-ev-green focus:border-transparent outline-none"
                                >
                                    <option value="">-- No Assignment --</option>
                                    <option value="R-001">R-001: Morning Pickup (North)</option>
                                    <option value="R-002">R-002: Afternoon Dropoff (South)</option>
                                </select>
                            </div>

                            {/* Certification */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    First Aid Certification Date
                                </label>
                                <input
                                    type="date"
                                    value={formData.certificationDate}
                                    onChange={(e) => setFormData({ ...formData, certificationDate: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-ev-green focus:border-transparent outline-none"
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => navigate("/school-shuttles/attendants")}
                                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 rounded-lg bg-ev-green text-white font-medium hover:bg-emerald-600 transition shadow-lg shadow-emerald-500/20"
                            >
                                Create Attendant
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
