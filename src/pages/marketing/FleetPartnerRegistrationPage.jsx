import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function FleetPartnerRegistrationPage() {
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    phone: "",
    fleetSize: "",
    services: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Registration submitted. Wire to your API.");
  };

  const handleServiceToggle = (service) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-16">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-8 rounded-xl bg-ev-green flex items-center justify-center text-[11px] font-black text-white">
              EV
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-900">EVzone Fleet Partner</span>
              <span className="text-[11px] text-slate-600">
                Become a Fleet Partner
              </span>
            </div>
          </div>
          <h1 className="text-2xl font-semibold mb-2 text-slate-900">Register your fleet</h1>
          <p className="text-[12px] text-slate-600 mb-6">
            Join EVzone Fleet Partner and manage your entire fleet from one platform.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4 text-[12px]">
            <label className="block space-y-1">
              <span className="text-[11px] text-slate-700 font-medium">Company name</span>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
                placeholder="Your Fleet Company"
                required
              />
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block space-y-1">
                <span className="text-[11px] text-slate-700 font-medium">Work email</span>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
                  placeholder="you@fleet.co"
                  required
                />
              </label>
              <label className="block space-y-1">
                <span className="text-[11px] text-slate-700 font-medium">Phone number</span>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
                  placeholder="+256 700 000 000"
                  required
                />
              </label>
            </div>
            <label className="block space-y-1">
              <span className="text-[11px] text-slate-700 font-medium">Fleet size</span>
              <select
                value={formData.fleetSize}
                onChange={(e) => setFormData({ ...formData, fleetSize: e.target.value })}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[12px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
                required
              >
                <option value="">Select fleet size</option>
                <option value="1-10">1-10 vehicles</option>
                <option value="11-50">11-50 vehicles</option>
                <option value="51-100">51-100 vehicles</option>
                <option value="100+">100+ vehicles</option>
              </select>
            </label>
            <div className="space-y-2">
              <span className="text-[11px] text-slate-700 font-medium block">Services you offer</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {["Rides", "Delivery", "Rentals", "School Shuttles", "Tours", "EMS"].map((service) => (
                  <label
                    key={service}
                    className={`flex items-center gap-2 rounded-lg border p-2 cursor-pointer transition ${
                      formData.services.includes(service)
                        ? "border-ev-green bg-emerald-50"
                        : "border-slate-300 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.services.includes(service)}
                      onChange={() => handleServiceToggle(service)}
                      className="h-3 w-3 text-ev-green focus:ring-ev-green"
                    />
                    <span className="text-[11px] text-slate-700">{service}</span>
                  </label>
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-ev-green text-white font-semibold py-2 text-[12px] hover:bg-ev-green-dark focus:outline-none focus:ring-2 focus:ring-ev-green"
            >
              Submit registration
            </button>
          </form>
          <p className="mt-4 text-[11px] text-slate-600 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-ev-green hover:text-ev-green-dark font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
