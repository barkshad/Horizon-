
import React, { useState } from 'react';
import { ActionLog } from '../types';
import { storageService } from '../services/storageService';
import { Send, Clock, Sparkles } from 'lucide-react';

interface ActionLogPageProps {
  logs: ActionLog[];
  setLogs: React.Dispatch<React.SetStateAction<ActionLog[]>>;
  userId: string;
}

const ActionLogPage: React.FC<ActionLogPageProps> = ({ logs, setLogs, userId }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setLoading(true);
    const logData: Omit<ActionLog, 'id'> = {
      userId,
      content,
      date: Date.now(),
      createdAt: Date.now(),
    };
    
    const id = await storageService.addLog(logData);
    setLogs([{ ...logData, id }, ...logs]);
    setContent('');
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-full space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h2 className="text-2xl font-black dark:text-white">Momentum Feed</h2>
          <p className="text-sm text-slate-500 font-medium">A conversation with your progress.</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-600">
          <Sparkles size={20} />
        </div>
      </header>

      <div className="flex-1 space-y-6">
        {logs.map((log, idx) => (
          <div key={log.id} className={`flex ${idx % 2 === 0 ? 'justify-start' : 'justify-end'} animate-in fade-in duration-300`}>
            <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
              idx % 2 === 0 
                ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 bubble-left border border-slate-100 dark:border-slate-700' 
                : 'bg-teal-600 text-white bubble-right'
            }`}>
              <p className="text-sm font-medium leading-relaxed">{log.content}</p>
              <div className={`mt-2 flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter ${
                idx % 2 === 0 ? 'text-slate-400' : 'text-teal-100'
              }`}>
                <Clock size={10} />
                {new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                <span className="mx-1">•</span>
                {new Date(log.date).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="py-20 text-center text-slate-400">
            <p className="font-bold">No logs yet. Take the first step today.</p>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 lg:bottom-6 pt-4 pb-2 bg-slate-50 dark:bg-slate-950">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input 
            className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-teal-500/20 outline-none dark:text-white placeholder:text-slate-400"
            placeholder="What did you achieve today?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button 
            type="submit"
            disabled={!content.trim() || loading}
            className="w-14 h-14 bg-teal-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-teal-900/10 hover:bg-teal-700 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={22} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ActionLogPage;
