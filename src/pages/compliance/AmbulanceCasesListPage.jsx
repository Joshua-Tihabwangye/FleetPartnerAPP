import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function AmbulanceCasesListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const cases = [
    {
      id: 1,
      caseId: "AMB-2024-001",
      patient: "John Okello",
      age: 45,
      condition: "Cardiac Emergency",
      priority: "critical",
      location: "Kampala Central Hospital",
      ambulance: "UAA 600A",
      crew: "Dr. Sarah Nambi, Paramedic James",
      dispatchTime: "2024-01-15 14:30",
      status: "in-transit"
    },
    {
      id: 2,
      caseId: "AMB-2024-002",
      patient: "Mary Nantongo",
      age: 32,
      condition: "Pregnancy Emergency",
      priority: "high",
      location: "Mulago neighborhood",
      ambulance: "UAA 601A",
      crew: "Dr. Peter Mukasa, Nurse Grace",
      dispatchTime: "2024-01-15 13:15",
      status: "on-scene"
    },
    {
      id: 3,
      caseId: "AMB-2024-003",
      patient: "David Ssemakula",
      age: 28,
      condition: "Traffic Accident",
      priority: "medium",
      location: "Entebbe Road KM 15",
      ambulance: "UAA 602A",
      crew: "Paramedic John, EMT Alice",
      dispatchTime: "2024-01-15 12:00",
      status: "completed"
    }
  ];

  const filteredCases = cases.filter(c => {
    const matchesSearch = c.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.condition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || c.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-700";
      case "high": return "bg-orange-100 text-orange-700";
      case "medium": return "bg-yellow-100 text-yellow-700";
      case "low": return "bg-blue-100 text-blue-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "dispatched": return "bg-blue-100 text-blue-700";
      case "in-transit": return "bg-yellow-100 text-yellow-700";
      case "on-scene": return "bg-orange-100 text-orange-700";
      case "completed": return "bg-emerald-100 text-emerald-700";
      case "cancelled": return "bg-slate-100 text-slate-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] px-4 sm:px-6 lg:px-10 py-6 bg-slate-50">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Ambulance Cases</h1>
          <p className="text-sm text-slate-600">Emergency medical service case management</p>
        </div>
        <Link
          to="/ambulance/dispatch"
          className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700"
        >
          🚨 Dispatch Board
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-600 mb-1">Active Cases</p>
          <p className="text-2xl font-semibold text-blue-600">
            {cases.filter(c => c.status !== 'completed' && c.status !== 'cancelled').length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-red-200 p-4">
          <p className="text-sm text-slate-600 mb-1">Critical</p>
          <p className="text-2xl font-semibold text-red-600">
            {cases.filter(c => c.priority === 'critical').length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-600 mb-1">Completed Today</p>
          <p className="text-2xl font-semibold text-emerald-600">
            {cases.filter(c => c.status === 'completed').length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-600 mb-1">Response Time (Avg)</p>
          <p className="text-2xl font-semibold text-slate-900">8 min</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by case ID, patient, condition..."
            className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "dispatched", "in-transit", "on-scene", "completed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === status
                  ? "bg-ev-green text-white"
                  : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Cases List */}
      <div className="space-y-4">
        {filteredCases.map((caseItem) => (
          <Link
            key={caseItem.id}
            to={`/ambulance/cases/${caseItem.id}`}
            className="block bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-slate-900">{caseItem.caseId}</h3>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getPriorityColor(caseItem.priority)}`}>
                    {caseItem.priority.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(caseItem.status)}`}>
                    {caseItem.status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-slate-600">Dispatched: {caseItem.dispatchTime}</p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-xs font-medium text-slate-500 uppercase mb-2">Patient</h4>
                <p className="font-medium text-slate-900">{caseItem.patient}</p>
                <p className="text-sm text-slate-600">Age: {caseItem.age}</p>
                <p className="text-sm text-slate-600">{caseItem.condition}</p>
              </div>
              <div>
                <h4 className="text-xs font-medium text-slate-500 uppercase mb-2">Location</h4>
                <p className="font-medium text-slate-900">📍 {caseItem.location}</p>
              </div>
              <div>
                <h4 className="text-xs font-medium text-slate-500 uppercase mb-2">Response Team</h4>
                <p className="font-medium text-slate-900">🚑 {caseItem.ambulance}</p>
                <p className="text-sm text-slate-600">{caseItem.crew}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
