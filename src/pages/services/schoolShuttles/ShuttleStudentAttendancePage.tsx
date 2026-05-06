import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

interface AttendanceRecord {
  date: string;
  status: "present" | "absent" | "late" | "early";
  pickupTime: string;
  scheduledTime: string;
  notes?: string;
}

export default function ShuttleStudentAttendancePage() {
  const { studentId } = useParams();
  const [student, setStudent] = useState<{ name: string; grade: string; attendanceRate?: number } | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [storedAttendanceRate, setStoredAttendanceRate] = useState<number | null>(null);
  const [notificationsPeriod, setNotificationsPeriod] = useState("week");

  useEffect(() => {
    // Load student data
    const storedStudents = JSON.parse(localStorage.getItem("shuttleStudents") || "[]");
    const foundStudent = storedStudents.find((s: any) => s.id === Number(studentId));

    if (foundStudent) {
      setStudent({ name: foundStudent.name, grade: foundStudent.grade });
      // Store the attendance rate for consistency
      if (foundStudent.attendanceRate) {
        setStoredAttendanceRate(foundStudent.attendanceRate);
      }
    } else {
      setStudent({ name: "Emily Nakato", grade: "Grade 5" });
      setStoredAttendanceRate(98);
    }

    // Generate mock attendance data for the selected month
    const generateAttendanceData = () => {
      const records: AttendanceRecord[] = [];
      const year = parseInt(selectedMonth.split("-")[0]);
      const month = parseInt(selectedMonth.split("-")[1]);
      const daysInMonth = new Date(year, month, 0).getDate();

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day);
        const dayOfWeek = date.getDay();

        // Skip weekends for school days
        if (dayOfWeek === 0 || dayOfWeek === 6) continue;

        const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const statuses: AttendanceRecord["status"][] = ["present", "present", "present", "present", "late", "early", "absent"];
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        const scheduledTime = "06:30";
        let pickupTime = scheduledTime;
        if (status === "late") {
          pickupTime = "06:35";
        } else if (status === "early") {
          pickupTime = "06:28";
        } else if (status === "absent") {
          pickupTime = "-";
        }

        records.push({
          date: dateStr,
          status,
          pickupTime,
          scheduledTime,
          notes: status === "absent" ? "Parent notified" : undefined
        });
      }

      return records;
    };

    setAttendanceRecords(generateAttendanceData());
    setLoading(false);
  }, [studentId, selectedMonth]);

  const getStatusColor = (status: AttendanceRecord["status"]) => {
    switch (status) {
      case "present":
        return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700";
      case "late":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700";
      case "early":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700";
      case "absent":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700";
      default:
        return "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600";
    }
  };

  const getStatusLabel = (status: AttendanceRecord["status"]) => {
    switch (status) {
      case "present":
        return "Present";
      case "late":
        return "Late";
      case "early":
        return "Early";
      case "absent":
        return "Absent";
      default:
        return status;
    }
  };

  const stats = {
    total: attendanceRecords.length,
    present: attendanceRecords.filter(r => r.status === "present").length,
    late: attendanceRecords.filter(r => r.status === "late").length,
    early: attendanceRecords.filter(r => r.status === "early").length,
    absent: attendanceRecords.filter(r => r.status === "absent").length,
    attendanceRate: storedAttendanceRate !== null ? storedAttendanceRate : (attendanceRecords.length > 0
      ? Math.round((attendanceRecords.filter(r => r.status !== "absent").length / attendanceRecords.length) * 100)
      : 0)
  };

  if (loading) {
    return (
      <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50 dark:bg-slate-900">
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-400">Loading attendance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50 dark:bg-slate-900">
      <div className="w-full">
        {/* Header */}
        <div className="mb-6">
          <Link
            to={`/school-shuttles/students/${studentId}`}
            className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 mb-2 inline-block"
          >
            ← Back to student details
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Student Attendance</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {student?.name} · {student?.grade}
              </p>
            </div>
            <div className="flex gap-2">
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
              />
            </div>
          </div>
        </div>

        {/* Stats - LIGHT SOLID COLORS (no gradients) */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm text-emerald-700 font-medium">Attendance Rate</p>
            </div>
            <p className="text-2xl font-semibold text-emerald-800">{stats.attendanceRate}%</p>
          </div>
          <div className="bg-slate-100 rounded-xl border border-slate-300 p-4">
            <p className="text-sm text-slate-600 font-medium mb-1">Total Days</p>
            <p className="text-2xl font-semibold text-slate-800">{stats.total}</p>
          </div>
          <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4">
            <p className="text-sm text-emerald-700 font-medium mb-1">Present</p>
            <p className="text-2xl font-semibold text-emerald-800">{stats.present}</p>
          </div>
          <div className="bg-orange-50 rounded-xl border border-orange-200 p-4">
            <p className="text-sm text-orange-700 font-medium mb-1">Late</p>
            <p className="text-2xl font-semibold text-orange-800">{stats.late}</p>
          </div>
          <div className="bg-slate-100 rounded-xl border border-slate-300 p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm text-slate-600 font-medium">Absent</p>
            </div>
            <p className="text-2xl font-semibold text-slate-800">{stats.absent}</p>
          </div>
        </div>

        {/* Notifications Card with Period Dropdown */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-1">Number of Notifications</p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">12</p>
            </div>
            <select
              value={notificationsPeriod}
              onChange={(e) => setNotificationsPeriod(e.target.value)}
              className="text-xs border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg px-2 py-1 cursor-pointer focus:ring-ev-green focus:border-ev-green outline-none"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>

        {/* Attendance Calendar View */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Attendance Calendar - {new Date(selectedMonth + "-01").toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </h2>
          <div className="overflow-x-auto">
            <div className="min-w-[560px]">
              <div className="grid grid-cols-7 gap-1.5 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-slate-500 dark:text-slate-400 py-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {(() => {
              const year = parseInt(selectedMonth.split("-")[0]);
              const month = parseInt(selectedMonth.split("-")[1]);
              const firstDay = new Date(year, month - 1, 1).getDay();
              const daysInMonth = new Date(year, month, 0).getDate();
              const cells: JSX.Element[] = [];

              // Empty cells for days before the first day of the month
              for (let i = 0; i < firstDay; i++) {
                cells.push(<div key={`empty-${i}`} className="h-10" />);
              }

              // Days of the month
              for (let day = 1; day <= daysInMonth; day++) {
                const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const record = attendanceRecords.find(r => r.date === dateStr);
                const date = new Date(year, month - 1, day);
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                cells.push(
                  <div
                    key={day}
                    className={`h-10 rounded border-2 flex flex-col items-center justify-center text-[10px] ${isWeekend
                        ? "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500"
                        : record
                          ? `${getStatusColor(record.status)}`
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                      }`}
                  >
                    <span className="font-semibold">{day}</span>
                    {record && !isWeekend && (
                      <span className="text-[8px] mt-0.5 leading-none">
                        {record.pickupTime !== "-" ? record.pickupTime : "—"}
                      </span>
                    )}
                  </div>
                );
              }

              return cells;
                })()}
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-emerald-100 dark:bg-emerald-900 border-2 border-emerald-200 dark:border-emerald-700" />
              <span>Present</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-100 dark:bg-yellow-900 border-2 border-yellow-200 dark:border-yellow-700" />
              <span>Late</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-100 dark:bg-blue-900 border-2 border-blue-200 dark:border-blue-700" />
              <span>Early</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-100 dark:bg-red-900 border-2 border-red-200 dark:border-red-700" />
              <span>Absent</span>
            </div>
          </div>
        </div>

        {/* Attendance List */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Attendance History</h2>
          <div className="space-y-2">
            {attendanceRecords.length === 0 ? (
              <p className="text-sm text-slate-600 dark:text-slate-400 text-center py-8">No attendance records for this month</p>
            ) : (
              attendanceRecords
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((record, idx) => {
                  const date = new Date(record.date);
                  const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                  return (
                    <div
                      key={idx}
                      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-lg border ${getStatusColor(record.status)}`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            {date.toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                              year: "numeric"
                            })}
                          </p>
                          {isWeekend && (
                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                              Weekend
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                          <span>Scheduled: {record.scheduledTime}</span>
                          {record.pickupTime !== "-" && (
                            <span>Actual: {record.pickupTime}</span>
                          )}
                          {record.notes && (
                            <span className="text-xs italic">· {record.notes}</span>
                          )}
                        </div>
                      </div>
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-white dark:bg-slate-800 border border-current">
                        {getStatusLabel(record.status)}
                      </span>
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
