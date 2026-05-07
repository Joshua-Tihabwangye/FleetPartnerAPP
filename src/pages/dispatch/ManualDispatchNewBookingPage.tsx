import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toastManager } from "../../utils/toastManager";

// Mock address suggestions for autocomplete simulation
const mockAddresses = [
  "Garden City Mall, Kampala",
  "Acacia Mall, Kisementi",
  "Kampala Central, Uganda",
  "Entebbe International Airport",
  "Kololo, Kampala",
  "Nakasero, Kampala",
  "Ntinda Trading Centre",
  "Naalya, Kampala",
  "Muyenga, Tank Hill",
  "Bugolobi, Kampala",
  "Forest Mall, Lugogo",
  "Kisaasi, Kampala",
  "Wandegeya, Kampala",
  "Bukoto, Kampala",
  "Naguru, Kampala",
];

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  required?: boolean;
}

function AutocompleteInput({ value, onChange, placeholder, label, required }: AutocompleteInputProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value.length > 1) {
      const filtered = mockAddresses.filter(addr =>
        addr.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value]);

  return (
    <div className="relative">
      <label className="block">
        <span className="text-sm font-medium text-slate-700 mb-1 block">
          {label} {required && "*"}
        </span>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => value.length > 1 && setSuggestions(mockAddresses.filter(a => a.toLowerCase().includes(value.toLowerCase())).slice(0, 5))}
            className="w-full px-3 py-2 pl-10 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
            placeholder={placeholder}
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">📍</span>
        </div>
      </label>
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onChange(suggestion);
                setShowSuggestions(false);
              }}
              className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-emerald-50 hover:text-ev-green transition-colors flex items-center gap-2"
            >
              <span className="text-slate-400">📍</span>
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ManualDispatchNewBookingPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    vehicle: "",
    driver: "",
    fare: "",
    notes: "",
    // New fields
    pickupTime: "now" as "now" | "scheduled",
    scheduledDateTime: "",
    serviceType: "ride",
    customerName: "",
    customerPhone: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Create new dispatch object
    const newDispatch = {
      id: Date.now(),
      pickup: formData.pickupLocation,
      dropoff: formData.dropoffLocation,
      status: formData.pickupTime === "now" ? "in-progress" : "scheduled",
      createdAt: new Date().toISOString(),
      scheduledFor: formData.pickupTime === "scheduled" ? formData.scheduledDateTime : null,
      ...formData
    };

    // Get existing dispatches
    const existingDispatches = JSON.parse(localStorage.getItem("dispatches") || "[]");
    existingDispatches.push(newDispatch);
    localStorage.setItem("dispatches", JSON.stringify(existingDispatches));

    toastManager.show("Dispatch created successfully!", "success");
    navigate("/dispatch");
  };

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      <div className="w-full max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/trips"
            className="text-sm text-slate-600 hover:text-slate-900 mb-2 inline-flex items-center gap-1"
          >
            ← Back to trips
          </Link>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Manual dispatch · New booking</h1>
          <p className="text-sm text-slate-600">Create a new booking manually</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Pickup Time */}
            <div>
              <span className="text-sm font-medium text-slate-700 mb-3 block">Pickup time *</span>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, pickupTime: "now" })}
                  className={`flex-1 px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${formData.pickupTime === "now"
                    ? "border-ev-green bg-emerald-50 text-ev-green"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>⚡</span>
                    <span>Now</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Immediate dispatch</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, pickupTime: "scheduled" })}
                  className={`flex-1 px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${formData.pickupTime === "scheduled"
                    ? "border-ev-green bg-emerald-50 text-ev-green"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>📅</span>
                    <span>Schedule for later</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Set date & time</div>
                </button>
              </div>
              {formData.pickupTime === "scheduled" && (
                <div className="mt-3">
                  <input
                    type="datetime-local"
                    value={formData.scheduledDateTime}
                    onChange={(e) => setFormData({ ...formData, scheduledDateTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
                    required={formData.pickupTime === "scheduled"}
                  />
                </div>
              )}
            </div>

            {/* Service Type */}
            <div>
              <span className="text-sm font-medium text-slate-700 mb-3 block">Service type *</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {[
                  { id: "ride", label: "Rides", icon: "🚗" },
                  { id: "delivery", label: "Delivery", icon: "📦" },
                  { id: "shuttle", label: "Shuttle", icon: "🚌" },
                  { id: "tour", label: "Tours", icon: "🌍" },
                  { id: "ems", label: "EMS", icon: "🚑" },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, serviceType: type.id })}
                    className={`px-3 py-2.5 rounded-lg border-2 text-xs font-medium transition-all ${formData.serviceType === type.id
                      ? "border-ev-green bg-emerald-50 text-ev-green"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                  >
                    <div className="text-lg mb-1">{type.icon}</div>
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="sm:col-span-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer Contact</span>
              </div>
              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-1 block">Customer name</span>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
                  placeholder="John Doe"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-1 block">Phone number</span>
                <input
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
                  placeholder="+256 700 000 000"
                />
              </label>
            </div>

            {/* Locations with Autocomplete */}
            <AutocompleteInput
              label="Pickup location"
              value={formData.pickupLocation}
              onChange={(value) => setFormData({ ...formData, pickupLocation: value })}
              placeholder="Start typing an address..."
              required
            />

            <AutocompleteInput
              label="Drop-off location"
              value={formData.dropoffLocation}
              onChange={(value) => setFormData({ ...formData, dropoffLocation: value })}
              placeholder="Start typing an address..."
              required
            />

            {/* Vehicle and Driver - Now Optional */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-1 block">Vehicle (optional)</span>
                <select
                  value={formData.vehicle}
                  onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
                >
                  <option value="">Auto-assign / Unassigned</option>
                  <option value="1">UAA 123A - Tesla Model 3</option>
                  <option value="2">UAA 124B - Nissan Leaf</option>
                  <option value="3">UAA 125C - BYD E6</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-1 block">Driver (optional)</span>
                <select
                  value={formData.driver}
                  onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
                >
                  <option value="">Auto-assign / Unassigned</option>
                  <option value="1">John Doe</option>
                  <option value="2">Jane Smith</option>
                  <option value="3">Mike Johnson</option>
                </select>
              </label>
            </div>

            {/* Fare */}
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">Fare (UGX)</span>
              <input
                type="number"
                value={formData.fare}
                onChange={(e) => setFormData({ ...formData, fare: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
                placeholder="15000"
              />
            </label>

            {/* Notes */}
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">Notes</span>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
                placeholder="Additional notes..."
              />
            </label>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-4 border-t border-slate-200">
              <Link
                to="/trips"
                className="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 text-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark shadow-md shadow-emerald-500/20"
              >
                Create booking
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
