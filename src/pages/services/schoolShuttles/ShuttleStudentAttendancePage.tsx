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
  const [student, setStudent] = useState<{ name: string; grade: string } | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load student data
    const storedStudents = JSON.parse(localStorage.getItem("shuttleStudents") || "[]");
    const foundStudent = storedStudents.find((s: any) => s.id === Number(studentId));
    
    if (foundStudent) {
      setStudent({ name: foundStudent.name, grade: foundStudent.grade });
    } else {
      setStudent({ name: "Emily Nakato", grade: "Grade 5" });
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
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "late":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "early":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "absent":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
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
    attendanceRate: attendanceRecords.length > 0
      ? Math.round((attendanceRecords.filter(r => r.status !== "absent").length / attendanceRecords.length) * 100)
      : 0
  };

  if (loading) {
    return (
      <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50">
        <div className="text-center py-12">
          <p className="text-slate-600">Loading attendance data...</p>
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
            to={`/school-shuttles/students/${studentId}`}
            className="text-sm text-slate-600 hover:text-slate-900 mb-2 inline-block"
          >
            ← Back to student details
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 mb-2">Student Attendance</h1>
              <p className="text-sm text-slate-600">
                {student?.name} · {student?.grade}
              </p>
            </div>
            <div className="flex gap-2">
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-600 mb-1">Attendance Rate</p>
            <p className="text-2xl font-semibold text-slate-900">{stats.attendanceRate}%</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-600 mb-1">Total Days</p>
            <p className="text-2xl font-semibold text-slate-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-600 mb-1">Present</p>
            <p className="text-2xl font-semibold text-emerald-600">{stats.present}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-600 mb-1">Late</p>
            <p className="text-2xl font-semibold text-yellow-600">{stats.late}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-600 mb-1">Absent</p>
            <p className="text-2xl font-semibold text-red-600">{stats.absent}</p>
          </div>
        </div>

        {/* Attendance Calendar View */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Attendance Calendar - {new Date(selectedMonth + "-01").toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </h2>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-slate-500 py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {(() => {
              const year = parseInt(selectedMonth.split("-")[0]);
              const month = parseInt(selectedMonth.split("-")[1]);
              const firstDay = new Date(year, month - 1, 1).getDay();
              const daysInMonth = new Date(year, month, 0).getDate();
              const cells: JSX.Element[] = [];

              // Empty cells for days before the first day of the month
              for (let i = 0; i < firstDay; i++) {
                cells.push(<div key={`empty-${i}`} className="aspect-square" />);
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
                    className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center text-xs ${
                      isWeekend
                        ? "bg-slate-50 border-slate-200 text-slate-400"
                        : record
                        ? `${getStatusColor(record.status)}`
                        : "bg-white border-slate-200 text-slate-600"
                    }`}
                  >
                    <span className="font-semibold">{day}</span>
                    {record && !isWeekend && (
                      <span className="text-[10px] mt-0.5">
                        {record.pickupTime !== "-" ? record.pickupTime : "—"}
                      </span>
                    )}
                  </div>
                );
              }

              return cells;
            })()}
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-emerald-100 border-2 border-emerald-200" />
              <span>Present</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-100 border-2 border-yellow-200" />
              <span>Late</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-100 border-2 border-blue-200" />
              <span>Early</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-100 border-2 border-red-200" />
              <span>Absent</span>
            </div>
          </div>
        </div>

        {/* Attendance List */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Attendance History</h2>
          <div className="space-y-2">
            {attendanceRecords.length === 0 ? (
              <p className="text-sm text-slate-600 text-center py-8">No attendance records for this month</p>
            ) : (
              attendanceRecords
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((record, idx) => {
                  const date = new Date(record.date);
                  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                  
                  return (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-4 rounded-lg border ${getStatusColor(record.status)}`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <p className="font-semibold text-slate-900">
                            {date.toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                              year: "numeric"
                            })}
                          </p>
                          {isWeekend && (
                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-slate-200 text-slate-600">
                              Weekend
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex items-center gap-4 text-sm text-slate-600">
                          <span>Scheduled: {record.scheduledTime}</span>
                          {record.pickupTime !== "-" && (
                            <span>Actual: {record.pickupTime}</span>
                          )}
                          {record.notes && (
                            <span className="text-xs italic">· {record.notes}</span>
                          )}
                        </div>
                      </div>
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-white border border-current">
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
