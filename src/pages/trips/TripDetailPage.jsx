import React from "react";
import { Link, useParams } from "react-router-dom";

export default function TripDetailPage() {
  const { tripId } = useParams();

  return (
    <div className="min-h-[calc(100vh-56px)] px-4 sm:px-6 lg:px-10 py-6 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/trips"
            className="text-sm text-slate-600 hover:text-slate-900 mb-2 inline-block"
          >
            ← Back to trips
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 mb-1">Trip #{tripId}</h1>
              <p className="text-sm text-slate-600">Trip details and information</p>
            </div>
            <span className="px-3 py-1 text-sm font-medium rounded-full bg-emerald-100 text-emerald-700">
              Completed
            </span>
          </div>
        </div>

        {/* Trip Info */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Trip information</h2>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-slate-500 mb-1">Driver</dt>
              <dd className="text-sm font-medium text-slate-900">John Doe</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500 mb-1">Vehicle</dt>
              <dd className="text-sm font-medium text-slate-900">UAA 123A</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500 mb-1">Pickup location</dt>
              <dd className="text-sm font-medium text-slate-900">Kampala Central</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500 mb-1">Drop-off location</dt>
              <dd className="text-sm font-medium text-slate-900">Entebbe Airport</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500 mb-1">Distance</dt>
              <dd className="text-sm font-medium text-slate-900">42.5 km</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500 mb-1">Duration</dt>
              <dd className="text-sm font-medium text-slate-900">1h 15m</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500 mb-1">Fare</dt>
              <dd className="text-sm font-medium text-slate-900">UGX 15,000</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500 mb-1">Date & time</dt>
              <dd className="text-sm font-medium text-slate-900">2024-01-15 14:30</dd>
            </div>
          </dl>
        </div>

        {/* Route Map */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Route</h2>
          <div className="h-64 bg-slate-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">🗺️</div>
              <p className="text-sm text-slate-600">Map view integration</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
