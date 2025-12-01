import React from "react";
import { Link, useParams } from "react-router-dom";

export default function VehicleDetailPage() {
  const { vehicleId } = useParams();

  return (
    <div className="min-h-[calc(100vh-56px)] px-4 sm:px-6 lg:px-10 py-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/vehicles"
            className="text-sm text-slate-600 hover:text-slate-900 mb-2 inline-block"
          >
            ← Back to vehicles
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 mb-1">UAA 123A</h1>
              <p className="text-sm text-slate-600">Tesla Model 3 • Vehicle ID: {vehicleId}</p>
            </div>
            <div className="flex gap-2">
              <Link
                to={`/vehicles/${vehicleId}/maintenance`}
                className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Maintenance
              </Link>
              <Link
                to={`/vehicles/${vehicleId}/documents`}
                className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Documents
              </Link>
              <button className="px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark">
                Edit vehicle
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="text-xs text-slate-500 mb-1">Status</div>
            <div className="text-2xl font-semibold text-emerald-600">Active</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="text-xs text-slate-500 mb-1">Mileage</div>
            <div className="text-2xl font-semibold text-slate-900">12,500 km</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="text-xs text-slate-500 mb-1">Current driver</div>
            <div className="text-2xl font-semibold text-slate-900">John Doe</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="text-xs text-slate-500 mb-1">Total trips</div>
            <div className="text-2xl font-semibold text-slate-900">342</div>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Vehicle information</h2>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-slate-500 mb-1">Make</dt>
                  <dd className="text-sm font-medium text-slate-900">Tesla</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500 mb-1">Model</dt>
                  <dd className="text-sm font-medium text-slate-900">Model 3</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500 mb-1">Year</dt>
                  <dd className="text-sm font-medium text-slate-900">2023</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500 mb-1">Color</dt>
                  <dd className="text-sm font-medium text-slate-900">White</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500 mb-1">VIN</dt>
                  <dd className="text-sm font-medium text-slate-900">5YJ3E1EA1KF123456</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500 mb-1">Registration expiry</dt>
                  <dd className="text-sm font-medium text-slate-900">2025-12-31</dd>
                </div>
              </dl>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent trips</h2>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="pb-3 border-b border-slate-100 last:border-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-slate-900">Trip #{i}</div>
                        <div className="text-xs text-slate-500">2 hours ago</div>
                      </div>
                      <div className="text-sm font-medium text-slate-900">UGX 15,000</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick actions</h2>
              <div className="space-y-2">
                <Link
                  to={`/vehicles/${vehicleId}/maintenance`}
                  className="block w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 text-center"
                >
                  Schedule maintenance
                </Link>
                <Link
                  to={`/vehicles/${vehicleId}/documents`}
                  className="block w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 text-center"
                >
                  Upload document
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
