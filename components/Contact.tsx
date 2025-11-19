import React, { useState } from 'react';
import { db } from '../services/db';
import { Send, CheckCircle2 } from 'lucide-react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'IDLE' | 'SUBMITTING' | 'SUCCESS'>('IDLE');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('SUBMITTING');
    
    await db.saveContact({
      id: Date.now().toString(),
      ...formData,
      timestamp: Date.now()
    });

    setStatus('SUCCESS');
    setFormData({ name: '', email: '', message: '' });
    
    setTimeout(() => setStatus('IDLE'), 3000);
  };

  return (
    <div className="h-full max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Contact Administration</h1>
      <p className="text-slate-500 mb-8">Have a question about your courses or the platform? Send us a message.</p>

      {status === 'SUCCESS' ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center animate-in fade-in zoom-in">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="text-green-600 w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold text-green-900 mb-2">Message Sent!</h3>
          <p className="text-green-700">We have received your message and will get back to you shortly.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
              <input
                required
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                placeholder="John Doe"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Student Email</label>
              <input
                required
                type="email"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                placeholder="john.doe@university.edu"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
              <textarea
                required
                rows={5}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none"
                placeholder="How can we help you?"
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
              />
            </div>

            <button
              type="submit"
              disabled={status === 'SUBMITTING'}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center transition-colors disabled:opacity-70"
            >
              {status === 'SUBMITTING' ? (
                'Sending...'
              ) : (
                <>
                  <Send size={18} className="mr-2" /> Send Message
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-6 text-center">
            Note: Since this is a demo, messages are saved to your browser's local storage.
          </p>
        </form>
      )}
    </div>
  );
};