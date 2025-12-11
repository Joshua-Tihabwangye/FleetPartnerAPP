import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Modal from "../../components/ui/Modal";
import { toastManager } from "../../utils/toastManager";

export default function AmbulanceCaseDetailPage() {
  const { caseId } = useParams();
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // Mock data - in production fetch by ID
  const caseData = {
    id: caseId,
    patient: "Michael Omondi",
    location: "Jinja Road, near Lugogo",
    status: "in-progress",
    priority: "critical",
    reportedTime: "10:30 AM",
    ambulance: "AMB-003",
    crew: "Team Alpha",
    hospital: "Mulago National Referral Hospital",
    notes: "Patient complaining of severe chest pain. Conscious but in distress."
  };

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      <div className="w-full">
        <div className="mb-6">
          <Link
            to="/ambulance/cases"
            className="text-sm text-slate-600 hover:text-slate-900 mb-2 inline-block"
          >
            ← Back to cases
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 mb-1">Case #{caseId}</h1>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium uppercase">
                  {caseData.priority}
                </span>
                <span className="text-sm text-slate-600">• {caseData.reportedTime}</span>
              </div>
            </div>
            <button
              onClick={() => setShowUpdateModal(true)}
              className="px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark"
            >
              Update Status
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Case Information</h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                <div>
                  <dt className="text-sm text-slate-500 mb-1">Patient Name</dt>
                  <dd className="text-sm font-medium text-slate-900">{caseData.patient}</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500 mb-1">Location</dt>
                  <dd className="text-sm font-medium text-slate-900">{caseData.location}</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500 mb-1">Assigned Ambulance</dt>
                  <dd className="text-sm font-medium text-slate-900">{caseData.ambulance}</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500 mb-1">Crew Team</dt>
                  <dd className="text-sm font-medium text-slate-900">{caseData.crew}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm text-slate-500 mb-1">Destination Hospital</dt>
                  <dd className="text-sm font-medium text-slate-900">{caseData.hospital}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm text-slate-500 mb-1">Notes</dt>
                  <dd className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {caseData.notes}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Timeline Placeholder */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Case Timeline</h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-ev-green mt-2"></div>
                    <div className="w-0.5 h-full bg-slate-200 my-1"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Ambulance Dispatched</p>
                    <p className="text-xs text-slate-500">10:35 AM</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-slate-300 mt-2"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Case Reported</p>
                    <p className="text-xs text-slate-500">10:30 AM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-4 h-64 flex items-center justify-center bg-slate-100">
              <p className="text-slate-500 text-sm">Live Map View</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-sm font-semibold text-slate-900 mb-3">Crew Contact</h2>
              <button className="w-full py-2 px-4 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2">
                <span>📞 Call Crew</span>
              </button>
            </div>
          </div>
        </div>

        <Modal
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          title="Update Case Status"
          size="sm"
        >
          <div className="space-y-3">
            <button
              onClick={() => {
                toastManager.show("Status updated to: Arrived at Scene", "success");
                setShowUpdateModal(false);
              }}
              className="w-full text-left px-4 py-3 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-ev-green transition-colors"
            >
              <p className="font-medium text-slate-900">Arrived at Scene</p>
            </button>
            <button
              onClick={() => {
                toastManager.show("Status updated to: En Route to Hospital", "success");
                setShowUpdateModal(false);
              }}
              className="w-full text-left px-4 py-3 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-ev-green transition-colors"
            >
              <p className="font-medium text-slate-900">En Route to Hospital</p>
            </button>
            <button
              onClick={() => {
                toastManager.show("Case marked as Completed", "success");
                setShowUpdateModal(false);
              }}
              className="w-full text-left px-4 py-3 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-ev-green transition-colors"
            >
              <p className="font-medium text-slate-900">Case Completed</p>
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
