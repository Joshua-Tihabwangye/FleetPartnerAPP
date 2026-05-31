import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getFleetShuttleStudent, listFleetShuttleAttendance } from "../../../services/api/fleetApi";
import { toastManager } from "../../../utils/toastManager";

type AttendanceStatus = "present" | "absent" | "late" | "early";

type AttendanceRecord = {
  id: string;
  date: string;
  status: AttendanceStatus;
  pickupTime: string;
  scheduledTime: string;
  notes?: string;
};

function asStatus(value: unknown): AttendanceStatus {
  if (value === "late" || value === "early" || value === "absent") return value;
  return "present";
}

function normalizeRecord(raw: Record<string, unknown>, idx: number): AttendanceRecord {
  const timestamp = Number(raw.date ?? raw.createdAt ?? Date.now());
  const date = Number.isFinite(timestamp)
    ? new Date(timestamp).toISOString().slice(0, 10)
    : String(raw.date ?? new Date().toISOString().slice(0, 10));

  return {
    id: String(raw.id ?? `attendance-${idx}`),
    date,
    status: asStatus(raw.status),
    pickupTime: String(raw.pickupTime ?? "-"),
    scheduledTime: String(raw.scheduledTime ?? "06:30"),
    notes: typeof raw.notes === "string" ? raw.notes : undefined,
  };
}

export default function ShuttleStudentAttendancePage() {
  const { studentId } = useParams();
  const [student, setStudent] = useState<{ name: string; grade: string; attendanceRate: number } | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!studentId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const [studentResponse, attendanceResponse] = await Promise.all([
          getFleetShuttleStudent(studentId),
          listFleetShuttleAttendance(studentId),
        ]);

        setStudent({
          name: String(studentResponse.name ?? "Unknown student"),
          grade: String(studentResponse.grade ?? "N/A"),
          attendanceRate: Number(studentResponse.attendanceRate ?? 0),
        });

        setAttendanceRecords(attendanceResponse.map((entry, idx) => normalizeRecord(entry, idx)));
      } catch (error) {
        console.error("Failed to load attendance", error);
        toastManager.show("Failed to load attendance from backend", "error");
        setStudent(null);
        setAttendanceRecords([]);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [studentId]);

  const monthlyRecords = useMemo(
    () => attendanceRecords.filter((record) => record.date.startsWith(selectedMonth)),
    [attendanceRecords, selectedMonth],
  );

  const stats = useMemo(() => {
    const total = monthlyRecords.length;
    const present = monthlyRecords.filter((r) => r.status === "present").length;
    const late = monthlyRecords.filter((r) => r.status === "late").length;
    const early = monthlyRecords.filter((r) => r.status === "early").length;
    const absent = monthlyRecords.filter((r) => r.status === "absent").length;
    const attendanceRate =
      student?.attendanceRate ??
      (total > 0 ? Math.round(((present + late + early) / total) * 100) : 0);

    return { total, present, late, early, absent, attendanceRate };
  }, [monthlyRecords, student?.attendanceRate]);

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case "present":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "late":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "early":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "absent":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  if (loading) {
    return <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50"><div className="text-center py-12 text-slate-600">Loading attendance data...</div></div>;
  }

  if (!student) {
    return (
      <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
        <div className="text-center py-12">
          <p className="text-slate-700 font-medium">Student not found</p>
          <Link to="/school-shuttles/students" className="text-sm text-ev-green hover:text-ev-green-dark">Back to students</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
      <div className="w-full">
        <div className="mb-6">
          <Link to={`/school-shuttles/students/${studentId}`} className="text-sm text-slate-600 hover:text-slate-900 mb-2 inline-block">
            ← Back to student details
          </Link>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 mb-2">Student Attendance</h1>
              <p className="text-sm text-slate-600">{student.name} · {student.grade}</p>
            </div>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4"><p className="text-sm text-emerald-700">Attendance</p><p className="text-2xl font-semibold text-emerald-800">{stats.attendanceRate}%</p></div>
          <div className="bg-white rounded-xl border border-slate-200 p-4"><p className="text-sm text-slate-600">Total</p><p className="text-2xl font-semibold text-slate-900">{stats.total}</p></div>
          <div className="bg-white rounded-xl border border-slate-200 p-4"><p className="text-sm text-slate-600">Present</p><p className="text-2xl font-semibold text-slate-900">{stats.present}</p></div>
          <div className="bg-white rounded-xl border border-slate-200 p-4"><p className="text-sm text-slate-600">Late</p><p className="text-2xl font-semibold text-slate-900">{stats.late}</p></div>
          <div className="bg-white rounded-xl border border-slate-200 p-4"><p className="text-sm text-slate-600">Absent</p><p className="text-2xl font-semibold text-slate-900">{stats.absent}</p></div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Attendance History</h2>
          <div className="space-y-2">
            {monthlyRecords.length === 0 ? (
              <p className="text-sm text-slate-600 text-center py-8">No backend attendance records for this month.</p>
            ) : (
              monthlyRecords
                .slice()
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((record) => {
                  const date = new Date(record.date);
                  return (
                    <div key={record.id} className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-lg border ${getStatusColor(record.status)}`}>
                      <div>
                        <p className="font-semibold text-slate-900">{date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
                        <p className="text-sm text-slate-600">Scheduled: {record.scheduledTime} · Actual: {record.pickupTime}</p>
                        {record.notes ? <p className="text-xs text-slate-500 italic mt-1">{record.notes}</p> : null}
                      </div>
                      <span className="px-3 py-1 rounded-full bg-white border text-xs font-medium uppercase">{record.status}</span>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
