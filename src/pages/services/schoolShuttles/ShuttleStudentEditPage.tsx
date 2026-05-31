import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getFleetShuttleStudent, patchFleetShuttleStudent } from "../../../services/api/fleetApi";
import { toastManager } from "../../../utils/toastManager";

type StudentForm = {
  id: string;
  name: string;
  grade: string;
  route: string;
  parent: string;
  parentPhone: string;
  address: string;
  status: string;
  attendanceRate: number;
  paymentDestination: "school" | "fleet-owner";
};

function normalizeStudent(raw: Record<string, unknown>, studentId: string): StudentForm {
  return {
    id: String(raw.id ?? studentId),
    name: String(raw.name ?? ""),
    grade: String(raw.grade ?? ""),
    route: String(raw.route ?? ""),
    parent: String(raw.parent ?? ""),
    parentPhone: String(raw.parentPhone ?? ""),
    address: String(raw.address ?? ""),
    status: String(raw.status ?? "active"),
    attendanceRate: Number(raw.attendanceRate ?? 0),
    paymentDestination: raw.paymentDestination === "school" ? "school" : "fleet-owner",
  };
}

export default function ShuttleStudentEditPage() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<StudentForm>({
    id: studentId || "",
    name: "",
    grade: "",
    route: "",
    parent: "",
    parentPhone: "",
    address: "",
    status: "active",
    attendanceRate: 0,
    paymentDestination: "fleet-owner",
  });

  useEffect(() => {
    const load = async () => {
      if (!studentId) return;
      setLoading(true);
      try {
        const response = await getFleetShuttleStudent(studentId);
        setFormData(normalizeStudent(response, studentId));
      } catch (error) {
        console.error("Failed to load student for edit", error);
        toastManager.show("Failed to load student", "error");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [studentId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!studentId) return;
    setSaving(true);
    try {
      await patchFleetShuttleStudent(studentId, {
        name: formData.name,
        grade: formData.grade,
        route: formData.route,
        parent: formData.parent,
        parentPhone: formData.parentPhone,
        address: formData.address,
        status: formData.status,
        attendanceRate: formData.attendanceRate,
        paymentDestination: formData.paymentDestination,
      });
      toastManager.show("Student updated successfully", "success");
      navigate(`/school-shuttles/students/${studentId}`);
    } catch (error) {
      console.error("Failed to update student", error);
      toastManager.show("Failed to update student", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50"><div className="text-center py-12 text-slate-600">Loading student data...</div></div>;
  }

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50 dark:bg-slate-900">
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to={`/school-shuttles/students/${studentId}`} className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 mb-2 inline-block">← Back to student details</Link>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Edit Student</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">Update student information</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block"><span className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Student Name *</span><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" required /></label>
              <label className="block"><span className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Grade *</span><input type="text" value={formData.grade} onChange={(e) => setFormData({ ...formData, grade: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" required /></label>
              <label className="block"><span className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Route *</span><input type="text" value={formData.route} onChange={(e) => setFormData({ ...formData, route: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" required /></label>
              <label className="block"><span className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Status *</span><select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"><option value="active">Active</option><option value="inactive">Inactive</option><option value="pending">Pending</option></select></label>
              <label className="block md:col-span-2"><span className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Address *</span><input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" required /></label>
              <label className="block"><span className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Parent Name *</span><input type="text" value={formData.parent} onChange={(e) => setFormData({ ...formData, parent: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" required /></label>
              <label className="block"><span className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Parent Phone *</span><input type="tel" value={formData.parentPhone} onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" required /></label>
              <label className="block"><span className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Attendance Rate</span><input type="number" value={formData.attendanceRate} min={0} max={100} onChange={(e) => setFormData({ ...formData, attendanceRate: Number(e.target.value) })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" /></label>
              <label className="block"><span className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Payment Destination</span><select value={formData.paymentDestination} onChange={(e) => setFormData({ ...formData, paymentDestination: e.target.value as "school" | "fleet-owner" })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"><option value="fleet-owner">Fleet Owner</option><option value="school">School</option></select></label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
              <Link to={`/school-shuttles/students/${studentId}`} className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50">Cancel</Link>
              <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark disabled:opacity-60">{saving ? "Saving..." : "Save Changes"}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
