import React from "react";
import { Link, useParams } from "react-router-dom";

export default function DriverProfilePage() {
  const { driverId } = useParams();
  const [driver, setDriver] = React.useState(null);

  React.useEffect(() => {
    // Load from localStorage
    const storedDrivers = JSON.parse(localStorage.getItem("drivers") || "[]");
    const foundDriver = storedDrivers.find(d => d.id.toString() === driverId);

    if (foundDriver) {
      setDriver(foundDriver);
    } else {
      // Fallback for demo
      setDriver({
        id: driverId,
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+256 700 000 001",
        status: "active",
        trips: 142,
        rating: 4.8,
        earnings: "UGX 2.4M",
        license: "DL-123456",
        expiry: "2025-12-31",
        address: "Kampala, Uganda"
      });
    }
  }, [driverId]);

  if (!driver) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-[calc(100vh-56px)] px-4 sm:px-6 lg:px-10 py-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/drivers"
            className="text-sm text-slate-600 hover:text-slate-900 mb-2 inline-block"
          >
            ← Back to drivers
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center text-xl font-semibold text-emerald-700">
                {driver.name ? driver.name.split(' ').map(n => n[0]).join('') : 'DR'}
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-slate-900 mb-1">{driver.name}</h1>
                <p className="text-sm text-slate-600">Driver ID: {driverId}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                to={`/drivers/${driverId}/ratings`}
                className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                View ratings
              </Link>
              <button className="px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark">
                Edit profile
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="text-xs text-slate-500 mb-1">Total trips</div>
            <div className="text-2xl font-semibold text-slate-900">{driver.trips || 0}</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="text-xs text-slate-500 mb-1">Rating</div>
            <div className="text-2xl font-semibold text-slate-900">{driver.rating || 'N/A'} ⭐</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="text-xs text-slate-500 mb-1">Status</div>
            <div className={`text-2xl font-semibold ${driver.status === 'active' ? 'text-emerald-600' : 'text-slate-900'}`}>
              {driver.status ? driver.status.charAt(0).toUpperCase() + driver.status.slice(1) : 'Active'}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="text-xs text-slate-500 mb-1">Earnings</div>
            <div className="text-2xl font-semibold text-slate-900">{driver.earnings || 'UGX 0'}</div>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Contact information</h2>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm text-slate-500">Email</dt>
                  <dd className="text-sm font-medium text-slate-900">{driver.email || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500">Phone</dt>
                  <dd className="text-sm font-medium text-slate-900">{driver.phone || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500">Address</dt>
                  <dd className="text-sm font-medium text-slate-900">{driver.address || '-'}</dd>
                </div>
              </dl>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">License information</h2>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm text-slate-500">License number</dt>
                  <dd className="text-sm font-medium text-slate-900">{driver.license || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500">Expiry date</dt>
                  <dd className="text-sm font-medium text-slate-900">{driver.expiry || '-'}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent trips</h2>
              <div className="text-sm text-slate-500 italic">No recent trips recorded</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
