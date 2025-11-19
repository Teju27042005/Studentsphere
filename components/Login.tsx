
import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ArrowLeft, CheckCircle2, GraduationCap, Users } from 'lucide-react';

interface LoginProps {
  onLogin: (role: 'STUDENT' | 'FACULTY') => void;
}

type ViewState = 'login' | 'forgot' | 'reset-sent';
type Role = 'STUDENT' | 'FACULTY';

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [view, setView] = useState<ViewState>('login');
  const [role, setRole] = useState<Role>('FACULTY');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usn, setUsn] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API verification delay
    setTimeout(() => {
      if (role === 'FACULTY') {
        if (email && password) {
          onLogin('FACULTY');
        } else {
          setError('Please enter both email and password');
          setLoading(false);
        }
      } else {
        if (usn && password) {
           onLogin('STUDENT');
        } else {
          setError('Please enter USN and password');
          setLoading(false);
        }
      }
    }, 800);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const id = role === 'FACULTY' ? email : usn;
    
    if (!id) {
      setError(`Please enter your ${role === 'FACULTY' ? 'Email' : 'USN'}`);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setView('reset-sent');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 z-0"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 mb-4 shadow-lg shadow-blue-500/30">
              <span className="text-3xl">🎓</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-wide">StudentSphere</h1>
            <p className="text-slate-400 mt-2 text-sm">Your Academic Excellence Hub</p>
          </div>
        </div>
        
        <div className="p-8 pt-6">
          {view === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-5 animate-in slide-in-from-right-4 duration-300">
              
              {/* Role Toggle */}
              <div className="flex p-1 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setRole('FACULTY')}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center ${role === 'FACULTY' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Users size={16} className="mr-2" /> Faculty
                </button>
                <button
                  type="button"
                  onClick={() => setRole('STUDENT')}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center ${role === 'STUDENT' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <GraduationCap size={16} className="mr-2" /> Student
                </button>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 flex items-center animate-in slide-in-from-top-2">
                  <span className="mr-2">⚠️</span> {error}
                </div>
              )}
              
              {role === 'FACULTY' ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                      placeholder="faculty@sambhram.edu"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Student USN</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <GraduationCap className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      value={usn}
                      onChange={(e) => setUsn(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                      placeholder="1CR21EC001"
                    />
                  </div>
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
                  <button 
                    type="button"
                    onClick={() => { setError(''); setView('forgot'); }}
                    className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
                >
                  {loading ? 'Authenticating...' : (
                    <>
                      Sign In <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {view === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-5 animate-in slide-in-from-right-4 duration-300">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-slate-800">Reset Password</h3>
                <p className="text-sm text-slate-500">Enter your {role === 'FACULTY' ? 'Email' : 'USN'} to receive a reset link.</p>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 flex items-center">
                  <span className="mr-2">⚠️</span> {error}
                </div>
              )}
              
              {role === 'FACULTY' ? (
                 <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                      placeholder="student@university.edu"
                    />
                  </div>
                </div>
              ) : (
                 <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Student USN</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <GraduationCap className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      value={usn}
                      onChange={(e) => setUsn(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                      placeholder="1CR21EC..."
                    />
                  </div>
                </div>
              )}

              <div className="pt-2 space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
                
                <button
                  type="button"
                  onClick={() => { setError(''); setView('login'); }}
                  className="w-full flex items-center justify-center py-3 px-4 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sign In
                </button>
              </div>
            </form>
          )}

          {view === 'reset-sent' && (
             <div className="text-center space-y-6 animate-in zoom-in duration-300">
               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                 <CheckCircle2 size={32} />
               </div>
               
               <div>
                 <h3 className="text-lg font-semibold text-slate-800">Request Received</h3>
                 <p className="text-sm text-slate-500 mt-2">
                   If the account exists, a reset link has been sent to the registered contact method.
                 </p>
               </div>

               <button
                  type="button"
                  onClick={() => { 
                    setEmail(''); 
                    setPassword('');
                    setView('login'); 
                  }}
                  className="w-full flex items-center justify-center py-3.5 px-4 border border-slate-200 rounded-lg shadow-sm text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all"
                >
                  Return to Sign In
                </button>
             </div>
          )}

          {view === 'login' && (
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400">
                Demo Access: Enter any value to login.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
