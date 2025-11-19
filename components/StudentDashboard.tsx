
import React, { useEffect, useState } from 'react';
import { db } from '../services/db';
import { Student, Assignment, AttendanceRecord } from '../types';
import { BookOpen, Calendar, CheckCircle2, Clock, Award, TrendingUp, Bell } from 'lucide-react';

interface StudentDashboardProps {
  studentId: string; // USN or ID
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ studentId }) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    const loadData = async () => {
      // Simulate fetching logged-in student data
      // In a real app, you'd fetch by the authenticated ID
      // Here we fetch the list and find the student or default to the first one if 'demo'
      const s = await db.getStudentProfile(studentId) || (await db.getStudents())[0];
      setStudent(s);

      const a = await db.getAssignments();
      setAssignments(a);

      const att = await db.getAttendance();
      setAttendance(att);
    };
    loadData();
  }, [studentId]);

  if (!student) return <div className="flex items-center justify-center h-full">Loading...</div>;

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Student Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-6">
          <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold shadow-md border-4 border-blue-400/30">
            {student.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{student.name}</h1>
            <p className="opacity-90 flex items-center gap-2 mt-1">
              <span className="bg-blue-500/50 px-2 py-0.5 rounded text-sm font-mono">{student.usn}</span>
              <span className="text-sm">| {student.department} - {student.semester} Sem</span>
            </p>
          </div>
          <div className="ml-auto hidden sm:block text-right">
            <p className="text-sm opacity-75 uppercase tracking-widest">CGPA</p>
            <p className="text-4xl font-bold">{student.cgpa}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Attendance Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Overall Attendance</p>
             <h2 className={`text-3xl font-bold mt-1 ${student.attendance >= 75 ? 'text-green-600' : 'text-red-500'}`}>
               {student.attendance}%
             </h2>
             <p className="text-xs text-slate-400 mt-1">
               {student.attendance >= 75 ? 'Good Standing' : 'Warning: Low Attendance'}
             </p>
           </div>
           <div className={`h-12 w-12 rounded-full flex items-center justify-center ${student.attendance >= 75 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
             <Calendar size={24} />
           </div>
        </div>

        {/* Pending Assignments */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Due Assignments</p>
             <h2 className="text-3xl font-bold mt-1 text-slate-800">
               {assignments.filter(a => a.status !== 'COMPLETED').length}
             </h2>
             <p className="text-xs text-slate-400 mt-1">3 due this week</p>
           </div>
           <div className="h-12 w-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
             <Clock size={24} />
           </div>
        </div>

        {/* Rank/Performance */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Class Rank</p>
             <h2 className="text-3xl font-bold mt-1 text-purple-600">#5</h2>
             <p className="text-xs text-slate-400 mt-1">Top 12% of class</p>
           </div>
           <div className="h-12 w-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
             <TrendingUp size={24} />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Subject Wise Attendance */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center">
            <CheckCircle2 className="mr-2 text-blue-600" size={20} />
            Subject Attendance
          </h3>
          <div className="space-y-4">
            {attendance.map(att => {
              const pct = Math.round((att.attendedClasses / att.totalClasses) * 100);
              return (
                <div key={att.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">{att.subject}</span>
                    <span className={pct >= 75 ? 'text-green-600' : 'text-red-500'}>{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${pct >= 75 ? 'bg-green-500' : 'bg-red-500'}`} 
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center">
            <Bell className="mr-2 text-orange-500" size={20} />
            Notice Board
          </h3>
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs font-bold text-blue-700 mb-1">EXAM ALERT</p>
              <p className="text-sm text-blue-900">Mid-term exams for 5th Semester start from Nov 15th.</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
              <p className="text-xs font-bold text-yellow-700 mb-1">FEE REMINDER</p>
              <p className="text-sm text-yellow-900">Last date to pay tuition fees is Oct 30th.</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border border-green-100">
              <p className="text-xs font-bold text-green-700 mb-1">EVENT</p>
              <p className="text-sm text-green-900">Hackathon registration opens tomorrow.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
