import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Modal from "../../components/ui/Modal";
import { toastManager } from "../../utils/toastManager";
import { getCachedFleetVehicles, isFleetBackendEnabled, refreshFleetWorkspaceState } from "../../services/api/fleetApi";

interface VehicleDocument {
  id: string;
  vehicleId: string;
  name: string;
  type: string;
  date: string;
  uploadDate: string;
}

export default function VehicleDocumentsPage() {
  const { vehicleId } = useParams();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [documents, setDocuments] = useState<VehicleDocument[]>([]);
  const [newDoc, setNewDoc] = useState({ name: "", type: "insurance", date: "" });

  useEffect(() => {
    const load = async () => {
      if (isFleetBackendEnabled()) {
        try {
          await refreshFleetWorkspaceState();
        } catch (error) {
          console.warn("Fleet backend vehicle documents sync failed.", error);
        }

        const vehicles = getCachedFleetVehicles() as any[];
        const current = vehicles.find(
          (item) => String(item.id) === String(vehicleId) || String(item.backendId) === String(vehicleId),
        );
        if (!current) {
          setDocuments([]);
          return;
        }

        const normalizedDocs: VehicleDocument[] = [];
        if (current.compliance?.insurance) {
          normalizedDocs.push({
            id: `insurance-${current.id}`,
            vehicleId: String(vehicleId || ""),
            name: "Insurance Certificate",
            type: "insurance",
            date: current.compliance.insurance.expiry || "",
            uploadDate: "",
          });
        }
        if (current.compliance?.inspection) {
          normalizedDocs.push({
            id: `inspection-${current.id}`,
            vehicleId: String(vehicleId || ""),
            name: "Inspection Record",
            type: "inspection",
            date: current.compliance.inspection.expiry || "",
            uploadDate: "",
          });
        }
        setDocuments(normalizedDocs);
        return;
      }

      const allDocs: VehicleDocument[] = JSON.parse(localStorage.getItem("vehicle_documents") || "[]");
      const vehicleDocs = allDocs.filter(d => d.vehicleId === vehicleId);
      setDocuments(vehicleDocs);
    };

    void load();
  }, [vehicleId]);

  const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isFleetBackendEnabled()) {
      toastManager.show("Vehicle document upload endpoint is pending integration.", "info");
      setShowUploadModal(false);
      return;
    }

    if (!vehicleId) {
      toastManager.show("Error: No vehicle ID found", "error");
      return;
    }

    const doc: VehicleDocument = {
      id: Date.now().toString(),
      vehicleId,
      ...newDoc,
      uploadDate: new Date().toISOString().split('T')[0]
    };

    const allDocs: VehicleDocument[] = JSON.parse(localStorage.getItem("vehicle_documents") || "[]");
    const updatedDocs = [...allDocs, doc];
    localStorage.setItem("vehicle_documents", JSON.stringify(updatedDocs));

    setDocuments([...documents, doc]);
    setShowUploadModal(false);
    setNewDoc({ name: "", type: "insurance", date: "" });
    toastManager.show("Document uploaded successfully!", "success");
  };

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      <div className="w-full">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link
              to={`/vehicles/${vehicleId}`}
              className="text-sm text-slate-600 hover:text-slate-900 mb-2 inline-block"
            >
              ← Back to vehicle
            </Link>
            <h1 className="text-2xl font-semibold text-slate-900">Vehicle Documents</h1>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark"
          >
            {isFleetBackendEnabled() ? "Upload (API Pending)" : "+ Upload Document"}
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {documents.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No documents found. Upload a document to get started.
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Expiry Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {documents.map((doc) => (
                  <tr key={doc.id}>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{doc.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 capitalize">{doc.type}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{doc.date}</td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => toastManager.show(`Downloading ${doc.name}...`, "success")}
                        className="text-ev-green hover:text-ev-green-dark font-medium"
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <Modal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          title="Upload Document"
          size="md"
        >
          <form onSubmit={handleUpload} className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">Document Name *</span>
              <input
                type="text"
                value={newDoc.name}
                onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">Type *</span>
              <select
                value={newDoc.type}
                onChange={(e) => setNewDoc({ ...newDoc, type: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
              >
                <option value="insurance">Insurance</option>
                <option value="registration">Registration</option>
                <option value="inspection">Inspection Report</option>
                <option value="permit">Permit</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">Expiry Date</span>
              <input
                type="date"
                value={newDoc.date}
                onChange={(e) => setNewDoc({ ...newDoc, date: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">Upload File *</span>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-ev-green file:text-white hover:file:bg-emerald-600"
                required
              />
              <p className="text-xs text-slate-500 mt-1">Accepted: PDF, JPG, PNG, DOC, DOCX</p>
            </label>
            <div className="flex gap-2 pt-4">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark"
              >
                Upload
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
