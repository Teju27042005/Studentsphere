import React, { useEffect, useState } from 'react';
import { db } from '../services/db';
import { Assignment } from '../types';
import { Clock, CheckCircle, Circle } from 'lucide-react';

export const Assignments: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const fetchData = async () => {
    const data = await db.getAssignments();
    setAssignments(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleStatus = async (assignment: Assignment) => {
    const newStatus = assignment.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    await db.updateAssignment({ ...assignment, status: newStatus });
    fetchData();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-700 border-green-200';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="h-full">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Assignments</h1>
      
      <div className="grid gap-4">
        {assignments.map(assign => (
          <div key={assign.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center">
            <button 
              onClick={() => toggleStatus(assign)}
              className={`mr-4 flex-shrink-0 transition-colors ${assign.status === 'COMPLETED' ? 'text-green-500' : 'text-slate-300 hover:text-blue-500'}`}
            >
              {assign.status === 'COMPLETED' ? <CheckCircle size={28} /> : <Circle size={28} />}
            </button>
            
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-1">
                <h3 className={`text-lg font-medium ${assign.status === 'COMPLETED' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                  {assign.title}
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(assign.status)}`}>
                  {assign.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-slate-500 text-sm mb-2">{assign.description}</p>
              <div className="flex items-center text-xs text-slate-400 font-medium">
                <span className="bg-slate-100 px-2 py-1 rounded mr-2 text-slate-600">{assign.subject}</span>
                <Clock size={14} className="mr-1" /> Due: {assign.dueDate}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};