import React, { useEffect, useState } from 'react';
import { db } from '../services/db';
import { AttendanceRecord } from '../types';
import { CalendarCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

export const Attendance: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    db.getAttendance().then(setRecords);
  }, []);

  const getPercentage = (attended: number, total: number) => {
    return Math.round((attended / total) * 100);
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 85) return 'text-green-600 bg-green-100 border-green-200';
    if (percentage >= 75) return 'text-blue-600 bg-blue-100 border-blue-200';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };

  const getBarColor = (percentage: number) => {
    if (percentage >= 85) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getOverallAttendance = () => {
    if (records.length === 0) return 0;
    const total = records.reduce((acc, curr) => acc + curr.totalClasses, 0);
    const attended = records.reduce((acc, curr) => acc + curr.attendedClasses, 0);
    return Math.round((attended / total) * 100);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Attendance Sheet</h1>
          <p className="text-slate-500">Track your class presence and eligibility.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
          <span className="text-sm text-slate-500 font-medium">Overall Attendance</span>
          <span className={`text-2xl font-bold ${
            getOverallAttendance() >= 75 ? 'text-green-600' : 'text-yellow-600'
          }`}>
            {getOverallAttendance()}%
          </span>
        </div>
      </div>

      {getOverallAttendance() < 75 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
          <AlertCircle className="text-yellow-600 w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-yellow-800">Attendance Warning</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Your overall attendance is below 75%. Please ensure you attend upcoming classes to meet university requirements.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {records.map((record) => {
          const percentage = getPercentage(record.attendedClasses, record.totalClasses);
          return (
            <div key={record.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">{record.subject}</h3>
                  <p className="text-xs text-slate-400">Last Updated: {record.lastUpdated}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-bold border ${getStatusColor(percentage)}`}>
                  {percentage}%
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
                <span>Progress</span>
                <span>{record.attendedClasses} / {record.totalClasses} Classes</span>
              </div>
              
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${getBarColor(percentage)}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>

              <div className="mt-4 flex justify-end">
                 {percentage >= 75 ? (
                   <div className="flex items-center text-xs text-green-600 font-medium">
                     <CheckCircle2 size={14} className="mr-1" /> Eligible for Exams
                   </div>
                 ) : (
                   <div className="flex items-center text-xs text-red-500 font-medium">
                     <AlertCircle size={14} className="mr-1" /> Low Attendance
                   </div>
                 )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};