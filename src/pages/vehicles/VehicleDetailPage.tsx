import React from "react";
import { Link, useParams } from "react-router-dom";

interface Vehicle {
  id: string | number;
  plate: string;
  model: string;
  year: string;
  color: string;
  vin: string;
  status: string;
  mileage: number;
  driver: string | null;
  type: string;
}

export default function VehicleDetailPage() {
  const { vehicleId } = useParams();
  const [vehicle, setVehicle] = React.useState<Vehicle | null>(null);

  React.useEffect(() => {
    // Load from localStorage
    const storedVehicles: Vehicle[] = JSON.parse(localStorage.getItem("vehicles") || "[]");
    const foundVehicle = storedVehicles.find(v => v.id.toString() === vehicleId);

    if (foundVehicle) {
      setVehicle(foundVehicle);
    } else {
      // Fallback for demo if not found in local storage (e.g. direct link)
      setVehicle({
        id: vehicleId || '',
        plate: "UAA 123A",
        model: "Tesla Model 3",
        year: "2023",
        color: "White",
        vin: "5YJ3E1EA1KF123456",
        status: "active",
        mileage: 12500,
        driver: "John Doe",
        type: "sedan"
      });
    }
  }, [vehicleId]);

  if (!vehicle) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      <div className="w-full">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/vehicles"
            className="text-sm text-slate-600 hover:text-slate-900 mb-2 inline-block"
          >
            ← Back to vehicles
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 mb-1">{vehicle.plate}</h1>
              <p className="text-sm text-slate-600">{vehicle.model} • Vehicle ID: {vehicleId}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                to={`/vehicles/${vehicleId}/maintenance`}
                className="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 text-center"
              >
                Maintenance
              </Link>
              <Link
                to={`/vehicles/${vehicleId}/documents`}
                className="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 text-center"
              >
                Documents
              </Link>
              <Link
                to={`/vehicles/${vehicleId}/edit`}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark text-center"
              >
                Edit vehicle
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="text-xs text-slate-500 mb-1">Status</div>
            <div className={`text-2xl font-semibold ${vehicle.status === 'active' ? 'text-emerald-600' : 'text-slate-900'}`}>
              {vehicle.status ? vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1) : 'Active'}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="text-xs text-slate-500 mb-1">Mileage</div>
            <div className="text-2xl font-semibold text-slate-900">{vehicle.mileage ? vehicle.mileage.toLocaleString() : '0'} km</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="text-xs text-slate-500 mb-1">Current driver</div>
            <div className="text-2xl font-semibold text-slate-900">{vehicle.driver || 'Unassigned'}</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="text-xs text-slate-500 mb-1">Total trips</div>
            <div className="text-2xl font-semibold text-slate-900">0</div>
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
                  <dd className="text-sm font-medium text-slate-900">{vehicle.model?.split(' ')[0] || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500 mb-1">Model</dt>
                  <dd className="text-sm font-medium text-slate-900">{vehicle.model || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500 mb-1">Year</dt>
                  <dd className="text-sm font-medium text-slate-900">{vehicle.year || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500 mb-1">Color</dt>
                  <dd className="text-sm font-medium text-slate-900">{vehicle.color || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500 mb-1">VIN</dt>
                  <dd className="text-sm font-medium text-slate-900">{vehicle.vin || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500 mb-1">Type</dt>
                  <dd className="text-sm font-medium text-slate-900">{vehicle.type || '-'}</dd>
                </div>
              </dl>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent trips</h2>
              <div className="text-sm text-slate-500 italic">No recent trips recorded</div>
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
