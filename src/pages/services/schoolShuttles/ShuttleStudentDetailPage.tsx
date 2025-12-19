import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { toastManager } from "../../../utils/toastManager";

interface Student {
  id: number;
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
}

export default function ShuttleStudentDetailPage() {
  const { studentId } = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load student data from localStorage
    const storedStudents = JSON.parse(localStorage.getItem("shuttleStudents") || "[]");
    const foundStudent = storedStudents.find((s: Student) => s.id === Number(studentId));
    
    if (foundStudent) {
      // Add additional details
      const studentWithDetails: Student = {
        ...foundStudent,
        pickupLocation: foundStudent.address || "Kololo Main Gate",
        pickupTime: "06:30 AM"
      };
      setStudent(studentWithDetails);
    } else {
      // Mock data if not found
      setStudent({
        id: Number(studentId),
        name: "Emily Nakato",
        grade: "Grade 5",
        route: "Morning Route A",
        parent: "Mary Nakato",
        parentPhone: "+256 700 111 222",
        address: "Kololo, Kampala",
        status: "active",
        attendanceRate: 95,
        pickupLocation: "Kololo Main Gate",
        pickupTime: "06:30 AM"
      });
    }
    setLoading(false);
  }, [studentId]);

  if (loading) {
    return (
      <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
        <div className="text-center py-12">
          <p className="text-slate-600">Loading student details...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
        <div className="text-center py-12">
          <p className="text-slate-600 mb-4">Student not found</p>
          <Link
            to="/school-shuttles/students"
            className="text-ev-green hover:text-ev-green-dark"
          >
            ← Back to students
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      <div className="w-full">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/school-shuttles/students"
            className="text-sm text-slate-600 hover:text-slate-900 mb-2 inline-block"
          >
            ← Back to students
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 mb-2">{student.name}</h1>
              <p className="text-sm text-slate-600">{student.grade} · {student.route}</p>
            </div>
            <div className="flex gap-2">
              <Link
                to={`/school-shuttles/students/${studentId}/attendance`}
                className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                View Attendance
              </Link>
              <Link
                to={`/school-shuttles/students/${studentId}/edit`}
                className="px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark"
              >
                Edit Student
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Student Info */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Student Information</h2>
            <div className="space-y-4">
              <div>
                <span className="text-sm text-slate-500">Name</span>
                <p className="font-medium text-slate-900">{student.name}</p>
              </div>
              <div>
                <span className="text-sm text-slate-500">Grade</span>
                <p className="font-medium text-slate-900">{student.grade}</p>
              </div>
              <div>
                <span className="text-sm text-slate-500">Status</span>
                <p>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">
                    {student.status}
                  </span>
                </p>
              </div>
              <div>
                <span className="text-sm text-slate-500">Payment Destination</span>
                <p>
                  {student.paymentDestination === "school" ? (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                      💰 Paid to School
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">
                      💵 Paid to Fleet Owner
                    </span>
                  )}
                </p>
              </div>
              <div>
                <span className="text-sm text-slate-500">Home Address</span>
                <p className="font-medium text-slate-900">{student.address}</p>
              </div>
            </div>
          </div>

          {/* Route & Pickup Info */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Route & Pickup</h2>
            <div className="space-y-4">
              <div>
                <span className="text-sm text-slate-500">Assigned Route</span>
                <p className="font-medium text-slate-900">
                  <Link
                    to="/school-shuttles/routes/1"
                    className="text-ev-green hover:text-ev-green-dark"
                  >
                    {student.route}
                  </Link>
                </p>
              </div>
              <div>
                <span className="text-sm text-slate-500">Pickup Location</span>
                <p className="font-medium text-slate-900">{student.pickupLocation}</p>
              </div>
              <div>
                <span className="text-sm text-slate-500">Pickup Time</span>
                <p className="font-medium text-slate-900">{student.pickupTime}</p>
              </div>
            </div>
          </div>

          {/* Attendance Summary */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Attendance</h2>
            <div className="space-y-4">
              <div>
                <span className="text-sm text-slate-500">Attendance Rate</span>
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-2xl font-semibold text-slate-900">{student.attendanceRate}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-emerald-500 rounded-full h-2"
                      style={{ width: `${student.attendanceRate}%` }}
                    />
                  </div>
                </div>
              </div>
              <div>
                <span className="text-sm text-slate-500">This Month</span>
                <p className="font-medium text-slate-900">22/23 days</p>
              </div>
              <div>
                <Link
                  to={`/school-shuttles/students/${studentId}/attendance`}
                  className="text-sm text-ev-green hover:text-ev-green-dark font-medium"
                >
                  View full attendance →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Parent/Guardian Contact */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Parent/Guardian Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <span className="text-sm text-slate-500">Name</span>
              <p className="font-medium text-slate-900">{student.parent}</p>
            </div>
            <div>
              <span className="text-sm text-slate-500">Phone Number</span>
              <p className="font-medium text-slate-900">{student.parentPhone}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200 flex gap-2">
            <button
              onClick={() => toastManager.show("Calling " + student.parentPhone, "info")}
              className="px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark"
            >
              📞 Call Parent
            </button>
            <button
              onClick={() => toastManager.show("Sending message to " + student.parentPhone, "info")}
              className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              💬 Send Message
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {[
              { date: "2024-01-15", type: "Pickup", time: "06:32 AM", status: "On time" },
              { date: "2024-01-14", type: "Pickup", time: "06:35 AM", status: "Late" },
              { date: "2024-01-13", type: "Pickup", time: "06:30 AM", status: "On time" },
              { date: "2024-01-12", type: "Absent", time: "-", status: "Not present" },
              { date: "2024-01-11", type: "Pickup", time: "06:28 AM", status: "Early" }
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{activity.type}</p>
                  <p className="text-xs text-slate-600">{activity.date} {activity.time !== "-" && `· ${activity.time}`}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    activity.status === "On time" || activity.status === "Early"
                      ? "bg-emerald-100 text-emerald-700"
                      : activity.status === "Late"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
