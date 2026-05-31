import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getFleetShuttleStudent } from "../../../services/api/fleetApi";
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
  pickupLocation: string;
  pickupTime: string;
  paymentDestination?: "school" | "fleet-owner";
};

function normalizeStudent(raw: Record<string, unknown>): Student {
  return {
    id: String(raw.id ?? ""),
    name: String(raw.name ?? "Unknown student"),
    grade: String(raw.grade ?? "N/A"),
    route: String(raw.route ?? "Unassigned"),
    parent: String(raw.parent ?? "Unknown parent"),
    parentPhone: String(raw.parentPhone ?? "N/A"),
    address: String(raw.address ?? "N/A"),
    status: String(raw.status ?? "active"),
    attendanceRate: Number(raw.attendanceRate ?? 0),
    pickupLocation: String(raw.pickupLocation ?? raw.address ?? "N/A"),
    pickupTime: String(raw.pickupTime ?? "N/A"),
    paymentDestination: raw.paymentDestination === "school" ? "school" : "fleet-owner",
  };
}

export default function ShuttleStudentDetailPage() {
  const { studentId } = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!studentId) return;
      setLoading(true);
      try {
        const response = await getFleetShuttleStudent(studentId);
        setStudent(normalizeStudent(response));
      } catch (error) {
        console.error("Failed to load student", error);
        toastManager.show("Failed to load student from backend", "error");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [studentId]);

  if (loading) {
    return <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50"><div className="text-center py-12 text-slate-600">Loading student details...</div></div>;
  }

  if (!student) {
    return (
      <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
        <div className="text-center py-12">
          <p className="text-slate-600 mb-4">Student not found</p>
          <Link to="/school-shuttles/students" className="text-ev-green hover:text-ev-green-dark">← Back to students</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      <div className="w-full">
        <div className="mb-6">
          <Link to="/school-shuttles/students" className="text-sm text-slate-600 hover:text-slate-900 mb-2 inline-block">← Back to students</Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 mb-2">{student.name}</h1>
              <p className="text-sm text-slate-600">{student.grade} · {student.route}</p>
            </div>
            <div className="flex gap-2">
              <Link to={`/school-shuttles/students/${studentId}/attendance`} className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50">View Attendance</Link>
              <Link to={`/school-shuttles/students/${studentId}/edit`} className="px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark">Edit Student</Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Student Information</h2>
            <div className="space-y-4 text-sm">
              <div><span className="text-slate-500">Status</span><p className="font-medium text-slate-900">{student.status}</p></div>
              <div><span className="text-slate-500">Address</span><p className="font-medium text-slate-900">{student.address}</p></div>
              <div><span className="text-slate-500">Payment Destination</span><p className="font-medium text-slate-900">{student.paymentDestination === "school" ? "School" : "Fleet Owner"}</p></div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Route & Pickup</h2>
            <div className="space-y-4 text-sm">
              <div><span className="text-slate-500">Pickup Location</span><p className="font-medium text-slate-900">{student.pickupLocation}</p></div>
              <div><span className="text-slate-500">Pickup Time</span><p className="font-medium text-slate-900">{student.pickupTime}</p></div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Attendance</h2>
            <p className="text-2xl font-semibold text-slate-900">{student.attendanceRate}%</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Parent/Guardian Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><span className="text-sm text-slate-500">Name</span><p className="font-medium text-slate-900">{student.parent}</p></div>
            <div><span className="text-sm text-slate-500">Phone Number</span><p className="font-medium text-slate-900">{student.parentPhone}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
