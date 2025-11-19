import React, { useEffect, useState } from 'react';
import { db } from '../services/db';
import { Mark } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export const Marks: React.FC = () => {
  const [marks, setMarks] = useState<Mark[]>([]);

  useEffect(() => {
    db.getMarks().then(setMarks);
  }, []);

  const getAverage = () => {
    if (marks.length === 0) return 0;
    const sum = marks.reduce((acc, curr) => acc + curr.score, 0);
    return (sum / marks.length).toFixed(1);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Performance Analytics</h1>
          <p className="text-slate-500">Track your academic progress over time.</p>
        </div>
        <div className="text-right">
          <span className="text-sm text-slate-500">Overall Average</span>
          <p className="text-3xl font-bold text-blue-600">{getAverage()}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-96">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Recent Test Scores</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={marks}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="subject" tick={{fontSize: 12}} interval={0} />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f1f5f9' }}
                />
                <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <h3 className="text-lg font-semibold text-slate-800 mb-6">Score Trend</h3>
           <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={marks}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="testName" tick={{fontSize: 12}} />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-semibold text-slate-700">Detailed History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-medium">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Subject</th>
                <th className="px-6 py-3">Test Name</th>
                <th className="px-6 py-3">Score</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {marks.map((mark) => (
                <tr key={mark.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-600">{mark.date}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{mark.subject}</td>
                  <td className="px-6 py-4 text-slate-600">{mark.testName}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{mark.score}/{mark.total}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      mark.score >= 80 ? 'bg-green-100 text-green-700' :
                      mark.score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {mark.score >= 80 ? 'Excellent' : mark.score >= 60 ? 'Good' : 'Needs Improvement'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};