import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toastManager } from "../../utils/toastManager";

export default function AccountSecurityPage() {
    const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
    const [twoFactor, setTwoFactor] = useState(false);

    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            toastManager.show("New passwords do not match", "error");
            return;
        }
        toastManager.show("Password updated successfully", "success");
        setPasswords({ current: "", new: "", confirm: "" });
    };

    return (
        <div className="min-h-[calc(100vh-56px)] px-4 sm:px-6 lg:px-10 py-6 bg-slate-50">
            <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-slate-900 mb-1">Account Security</h1>
                    <p className="text-sm text-slate-600">Manage your password and security settings</p>
                </div>

                <div className="space-y-6">
                    {/* Password Change */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Change Password</h2>
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                                <input
                                    type="password"
                                    value={passwords.current}
                                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-ev-green focus:outline-none"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        value={passwords.new}
                                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-ev-green focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={passwords.confirm}
                                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-ev-green focus:outline-none"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-ev-green text-white text-sm font-medium rounded-lg hover:bg-ev-green-dark"
                                >
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Two-Factor Auth */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">Two-Factor Authentication</h2>
                                <p className="text-sm text-slate-600">Add an extra layer of security to your account</p>
                            </div>
                            <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                <input
                                    type="checkbox"
                                    name="toggle"
                                    id="toggle"
                                    checked={twoFactor}
                                    onChange={() => {
                                        setTwoFactor(!twoFactor);
                                        toastManager.show(`2FA ${!twoFactor ? 'enabled' : 'disabled'}`, "info");
                                    }}
                                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                    style={{ right: twoFactor ? '0' : 'auto', left: twoFactor ? 'auto' : '0' }}
                                />
                                <label
                                    htmlFor="toggle"
                                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${twoFactor ? 'bg-ev-green' : 'bg-slate-300'}`}
                                ></label>
                            </div>
                        </div>
                        {twoFactor && (
                            <div className="p-4 bg-blue-50 text-blue-800 text-sm rounded-lg border border-blue-100">
                                Two-factor authentication is currently active. You will be asked for a code when logging in from a new device.
                            </div>
                        )}
                    </div>

                    {/* Active Sessions */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Active Sessions</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="text-2xl">💻</div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Windows PC - Chrome</p>
                                        <p className="text-xs text-slate-500">Kampala, Uganda • Active now</p>
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Current</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="text-2xl">📱</div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">iPhone 13 - Safari</p>
                                        <p className="text-xs text-slate-500">Kampala, Uganda • 2 hours ago</p>
                                    </div>
                                </div>
                                <button className="text-xs text-red-600 hover:text-red-700 font-medium">Revoke</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
