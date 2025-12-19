
import React, { useState } from 'react';
import { ActionLog } from '../types';
import { storageService } from '../services/storageService';
// Added Clock to the imports from lucide-react
import { PencilLine, Send, History as HistoryIcon, Rocket, Clock } from 'lucide-react';

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
    <div className="max-w-4xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="text-center space-y-2">
        <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Momentum Log</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Consistent small actions are the fuel for giant dreams.</p>
      </header>

      <section className="glass-card p-10 rounded-[3rem] shadow-2xl relative overflow-hidden focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all">
        <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600" />
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-3">
             <PencilLine size={24} className="text-indigo-500" />
             <label className="text-xl font-black dark:text-white tracking-tight">What did you build today?</label>
          </div>
          <textarea 
            className="w-full bg-slate-50 dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-700 focus:ring-0 focus:border-indigo-500 outline-none min-h-[160px] transition-all dark:text-white font-bold text-lg placeholder:text-slate-300 dark:placeholder:text-slate-600 resize-none shadow-inner"
            placeholder="I took a step toward..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex justify-end">
            <button 
              type="submit" 
              disabled={!content.trim() || loading}
              className="px-10 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-xl shadow-indigo-100 dark:shadow-none"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send size={20} />
              )}
              Log Momentum
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/40 rounded-2xl text-indigo-600 dark:text-indigo-400">
            <HistoryIcon size={24} />
          </div>
          <h3 className="text-2xl font-black dark:text-white tracking-tight">Your Action History</h3>
        </div>
        
        <div className="relative space-y-6">
          <div className="absolute left-10 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800 -z-10" />
          
          {logs.map((log, idx) => (
            <div key={log.id} className="group flex gap-8 items-start animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="flex-shrink-0 w-20 h-20 bg-white dark:bg-slate-900 rounded-[1.8rem] flex flex-col items-center justify-center border border-slate-200 dark:border-slate-800 shadow-sm group-hover:border-indigo-500/50 transition-all group-hover:scale-110">
                <span className="text-2xl font-black text-slate-800 dark:text-white leading-none">
                  {new Date(log.date).getDate()}
                </span>
                <span className="text-[10px] font-black uppercase text-indigo-500 tracking-widest mt-1">
                  {new Date(log.date).toLocaleDateString(undefined, { month: 'short' })}
                </span>
              </div>
              <div className="flex-1 glass-card p-8 rounded-[2rem] group-hover:bg-white dark:group-hover:bg-slate-800/80 transition-all">
                <p className="text-lg text-slate-700 dark:text-slate-300 font-bold leading-relaxed">{log.content}</p>
                <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <Clock size={12} className="text-indigo-400" />
                  <span>Logged at {new Date(log.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          ))}

          {logs.length === 0 && (
            <div className="text-center py-32 glass-card rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Rocket size={32} className="text-slate-300" />
              </div>
              <h4 className="text-2xl font-black dark:text-white mb-2">History starts with action.</h4>
              <p className="text-slate-500 font-bold italic">Write your first entry above to begin the legacy.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ActionLogPage;
