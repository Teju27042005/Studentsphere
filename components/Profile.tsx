
import React, { useEffect, useState, useRef } from 'react';
import { db } from '../services/db';
import { UserProfile } from '../types';
import { User, Camera, Save, Upload, FileText, Mail, Hash, BookOpen, Briefcase, BadgeCheck } from 'lucide-react';

export const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [saveStatus, setSaveStatus] = useState<'IDLE' | 'SAVING' | 'SAVED'>('IDLE');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const load = async () => {
      const data = await db.getUserProfile();
      setProfile(data);
    };
    load();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && profile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaveStatus('SAVING');
    await db.updateUserProfile(profile);
    setSaveStatus('SAVED');
    
    setTimeout(() => setSaveStatus('IDLE'), 2000);
  };

  if (!profile) return <div className="flex items-center justify-center h-full"><div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>;

  return (
    <div className="h-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Faculty Profile</h1>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Image & Bio */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className={`w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden ${!profile.imageUrl ? 'bg-blue-50 flex items-center justify-center' : ''}`}>
                {profile.imageUrl ? (
                  <img src={profile.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={48} className="text-blue-300" />
                )}
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="text-white" />
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
                accept="image/*"
              />
            </div>
            <p className="text-xs text-slate-500 mt-3">Click to upload photo</p>
            
            <h2 className="text-xl font-bold text-slate-800 mt-4">{profile.name}</h2>
            <p className="text-sm text-slate-500">{profile.employeeId}</p>
            <p className="text-blue-600 font-medium text-sm mt-1">{profile.designation}</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-3">Credentials</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center">
                  <FileText size={16} className="text-slate-400 mr-3" />
                  <span className="text-sm text-slate-700">PhD_Certificate.pdf</span>
                </div>
                <button type="button" className="text-xs text-blue-600 hover:underline">View</button>
              </div>
              <button 
                type="button" 
                className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-slate-500 text-sm hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center justify-center"
              >
                <Upload size={14} className="mr-2" /> Upload Document
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Edit Details */}
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <div className="flex justify-between items-center mb-6">
               <h3 className="font-semibold text-slate-800 text-lg">Professional Details</h3>
               {saveStatus === 'SAVED' && <span className="text-sm text-green-600 font-medium flex items-center"><Save size={14} className="mr-1"/> Saved!</span>}
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center text-xs font-semibold text-slate-500 uppercase">
                    <User size={14} className="mr-2" /> Full Name
                  </label>
                  <input 
                    type="text" 
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="w-full p-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-xs font-semibold text-slate-500 uppercase">
                    <Hash size={14} className="mr-2" /> Employee ID
                  </label>
                  <input 
                    type="text" 
                    value={profile.employeeId}
                    onChange={(e) => setProfile({...profile, employeeId: e.target.value})}
                    className="w-full p-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="flex items-center text-xs font-semibold text-slate-500 uppercase">
                    <Mail size={14} className="mr-2" /> Email Address
                  </label>
                  <input 
                    type="email" 
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className="w-full p-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-xs font-semibold text-slate-500 uppercase">
                    <Briefcase size={14} className="mr-2" /> Department
                  </label>
                  <select 
                    value={profile.department}
                    onChange={(e) => setProfile({...profile, department: e.target.value})}
                    className="w-full p-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-white"
                  >
                    <option>Electronics & Communication</option>
                    <option>Computer Science</option>
                    <option>Mechanical Engineering</option>
                    <option>Electrical Engineering</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-xs font-semibold text-slate-500 uppercase">
                    <BadgeCheck size={14} className="mr-2" /> Designation
                  </label>
                  <input
                    type="text" 
                    value={profile.designation}
                    onChange={(e) => setProfile({...profile, designation: e.target.value})}
                    className="w-full p-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="flex items-center text-xs font-semibold text-slate-500 uppercase">
                    Bio / Research Interests
                  </label>
                  <textarea 
                    rows={4}
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    className="w-full p-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none resize-none"
                  />
                </div>
             </div>

             <div className="mt-8 flex justify-end">
               <button 
                 type="submit"
                 disabled={saveStatus === 'SAVING'}
                 className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center shadow-md disabled:opacity-70"
               >
                 {saveStatus === 'SAVING' ? 'Saving...' : <><Save size={18} className="mr-2" /> Save Profile</>}
               </button>
             </div>
          </div>
        </div>
      </form>
    </div>
  );
};
