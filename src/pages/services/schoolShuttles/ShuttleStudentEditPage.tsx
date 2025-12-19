import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
  paymentDestination?: "school" | "fleet-owner";
}

export default function ShuttleStudentEditPage() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Student>({
    id: Number(studentId),
    name: "",
    grade: "",
    route: "",
    parent: "",
    parentPhone: "",
    address: "",
    status: "active",
    attendanceRate: 100,
    paymentDestination: "fleet-owner"
  });

  useEffect(() => {
    // Load student data from localStorage
    const storedStudents = JSON.parse(localStorage.getItem("shuttleStudents") || "[]");
    const foundStudent = storedStudents.find((s: Student) => s.id === Number(studentId));
    
    if (foundStudent) {
      setFormData(foundStudent);
    } else {
      // Mock data if not found
      setFormData({
        id: Number(studentId),
        name: "Emily Nakato",
        grade: "Grade 5",
        route: "Morning Route A",
        parent: "Mary Nakato",
        parentPhone: "+256 700 111 222",
        address: "Kololo, Kampala",
        status: "active",
        attendanceRate: 95,
        paymentDestination: "fleet-owner"
      });
    }
    setLoading(false);
  }, [studentId]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Update student in localStorage
    const storedStudents = JSON.parse(localStorage.getItem("shuttleStudents") || "[]");
    const updatedStudents = storedStudents.map((s: Student) =>
      s.id === Number(studentId) ? formData : s
    );
    
    // If student doesn't exist, add it
    if (!storedStudents.find((s: Student) => s.id === Number(studentId))) {
      updatedStudents.push(formData);
    }
    
    localStorage.setItem("shuttleStudents", JSON.stringify(updatedStudents));
    toastManager.show("Student updated successfully!", "success");
    navigate(`/school-shuttles/students/${studentId}`);
  };

  if (loading) {
    return (
      <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50 dark:bg-slate-900">
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-400">Loading student data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50 dark:bg-slate-900">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to={`/school-shuttles/students/${studentId}`}
            className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 mb-2 inline-block"
          >
            ← Back to student details
          </Link>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Edit Student</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">Update student information</p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Student Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Student Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Student Name *</span>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Grade *</span>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                    required
                  >
                    <option value="">Select grade...</option>
                    <option value="Grade 1">Grade 1</option>
                    <option value="Grade 2">Grade 2</option>
                    <option value="Grade 3">Grade 3</option>
                    <option value="Grade 4">Grade 4</option>
                    <option value="Grade 5">Grade 5</option>
                    <option value="Grade 6">Grade 6</option>
                    <option value="Grade 7">Grade 7</option>
                  </select>
                </label>
              </div>
              <label className="block">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Assigned Route *</span>
                <select
                  value={formData.route}
                  onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                  required
                >
                  <option value="">Select route...</option>
                  <option value="Morning Route A">Morning Route A</option>
                  <option value="Morning Route B">Morning Route B</option>
                  <option value="Afternoon Route A">Afternoon Route A</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Home Address *</span>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Status *</span>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Payment Destination *</span>
                <select
                  value={formData.paymentDestination || "fleet-owner"}
                  onChange={(e) => setFormData({ ...formData, paymentDestination: e.target.value as "school" | "fleet-owner" })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                  required
                >
                  <option value="fleet-owner">Fleet Owner (Direct Payment)</option>
                  <option value="school">School (Payment via School)</option>
                </select>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Select where parents should make payments</p>
              </label>
            </div>

            {/* Parent/Guardian Information */}
            <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Parent/Guardian Contact</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Parent/Guardian Name *</span>
                  <input
                    type="text"
                    value={formData.parent}
                    onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Parent Phone *</span>
                  <input
                    type="tel"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                    placeholder="+256 700 000 000"
                    required
                  />
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
              <Link
                to={`/school-shuttles/students/${studentId}`}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-600"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

