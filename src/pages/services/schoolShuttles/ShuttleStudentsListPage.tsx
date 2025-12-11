import React, { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../../../components/ui/Modal";
import { toastManager } from "../../../utils/toastManager";

export default function ShuttleStudentsListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [studentForm, setStudentForm] = useState({
    name: "",
    grade: "",
    route: "",
    parent: "",
    parentPhone: "",
    address: ""
  });

  // Load students from localStorage on mount
  React.useEffect(() => {
    const storedStudents = JSON.parse(localStorage.getItem("shuttleStudents") || "[]");
    if (storedStudents.length === 0) {
      // Initialize with mock data if empty
      const mockStudents = [
        {
          id: 1,
          name: "Emily Nakato",
          grade: "Grade 5",
          route: "Morning Route A",
          parent: "Mary Nakato",
          parentPhone: "+256 700 111 222",
          address: "Kololo, Kampala",
          status: "active",
          attendanceRate: 95
        },
        {
          id: 2,
          name: "Daniel Okello",
          grade: "Grade 7",
          route: "Morning Route B",
          parent: "James Okello",
          parentPhone: "+256 700 222 333",
          address: "Nakasero, Kampala",
          status: "active",
          attendanceRate: 92
        },
        {
          id: 3,
          name: "Sarah Nambi",
          grade: "Grade 6",
          route: "Morning Route A",
          parent: "Grace Nambi",
          parentPhone: "+256 700 333 444",
          address: "Bugolobi, Kampala",
          status: "active",
          attendanceRate: 98
        }
      ];
      localStorage.setItem("shuttleStudents", JSON.stringify(mockStudents));
      setStudents(mockStudents);
    } else {
      setStudents(storedStudents);
    }
  }, []);

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.parent.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Shuttle Students</h1>
          <p className="text-sm text-slate-600">Manage student roster and route assignments</p>
        </div>
        <button
          onClick={() => setShowAddStudentModal(true)}
          className="px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark"
        >
          + Add student
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by student or parent name..."
          className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green focus:border-transparent"
        />
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Parent Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Attendance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-700">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">{student.name}</div>
                        <div className="text-xs text-slate-500">{student.address}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {student.grade}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to="/school-shuttles/routes/1"
                      className="text-sm text-ev-green hover:text-ev-green-dark font-medium"
                    >
                      {student.route}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">{student.parent}</div>
                    <div className="text-xs text-slate-500">{student.parentPhone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-slate-900 mr-2">{student.attendanceRate}%</span>
                      <div className="w-16 bg-slate-200 rounded-full h-1.5">
                        <div
                          className="bg-emerald-500 rounded-full h-1.5"
                          style={{ width: `${student.attendanceRate}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/school-shuttles/students/${student.id}`}
                      className="text-ev-green hover:text-ev-green-dark mr-3"
                    >
                      View
                    </Link>
                    <Link
                      to={`/school-shuttles/students/${student.id}/attendance`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Attendance
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      <Modal
        isOpen={showAddStudentModal}
        onClose={() => {
          setShowAddStudentModal(false);
          setStudentForm({ name: "", grade: "", route: "", parent: "", parentPhone: "", address: "" });
        }}
        title="Add New Student"
        size="md"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const newStudent = {
              id: Date.now(),
              ...studentForm,
              status: "active",
              attendanceRate: 100
            };

            const updatedStudents = [newStudent, ...students];
            setStudents(updatedStudents);
            localStorage.setItem("shuttleStudents", JSON.stringify(updatedStudents));

            toastManager.show("Student added successfully!", "success");
            setShowAddStudentModal(false);
            setStudentForm({ name: "", grade: "", route: "", parent: "", parentPhone: "", address: "" });
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">Student Name *</span>
              <input
                type="text"
                value={studentForm.name}
                onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                placeholder="e.g., John Doe"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">Grade *</span>
              <select
                value={studentForm.grade}
                onChange={(e) => setStudentForm({ ...studentForm, grade: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
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
            <span className="text-sm font-medium text-slate-700 mb-1 block">Assign Route *</span>
            <select
              value={studentForm.route}
              onChange={(e) => setStudentForm({ ...studentForm, route: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
              required
            >
              <option value="">Select route...</option>
              <option value="Morning Route A">Morning Route A</option>
              <option value="Morning Route B">Morning Route B</option>
              <option value="Afternoon Route A">Afternoon Route A</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700 mb-1 block">Home Address *</span>
            <input
              type="text"
              value={studentForm.address}
              onChange={(e) => setStudentForm({ ...studentForm, address: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
              placeholder="e.g., Kololo, Kampala"
              required
            />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">Parent/Guardian Name *</span>
              <input
                type="text"
                value={studentForm.parent}
                onChange={(e) => setStudentForm({ ...studentForm, parent: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                placeholder="e.g., Jane Doe"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">Parent Phone *</span>
              <input
                type="tel"
                value={studentForm.parentPhone}
                onChange={(e) => setStudentForm({ ...studentForm, parentPhone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                placeholder="+256 700 000 000"
                required
              />
            </label>
          </div>
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowAddStudentModal(false);
                setStudentForm({ name: "", grade: "", route: "", parent: "", parentPhone: "", address: "" });
              }}
              className="flex-1 px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark"
            >
              Add Student
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
