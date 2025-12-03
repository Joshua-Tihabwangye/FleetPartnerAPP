import React, { useState } from "react";
import Modal from "../../components/ui/Modal";
import { toastManager } from "../../utils/toastManager";

export default function AmbulanceDispatchBoardPage() {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  const cases = [
    { id: 1, caseId: "AMB-001", priority: "high", location: "Kampala Central", status: "pending", time: "2 min ago" },
    { id: 2, caseId: "AMB-002", priority: "medium", location: "Entebbe", status: "assigned", time: "5 min ago" },
    { id: 3, caseId: "AMB-003", priority: "low", location: "Jinja", status: "in-progress", time: "10 min ago" }
  ];

  return (
    <div className="min-h-[calc(100vh-56px)] px-4 sm:px-6 lg:px-10 py-6 bg-slate-50">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">Ambulance dispatch board</h1>
        <p className="text-sm text-slate-600">Manage emergency medical service cases and dispatches</p>
      </div>

      {/* Status Filters */}
      <div className="mb-6 flex gap-2">
        {["all", "pending", "assigned", "in-progress", "completed"].map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedStatus === status
              ? "bg-ev-green text-white"
              : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {cases.map((caseItem) => (
          <div
            key={caseItem.id}
            className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">{caseItem.caseId}</h3>
                <p className="text-sm text-slate-600">{caseItem.location}</p>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${caseItem.priority === "high"
                  ? "bg-red-100 text-red-700"
                  : caseItem.priority === "medium"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-yellow-100 text-yellow-700"
                  }`}
              >
                {caseItem.priority}
              </span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${caseItem.status === "pending"
                  ? "bg-slate-100 text-slate-700"
                  : caseItem.status === "assigned"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-emerald-100 text-emerald-700"
                  }`}
              >
                {caseItem.status}
              </span>
              <span className="text-xs text-slate-500">{caseItem.time}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedCase(caseItem);
                  setShowAssignModal(true);
                }}
                className="flex-1 px-3 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark"
              >
                Assign
              </button>
              <button
                onClick={() => {
                  setSelectedCase(caseItem);
                  setShowViewModal(true);
                }}
                className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Assign Ambulance Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => {
          setShowAssignModal(false);
          setSelectedCase(null);
        }}
        title="Assign Ambulance"
        size="md"
      >
        {selectedCase && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <p className="text-sm font-medium text-slate-900 mb-1">Case: {selectedCase.caseId}</p>
              <p className="text-sm text-slate-600">Location: {selectedCase.location}</p>
              <p className="text-sm text-slate-600">Priority: <span className="font-medium">{selectedCase.priority}</span></p>
            </div>
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">Select Ambulance</span>
              <select className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green">
                <option value="">Choose ambulance...</option>
                <option value="1">UAA 600A - Available (Kampala)</option>
                <option value="2">UAA 601A - Available (Entebbe)</option>
                <option value="3">UAA 602A - Available (Jinja)</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">Assign Crew</span>
              <select className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green">
                <option value="">Choose crew...</option>
                <option value="1">Dr. Sarah Nambi + Paramedic James</option>
                <option value="2">Dr. Peter Mukasa + Nurse Grace</option>
                <option value="3">Paramedic John + EMT Alice</option>
              </select>
            </label>
            <div className="flex gap-2 pt-4">
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedCase(null);
                }}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toastManager.show("Ambulance assigned successfully!", "success");
                  setShowAssignModal(false);
                  setSelectedCase(null);
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark"
              >
                Assign
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* View Case Detail Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedCase(null);
        }}
        title="Case Details"
        size="lg"
      >
        {selectedCase && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-slate-500">Case ID</span>
                <p className="font-medium text-slate-900">{selectedCase.caseId}</p>
              </div>
              <div>
                <span className="text-sm text-slate-500">Priority</span>
                <p className="font-medium text-slate-900">{selectedCase.priority}</p>
              </div>
              <div>
                <span className="text-sm text-slate-500">Location</span>
                <p className="font-medium text-slate-900">{selectedCase.location}</p>
              </div>
              <div>
                <span className="text-sm text-slate-500">Status</span>
                <p className="font-medium text-slate-900">{selectedCase.status}</p>
              </div>
              <div className="col-span-2">
                <span className="text-sm text-slate-500">Time Reported</span>
                <p className="font-medium text-slate-900">{selectedCase.time}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-200">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedCase(null);
                }}
                className="w-full px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
