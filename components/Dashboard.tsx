
import React, { useState, useEffect, useRef } from 'react';
import { GeminiService } from '../services/gemini';
import { db } from '../services/db';
import { UserProfile } from '../types';
import { Send, Bot, User, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export const Dashboard: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'model', text: 'Hello! I am your AI Assistant. How can I help you with your department tasks today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [studentCount, setStudentCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const loadData = async () => {
      const userProfile = await db.getUserProfile();
      setProfile(userProfile);
      
      const students = await db.getStudents();
      setStudentCount(students.length);
    };
    loadData();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Format history for Gemini
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await GeminiService.askTutor(userMsg.text, history);
    
    const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', text: responseText };
    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Faculty Dashboard</h1>
          <p className="text-slate-500">Welcome back, {profile?.name || 'Dr. Shreesha'}!</p>
        </div>
        {profile?.imageUrl && (
           <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-white shadow-md">
             <img src={profile.imageUrl} alt="Profile" className="w-full h-full object-cover" />
           </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Students</h3>
          <p className="mt-2 text-2xl font-semibold text-slate-800">{studentCount}</p>
          <p className="text-sm text-green-500 mt-1">Electronics & Comm.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">Class Average</h3>
          <p className="mt-2 text-2xl font-semibold text-slate-800">88.5%</p>
          <p className="text-sm text-green-500 mt-1">+2.4% from last term</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">Upcoming Lab</h3>
          <p className="mt-2 text-2xl font-semibold text-slate-800">VLSI Design</p>
          <p className="text-sm text-slate-500 mt-1">Tomorrow, 10:00 AM</p>
        </div>
      </div>

      {/* AI Chat Interface */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-white">
          <h2 className="font-semibold text-indigo-900 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-indigo-500" />
            AI Assistant
          </h2>
          <span className="text-xs text-indigo-400 bg-white px-2 py-1 rounded-full border border-indigo-100">Powered by Gemini</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ${msg.role === 'user' ? 'bg-blue-500 ml-2' : 'bg-indigo-500 mr-2'}`}>
                  {msg.role === 'user' ? (
                    profile?.imageUrl ? <img src={profile.imageUrl} className="w-full h-full object-cover" /> : <User size={16} className="text-white" />
                  ) : (
                    <Bot size={16} className="text-white" />
                  )}
                </div>
                <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-blue-500 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          {loading && (
             <div className="flex justify-start">
               <div className="flex items-center space-x-2 bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm">
                 <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                 <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                 <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-slate-100">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask for help with reports or grading..."
              className="flex-1 p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button 
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
