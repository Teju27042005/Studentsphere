
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { Notes } from './components/Notes';
import { Marks } from './components/Marks';
import { Assignments } from './components/Assignments';
import { Faculty } from './components/Faculty';
import { Contact } from './components/Contact';
import { Labs, Achievements } from './components/Views';
import { Attendance } from './components/Attendance';
import { Login } from './components/Login';
import { Profile } from './components/Profile';
import { Students } from './components/Students';
import { Menu } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<'STUDENT' | 'FACULTY'>('FACULTY');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If not authenticated, show Login screen
  if (!isAuthenticated) {
    return <Login onLogin={(r) => { setIsAuthenticated(true); setRole(r); }} />;
  }

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('dashboard');
    setRole('FACULTY'); // Reset to default
  };

  const renderContent = () => {
    // Dashboard split based on role
    if (activeTab === 'dashboard') {
      if (role === 'FACULTY') return <Dashboard />;
      // Pass a dummy Student ID for demo, or the actual one from login in a real app
      return <StudentDashboard studentId="demo" />;
    }

    switch (activeTab) {
      case 'students': return <Students />;
      case 'notes': return <Notes />;
      case 'marks': return <Marks />;
      case 'assignments': return <Assignments />;
      case 'attendance': return <Attendance />;
      case 'faculty': return <Faculty />;
      case 'labs': return <Labs />;
      case 'achievements': return <Achievements />;
      case 'contact': return <Contact />;
      case 'profile': return <Profile />;
      default: return role === 'FACULTY' ? <Dashboard /> : <StudentDashboard studentId="demo" />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        onLogout={handleLogout}
        role={role}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white border-b border-slate-200 lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="font-bold text-slate-800 text-lg">StudentSphere</div>
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-slate-500 hover:bg-slate-100"
            >
              <Menu size={24} />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto h-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
