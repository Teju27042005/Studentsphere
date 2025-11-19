import React, { useEffect, useState } from 'react';
import { db } from '../services/db';
import { LabSession, Achievement } from '../types';
import { FlaskConical, Calendar, Trophy, Award, Plus, X, Clock, MapPin, User } from 'lucide-react';

export const Labs: React.FC = () => {
  const [labs, setLabs] = useState<LabSession[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newLab, setNewLab] = useState({
    subject: '',
    topic: '',
    time: '',
    room: '',
    instructor: ''
  });

  const fetchData = async () => {
    const data = await db.getLabs();
    setLabs(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddLab = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLab.subject || !newLab.topic) return;

    await db.addLab({
      id: Date.now().toString(),
      ...newLab
    });

    setNewLab({ subject: '', topic: '', time: '', room: '', instructor: '' });
    setIsAdding(false);
    fetchData();
  };

  return (
    <div className="h-full flex flex-col">
       <div className="flex justify-between items-center mb-6">
         <h1 className="text-2xl font-bold text-slate-800">VLSI & MATLAB Labs</h1>
         <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            {isAdding ? (
              <>
                <X size={18} className="mr-2" /> Cancel
              </>
            ) : (
              <>
                <Plus size={18} className="mr-2" /> Add Lab
              </>
            )}
          </button>
       </div>

       {isAdding && (
        <div className="mb-6 bg-white p-6 rounded-xl border border-slate-200 shadow-lg animate-in slide-in-from-top-4">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Schedule New Lab Session</h2>
          <form onSubmit={handleAddLab} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-1">
              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Subject</label>
              <select 
                className="w-full p-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-slate-50"
                value={newLab.subject}
                onChange={(e) => setNewLab({...newLab, subject: e.target.value})}
                required
              >
                <option value="" disabled>Select Subject</option>
                <option value="VLSI">VLSI</option>
                <option value="MATLAB">MATLAB</option>
                <option value="Embedded Systems">Embedded Systems</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Topic</label>
              <input 
                type="text" 
                placeholder="e.g., CMOS Logic Gates"
                className="w-full p-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                value={newLab.topic}
                onChange={(e) => setNewLab({...newLab, topic: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Time</label>
              <input 
                type="text" 
                placeholder="e.g., Tue 02:00 PM"
                className="w-full p-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                value={newLab.time}
                onChange={(e) => setNewLab({...newLab, time: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Room</label>
              <input 
                type="text" 
                placeholder="e.g., Lab 301"
                className="w-full p-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                value={newLab.room}
                onChange={(e) => setNewLab({...newLab, room: e.target.value})}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Instructor</label>
              <input 
                type="text" 
                placeholder="e.g., Dr. Shreesha"
                className="w-full p-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                value={newLab.instructor}
                onChange={(e) => setNewLab({...newLab, instructor: e.target.value})}
                required
              />
            </div>
            <div className="md:col-span-2 flex justify-end mt-2">
              <button 
                type="submit" 
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-sm"
              >
                Save Session
              </button>
            </div>
          </form>
        </div>
       )}

       <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
         <div className="divide-y divide-slate-100">
           {labs.map(lab => (
             <div key={lab.id} className="p-6 flex flex-col sm:flex-row sm:items-center hover:bg-slate-50 transition-colors">
                <div className="flex items-center mb-4 sm:mb-0 flex-grow">
                  <div className={`flex-shrink-0 h-12 w-12 rounded-lg flex items-center justify-center mr-4 shadow-sm ${
                    lab.subject === 'VLSI' ? 'bg-purple-100 text-purple-600' : 
                    lab.subject === 'MATLAB' ? 'bg-orange-100 text-orange-600' : 
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <FlaskConical size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-lg">{lab.subject}: {lab.topic}</h3>
                    <div className="flex flex-wrap gap-4 mt-1 text-sm text-slate-500">
                       <span className="flex items-center"><User size={14} className="mr-1" /> {lab.instructor}</span>
                       <span className="flex items-center"><MapPin size={14} className="mr-1" /> {lab.room}</span>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 sm:text-right">
                   <div className="inline-flex items-center text-slate-700 bg-slate-100 px-4 py-2 rounded-lg text-sm font-medium border border-slate-200">
                     <Clock size={16} className="mr-2 text-slate-400" />
                     {lab.time}
                   </div>
                </div>
             </div>
           ))}
           {labs.length === 0 && (
             <div className="p-8 text-center text-slate-500">
               No lab sessions scheduled. Add one to get started!
             </div>
           )}
         </div>
       </div>
    </div>
  );
};

export const Achievements: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    db.getAchievements().then(setAchievements);
  }, []);

  return (
    <div className="h-full">
       <h1 className="text-2xl font-bold text-slate-800 mb-6">My Achievements</h1>
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
         {achievements.map(ach => (
           <div key={ach.id} className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-100 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-3xl mb-4">
                {ach.icon}
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-1">{ach.title}</h3>
              <p className="text-amber-700/70 text-xs font-medium uppercase tracking-wide mb-3">{ach.date}</p>
              <p className="text-slate-600 text-sm">{ach.description}</p>
              
              <div className="mt-4 pt-4 border-t border-amber-100 w-full flex justify-center">
                <Award className="text-amber-400 w-5 h-5" />
              </div>
           </div>
         ))}
         
         {/* Empty State / Placeholder for encouragement */}
         <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center text-slate-400 hover:border-blue-300 hover:bg-slate-50 transition-colors cursor-pointer group">
            <Trophy className="w-12 h-12 mb-2 group-hover:text-blue-400 transition-colors" />
            <p className="font-medium">Next Milestone</p>
            <p className="text-xs">Keep working hard to unlock more!</p>
         </div>
       </div>
    </div>
  );
};