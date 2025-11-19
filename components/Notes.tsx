import React, { useEffect, useState } from 'react';
import { db } from '../services/db';
import { GeminiService } from '../services/gemini';
import { Note } from '../types';
import { Plus, Trash2, FileText, Loader2 } from 'lucide-react';

export const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summaryId, setSummaryId] = useState<string | null>(null);
  const [summaryText, setSummaryText] = useState<string>('');
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const fetchData = async () => {
    const data = await db.getNotes();
    setNotes(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddNote = async () => {
    if (!title || !content) return;
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      date: new Date().toISOString().split('T')[0],
      tags: ['General']
    };
    await db.addNote(newNote);
    setTitle('');
    setContent('');
    setIsCreating(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    await db.deleteNote(id);
    fetchData();
  };

  const handleSummarize = async (id: string, text: string) => {
    setSummaryId(id);
    setLoadingSummary(true);
    const result = await GeminiService.summarizeText(text);
    setSummaryText(result);
    setLoadingSummary(false);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">My Notes</h1>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {isCreating ? 'Cancel' : <><Plus size={18} className="mr-2" /> New Note</>}
        </button>
      </div>

      {isCreating && (
        <div className="mb-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in slide-in-from-top-4">
          <input
            className="w-full text-lg font-semibold mb-4 p-2 border-b border-slate-200 focus:outline-none focus:border-blue-500"
            placeholder="Note Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <textarea
            className="w-full h-32 p-2 mb-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Start typing your note here..."
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          <button
            onClick={handleAddNote}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            Save Note
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto pb-6">
        {notes.map(note => (
          <div key={note.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-50 rounded-lg mr-3">
                  <FileText className="text-blue-500 h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-slate-800">{note.title}</h3>
                  <span className="text-xs text-slate-400">{note.date}</span>
                </div>
              </div>
              <button onClick={() => handleDelete(note.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
            
            <p className="text-slate-600 text-sm line-clamp-4 flex-grow mb-4">{note.content}</p>
            
            {summaryId === note.id && (
              <div className="mb-4 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wide mb-2">AI Summary</h4>
                {loadingSummary ? (
                  <div className="flex items-center text-indigo-500 text-sm">
                    <Loader2 className="animate-spin mr-2 h-4 w-4" /> Generating...
                  </div>
                ) : (
                  <p className="text-sm text-indigo-900 whitespace-pre-line leading-relaxed">{summaryText}</p>
                )}
              </div>
            )}

            <div className="mt-auto pt-4 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => handleSummarize(note.id, note.content)}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
              >
                {summaryId === note.id ? 'Refresh Summary' : 'Summarize with AI'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};