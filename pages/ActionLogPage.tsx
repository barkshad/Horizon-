
import React, { useState } from 'react';
import { ActionLog } from '../types';

interface ActionLogPageProps {
  logs: ActionLog[];
  setLogs: React.Dispatch<React.SetStateAction<ActionLog[]>>;
}

const ActionLogPage: React.FC<ActionLogPageProps> = ({ logs, setLogs }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    const newLog: ActionLog = {
      id: Math.random().toString(36).substr(2, 9),
      userId: 'u1',
      content,
      date: Date.now(),
      createdAt: Date.now(),
    };
    
    setLogs([newLog, ...logs]);
    setContent('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12">
      <header className="text-center">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Momentum Log</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">No streaks, no pressure. Just record what you did.</p>
      </header>

      <section className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all focus-within:shadow-indigo-100 focus-within:border-indigo-200 dark:focus-within:border-indigo-900/50">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-lg font-bold dark:text-white">What did you do today toward any dream?</label>
          <textarea 
            className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px] transition-all dark:text-white"
            placeholder="I spent an hour learning..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex justify-end">
            <button 
              type="submit" 
              disabled={!content.trim()}
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Log Progress
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-6">
        <h3 className="text-xl font-bold dark:text-white">Past Reflections</h3>
        <div className="space-y-4">
          {logs.map(log => (
            <div key={log.id} className="group flex gap-6 p-4 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-800 hover:bg-white dark:hover:bg-slate-900 transition-all">
              <div className="flex flex-col items-center flex-shrink-0 w-12 pt-1">
                <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                  {new Date(log.date).getDate()}
                </span>
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  {new Date(log.date).toLocaleDateString(undefined, { month: 'short' })}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{log.content}</p>
              </div>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="text-center py-20 text-slate-400 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
              Your journey is just beginning. Make your first entry above.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ActionLogPage;
