import React from "react";
import { Link, useParams } from "react-router-dom";
import { toastManager } from "../../utils/toastManager";
import {
  getCachedFleetDrivers,
  isFleetBackendEnabled,
  patchFleetDriver,
  refreshFleetWorkspaceState,
} from "../../services/api/fleetApi";

interface DriverProfile {
  id: string | number;
  backendId?: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  trips: number;
  rating: number;
  earnings: string;
  license: string;
  expiry: string;
  address: string;
}

export default function DriverProfilePage() {
  const { driverId } = useParams();
  const [driver, setDriver] = React.useState<DriverProfile | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editForm, setEditForm] = React.useState<Partial<DriverProfile>>({});
  const backendMode = isFleetBackendEnabled();

  React.useEffect(() => {
    const load = async () => {
      setLoadError(null);
      setLoading(true);
      if (!backendMode) {
        setDriver(null);
        setEditForm({});
        setLoadError("Backend session required. Sign in to access driver profiles.");
        setLoading(false);
        return;
      }

      try {
        await refreshFleetWorkspaceState();
      } catch (error) {
        console.warn("Fleet backend driver profile sync failed.", error);
        setLoadError("Failed to refresh driver profile from backend.");
      }

      const storedDrivers = getCachedFleetDrivers() as DriverProfile[];
      const foundDriver = storedDrivers.find(
        (d: DriverProfile) =>
          d.id.toString() === driverId || (d.backendId && d.backendId.toString() === driverId),
      );

      if (foundDriver) {
        setDriver(foundDriver);
        setEditForm(foundDriver);
        setLoading(false);
        return;
      }

      setDriver(null);
      setEditForm({});
      setLoadError("Driver record was not found in backend-synced fleet data.");
      setLoading(false);
    };

    void load();
  }, [backendMode, driverId]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({ ...driver });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({ ...driver });
  };

  const handleSave = async () => {
    const currentDriver = driver;
    if (!currentDriver) return;

    if (!backendMode) {
      toastManager.show("Backend session required to update driver profile.", "error");
      return;
    }

    if (!currentDriver.backendId) {
      toastManager.show("Unable to resolve backend driver record for this page.", "error");
      return;
    }

    try {
      await patchFleetDriver(currentDriver.backendId, {
        fullName: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        city: editForm.address,
        status: editForm.status as "invited" | "active" | "suspended" | undefined,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Fleet backend driver update failed.";
      toastManager.show(message, "error");
      return;
    }
    setDriver(editForm as DriverProfile);
    setIsEditing(false);
    toastManager.show("Driver profile updated successfully!", "success");
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!driver) return <div className="p-6 text-sm text-red-600">{loadError || "Driver not found."}</div>;

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      <div className="w-full">
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
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark"
                >
                  Edit profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark"
                  >
                    Save changes
                  </button>
                </>
              )}
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
              {!isEditing ? (
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
              ) : (
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700 mb-1 block">Email</span>
                    <input
                      type="email"
                      value={editForm.email || ''}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700 mb-1 block">Phone</span>
                    <input
                      type="tel"
                      value={editForm.phone || ''}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700 mb-1 block">Address</span>
                    <input
                      type="text"
                      value={editForm.address || ''}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                    />
                  </label>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">License information</h2>
              {!isEditing ? (
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
              ) : (
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700 mb-1 block">License number</span>
                    <input
                      type="text"
                      value={editForm.license || ''}
                      onChange={(e) => setEditForm({ ...editForm, license: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700 mb-1 block">Expiry date</span>
                    <input
                      type="date"
                      value={editForm.expiry || ''}
                      onChange={(e) => setEditForm({ ...editForm, expiry: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                    />
                  </label>
                </div>
              )}
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
