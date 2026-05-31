import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { createFleetShuttleStudent, listFleetShuttleStudents } from "../../../services/api/fleetApi";
import { toastManager } from "../../../utils/toastManager";

type Student = {
  id: string;
  name: string;
  grade: string;
  route: string;
  parent: string;
  parentPhone: string;
  address: string;
  status: string;
  attendanceRate: number;
  paymentDestination?: "school" | "fleet-owner";
};

function normalizeStudent(raw: Record<string, unknown>, index: number): Student {
  return {
    id: String(raw.id ?? `student-${index + 1}`),
    name: String(raw.name ?? "Unknown student"),
    grade: String(raw.grade ?? "N/A"),
    route: String(raw.route ?? "Unassigned"),
    parent: String(raw.parent ?? "Unknown parent"),
    parentPhone: String(raw.parentPhone ?? "N/A"),
    address: String(raw.address ?? "N/A"),
    status: String(raw.status ?? "active"),
    attendanceRate: Number(raw.attendanceRate ?? 0),
    paymentDestination: raw.paymentDestination === "school" ? "school" : "fleet-owner",
  };
}

export default function ShuttleStudentsListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [studentForm, setStudentForm] = useState({
    name: "",
    grade: "",
    route: "",
    parent: "",
    parentPhone: "",
    address: "",
    paymentDestination: "fleet-owner" as "school" | "fleet-owner",
  });

  const loadStudents = async () => {
    setLoading(true);
    try {
      const rows = await listFleetShuttleStudents();
      setStudents(rows.map((entry, index) => normalizeStudent(entry, index)));
    } catch (error) {
      console.error("Failed to load shuttle students", error);
      toastManager.show("Failed to load students from backend", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadStudents();
  }, []);

  const filteredStudents = useMemo(
    () => students.filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.parent.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery, students],
  );

  const handleAddStudent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createFleetShuttleStudent({
        name: studentForm.name,
        grade: studentForm.grade,
        route: studentForm.route,
        parent: studentForm.parent,
        parentPhone: studentForm.parentPhone,
        address: studentForm.address,
        paymentDestination: studentForm.paymentDestination,
        status: "active",
        attendanceRate: 100,
      });
      toastManager.show("Student added successfully", "success");
      setShowAddStudentModal(false);
      setStudentForm({ name: "", grade: "", route: "", parent: "", parentPhone: "", address: "", paymentDestination: "fleet-owner" });
      await loadStudents();
    } catch (error) {
      console.error("Failed to create student", error);
      toastManager.show("Failed to create student", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link to="/school-shuttles" className="text-sm text-slate-600 hover:text-slate-900 mb-2 inline-block">← Back to Dashboard</Link>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Shuttle Students</h1>
          <p className="text-sm text-slate-600">Manage student roster and route assignments</p>
        </div>
        <button onClick={() => setShowAddStudentModal(true)} className="px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark">+ Add student</button>
      </div>

      <div className="mb-6">
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by student or parent name..." className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm" />
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-600">Loading students...</div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Route</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Parent Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Attendance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-700">{student.name.split(" ").map((n) => n[0]).join("")}</div>
                        <div className="ml-4"><div className="text-sm font-medium text-slate-900">{student.name}</div><div className="text-xs text-slate-500">{student.address}</div></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{student.grade}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="text-sm text-ev-green font-medium">{student.route}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-slate-900">{student.parent}</div><div className="text-xs text-slate-500">{student.parentPhone}</div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="text-sm font-medium text-slate-900">{student.attendanceRate}%</span></td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">{student.status}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><Link to={`/school-shuttles/students/${student.id}`} className="text-ev-green hover:text-ev-green-dark mr-3">View</Link></td>
                  </tr>
                ))}
                {filteredStudents.length === 0 && (
                  <tr><td colSpan={7} className="px-6 py-8 text-center text-sm text-slate-500">No students found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAddStudentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-2xl w-full">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Add New Student</h2>
            <form onSubmit={handleAddStudent} className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <label className="block"><span className="text-sm font-medium text-slate-700 mb-1 block">Student Name *</span><input type="text" value={studentForm.name} onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" required /></label>
                <label className="block"><span className="text-sm font-medium text-slate-700 mb-1 block">Grade *</span><input type="text" value={studentForm.grade} onChange={(e) => setStudentForm({ ...studentForm, grade: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" required /></label>
              </div>
              <label className="block"><span className="text-sm font-medium text-slate-700 mb-1 block">Route *</span><input type="text" value={studentForm.route} onChange={(e) => setStudentForm({ ...studentForm, route: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" required /></label>
              <label className="block"><span className="text-sm font-medium text-slate-700 mb-1 block">Address *</span><input type="text" value={studentForm.address} onChange={(e) => setStudentForm({ ...studentForm, address: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" required /></label>
              <div className="grid grid-cols-2 gap-4">
                <label className="block"><span className="text-sm font-medium text-slate-700 mb-1 block">Parent Name *</span><input type="text" value={studentForm.parent} onChange={(e) => setStudentForm({ ...studentForm, parent: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" required /></label>
                <label className="block"><span className="text-sm font-medium text-slate-700 mb-1 block">Parent Phone *</span><input type="tel" value={studentForm.parentPhone} onChange={(e) => setStudentForm({ ...studentForm, parentPhone: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" required /></label>
              </div>
              <label className="block"><span className="text-sm font-medium text-slate-700 mb-1 block">Payment Destination *</span><select value={studentForm.paymentDestination} onChange={(e) => setStudentForm({ ...studentForm, paymentDestination: e.target.value as "school" | "fleet-owner" })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" required><option value="fleet-owner">Fleet Owner</option><option value="school">School</option></select></label>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAddStudentModal(false)} className="flex-1 px-4 py-2 rounded-lg border border-slate-300 text-sm">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 px-4 py-2 rounded-lg bg-ev-green text-white text-sm disabled:opacity-60">{saving ? "Saving..." : "Add Student"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
