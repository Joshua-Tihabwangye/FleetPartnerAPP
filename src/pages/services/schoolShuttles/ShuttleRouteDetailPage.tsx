import React from "react";
import { useParams, Link } from "react-router-dom";

export default function ShuttleRouteDetailPage() {
  const { routeId } = useParams();

  const route = {
    id: routeId,
    name: "Morning Route A - Kampala Central",
    description: "Main morning pickup route covering Kololo, Kamwokya, and Nakawa areas",
    schedule: {
      departureTime: "06:30 AM",
      arrivalTime: "08:30 AM",
      days: "Monday - Friday"
    },
    vehicle: {
      plate: "UAA 300K",
      model: "Toyota Coaster Bus",
      capacity: 30
    },
    driver: {
      name: "David Mukasa",
      phone: "+256 700 444 555",
      experience: "5 years"
    },
    stops: [
      { id: 1, location: "Kololo Main Gate", time: "06:30 AM", students: 8 },
      { id: 2, location: "Kamwokya Junction", time: "06:50 AM", students: 6 },
      { id: 3, location: "Ntinda Shopping Center", time: "07:10 AM", students: 5 },
      { id: 4, location: "Nakawa Market", time: "07:30 AM", students: 4 },
      { id: 5, location: "Bugolobi Flats", time: "07:50 AM", students: 3 },
      { id: 6, location: "School - St. Mary's", time: "08:30 AM", students: 0 }
    ],
    students: 26,
    status: "active"
  };

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      <div className="w-full">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/school-shuttles/routes"
            className="text-sm text-slate-600 hover:text-slate-900 mb-2 inline-block"
          >
            ← Back to routes
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 mb-2">{route.name}</h1>
              <p className="text-sm text-slate-600">{route.description}</p>
            </div>
            <div className="flex gap-2">
              <Link
                to={`/school-shuttles/routes/${routeId}/edit`}
                className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Edit Route
              </Link>
              <Link
                to={`/school-shuttles/routes/${routeId}/track`}
                className="px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark"
              >
                Track Live
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Schedule Info */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Schedule</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-slate-500">Departure</span>
                <p className="font-medium text-slate-900">{route.schedule.departureTime}</p>
              </div>
              <div>
                <span className="text-sm text-slate-500">Arrival</span>
                <p className="font-medium text-slate-900">{route.schedule.arrivalTime}</p>
              </div>
              <div>
                <span className="text-sm text-slate-500">Days</span>
                <p className="font-medium text-slate-900">{route.schedule.days}</p>
              </div>
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Assigned Vehicle</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-slate-500">Plate Number</span>
                <p className="font-medium text-slate-900">{route.vehicle.plate}</p>
              </div>
              <div>
                <span className="text-sm text-slate-500">Model</span>
                <p className="font-medium text-slate-900">{route.vehicle.model}</p>
              </div>
              <div>
                <span className="text-sm text-slate-500">Capacity</span>
                <p className="font-medium text-slate-900">{route.students}/{route.vehicle.capacity} students</p>
              </div>
            </div>
          </div>

          {/* Driver Info */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Assigned Driver</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-slate-500">Name</span>
                <p className="font-medium text-slate-900">{route.driver.name}</p>
              </div>
              <div>
                <span className="text-sm text-slate-500">Phone</span>
                <p className="font-medium text-slate-900">{route.driver.phone}</p>
              </div>
              <div>
                <span className="text-sm text-slate-500">Experience</span>
                <p className="font-medium text-slate-900">{route.driver.experience}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Route Stops */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Route Stops ({route.stops.length})</h2>
          <div className="space-y-1">
            {route.stops.map((stop, index) => (
              <div key={stop.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-lg transition-colors">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index === 0 ? 'bg-emerald-100 text-emerald-700' :
                    index === route.stops.length - 1 ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-700'
                    } font-semibold text-sm`}>
                    {index + 1}
                  </div>
                  {index < route.stops.length - 1 && (
                    <div className="w-px h-8 bg-slate-200 ml-4" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{stop.location}</p>
                  <p className="text-sm text-slate-600">{stop.time}</p>
                </div>
                <div className="text-right">
                  {stop.students > 0 && (
                    <p className="text-sm font-medium text-slate-900">
                      {stop.students} student{stop.students !== 1 ? 's' : ''}
                    </p>
                  )}
                  {index === route.stops.length - 1 && (
                    <span className="text-xs text-blue-600 font-medium">Destination</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned Students */}
        <div className="mt-6 bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Assigned Students ({route.students})</h2>
            <Link
              to="/school-shuttles/students"
              className="text-sm text-ev-green hover:text-ev-green-dark font-medium"
            >
              View all students →
            </Link>
          </div>
          <p className="text-sm text-slate-600">
            This route serves {route.students} students across {route.stops.length - 1} pickup locations.
          </p>
        </div>
      </div>
    </div>
  );
}
