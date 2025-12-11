import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toastManager } from "../../../utils/toastManager";

export default function TourBookingCreatePage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        tourPackage: "",
        startDate: "",
        endDate: "",
        guests: "1",
        specialRequests: ""
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        toastManager.show("Tour booking created successfully!", "success");
        navigate("/tours/bookings");
    };

    return (
        <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
            <div className="w-full">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-slate-900 mb-2">Create Tour Booking</h1>
                    <p className="text-sm text-slate-600">Book a new tour package for your customer</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Customer Information */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Customer Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="block md:col-span-2">
                                <span className="text-sm font-medium text-slate-700 mb-1 block">Customer Name *</span>
                                <input
                                    type="text"
                                    value={formData.customerName}
                                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                                    required
                                />
                            </label>
                            <label className="block">
                                <span className="text-sm font-medium text-slate-700 mb-1 block">Email *</span>
                                <input
                                    type="email"
                                    value={formData.customerEmail}
                                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                                    required
                                />
                            </label>
                            <label className="block">
                                <span className="text-sm font-medium text-slate-700 mb-1 block">Phone *</span>
                                <input
                                    type="tel"
                                    value={formData.customerPhone}
                                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                                    placeholder="+256 700 000 000"
                                    required
                                />
                            </label>
                        </div>
                    </div>

                    {/* Tour Details */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Tour Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="block md:col-span-2">
                                <span className="text-sm font-medium text-slate-700 mb-1 block">Tour Package *</span>
                                <select
                                    value={formData.tourPackage}
                                    onChange={(e) => setFormData({ ...formData, tourPackage: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                                    required
                                >
                                    <option value="">Select package...</option>
                                    <option value="murchison">Murchison Falls Safari - 3 Days</option>
                                    <option value="gorilla">Gorilla Trekking Experience - 2 Days</option>
                                    <option value="queen">Queen Elizabeth Wildlife Tour - 3 Days</option>
                                    <option value="cultural">Cultural Heritage Tour - 4 Days</option>
                                </select>
                            </label>
                            <label className="block">
                                <span className="text-sm font-medium text-slate-700 mb-1 block">Start Date *</span>
                                <input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                                    required
                                />
                            </label>
                            <label className="block">
                                <span className="text-sm font-medium text-slate-700 mb-1 block">End Date *</span>
                                <input
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                                    required
                                />
                            </label>
                            <label className="block">
                                <span className="text-sm font-medium text-slate-700 mb-1 block">Number of Guests *</span>
                                <input
                                    type="number"
                                    value={formData.guests}
                                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                                    min="1"
                                    max="20"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                                    required
                                />
                            </label>
                            <label className="block md:col-span-2">
                                <span className="text-sm font-medium text-slate-700 mb-1 block">Special Requests</span>
                                <textarea
                                    value={formData.specialRequests}
                                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                                    placeholder="Dietary requirements, accessibility needs, etc."
                                />
                            </label>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => navigate("/tours/bookings")}
                            className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark"
                        >
                            Create Booking
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
