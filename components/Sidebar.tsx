
import React, { useEffect, useState } from 'react';
import { LayoutDashboard, BookOpen, Award, CheckSquare, Users, FlaskConical, Medal, Mail, LogOut, CalendarCheck, UserCircle, GraduationCap } from 'lucide-react';
import { db } from '../services/db';
import { UserProfile } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onLogout: () => void;
  role: 'STUDENT' | 'FACULTY';
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['STUDENT', 'FACULTY'] },
  { id: 'students', label: 'My Students', icon: GraduationCap, roles: ['FACULTY'] },
  { id: 'notes', label: 'My Notes', icon: BookOpen, roles: ['STUDENT', 'FACULTY'] },
  { id: 'marks', label: 'Test Marks', icon: Award, roles: ['STUDENT', 'FACULTY'] },
  { id: 'assignments', label: 'Assignments', icon: CheckSquare, roles: ['STUDENT', 'FACULTY'] },
  { id: 'attendance', label: 'Attendance', icon: CalendarCheck, roles: ['STUDENT', 'FACULTY'] },
  { id: 'labs', label: 'Labs', icon: FlaskConical, roles: ['STUDENT', 'FACULTY'] },
  { id: 'faculty', label: 'Faculty Directory', icon: Users, roles: ['STUDENT', 'FACULTY'] },
  { id: 'achievements', label: 'Achievements', icon: Medal, roles: ['STUDENT', 'FACULTY'] },
  { id: 'profile', label: 'My Profile', icon: UserCircle, roles: ['FACULTY'] },
  { id: 'contact', label: 'Contact', icon: Mail, roles: ['STUDENT', 'FACULTY'] },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, setIsOpen, onLogout, role }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    db.getUserProfile().then(setProfile);
  }, [activeTab]);

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 z-20 bg-black/50 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-slate-900 text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 flex-shrink-0 items-center justify-center border-b border-slate-800 bg-slate-950 font-bold text-xl tracking-wider text-blue-400">
          <span className="mr-2">🎓</span> StudentSphere
        </div>

        <nav className="flex-1 overflow-y-auto mt-6 px-3 space-y-1">
          {NAV_ITEMS.filter(item => item.roles.includes(role)).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`group flex w-full items-center rounded-md px-3 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="flex-shrink-0 border-t border-slate-800 p-4 bg-slate-900">
          <div className="flex items-center justify-between">
            <div 
              className={`flex items-center max-w-[75%] ${role === 'FACULTY' ? 'cursor-pointer hover:opacity-80' : ''} transition-opacity`}
              onClick={() => {
                if (role === 'FACULTY') {
                  setActiveTab('profile');
                  setIsOpen(false);
                }
              }}
            >
              <div className="h-10 w-10 rounded-full bg-white flex-shrink-0 flex items-center justify-center text-blue-600 font-bold overflow-hidden border border-slate-600">
                {role === 'FACULTY' && profile?.imageUrl ? (
                  <img src={profile.imageUrl} alt="User" className="h-full w-full object-cover" />
                ) : (
                  <span>{role === 'FACULTY' ? (profile?.name ? profile.name.charAt(0) : 'DS') : 'ST'}</span>
                )}
              </div>
              <div className="ml-3 min-w-0">
                <p className="text-sm font-medium text-white truncate">{role === 'FACULTY' ? (profile?.name || 'Dr. Shreesha') : 'Student View'}</p>
                <p className="text-xs text-slate-400 truncate">{role === 'FACULTY' ? (profile?.department || 'E & C Dept') : 'Electronics & Comm.'}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
              title="Sign Out"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
