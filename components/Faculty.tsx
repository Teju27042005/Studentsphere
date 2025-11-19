import React, { useEffect, useState } from 'react';
import { db } from '../services/db';
import { FacultyMember } from '../types';
import { Mail, GraduationCap } from 'lucide-react';

export const Faculty: React.FC = () => {
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);

  useEffect(() => {
    db.getFaculty().then(setFaculty);
  }, []);

  return (
    <div className="h-full">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Faculty Directory</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {faculty.map(member => (
          <div key={member.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:-translate-y-1 transition-transform duration-300">
            <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            <div className="px-6 pb-6">
              <div className="relative -mt-12 mb-4">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover bg-slate-200"
                />
              </div>
              <h3 className="text-lg font-bold text-slate-800">{member.name}</h3>
              <p className="text-blue-600 font-medium text-sm mb-2">{member.department}</p>
              
              <div className="mt-4 space-y-2">
                 <div className="flex items-center text-sm text-slate-600">
                  <GraduationCap size={16} className="mr-2 text-slate-400" />
                  <span>{member.specialization}</span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Mail size={16} className="mr-2 text-slate-400" />
                  <a href={`mailto:${member.email}`} className="hover:text-blue-600 hover:underline">{member.email}</a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};