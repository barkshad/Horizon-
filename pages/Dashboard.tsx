
import React, { useMemo } from 'react';
import { Dream, Goal, ActionLog, GoalStatus } from '../types';
import { Zap, Target, Star, Trophy, ArrowRight, Quote, Sun, Moon, Coffee } from 'lucide-react';
import { getRandomQuote } from '../services/quotesService';
import { DashboardSkeleton } from '../components/Skeletons';

interface DashboardProps {
  dreams: Dream[];
  goals: Goal[];
  logs: ActionLog[];
  isLoading?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ dreams, goals, logs, isLoading }) => {
  const quote = useMemo(() => getRandomQuote(), []);
  
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good Morning", icon: Coffee };
    if (hour < 18) return { text: "Good Afternoon", icon: Sun };
    return { text: "Good Evening", icon: Moon };
  }, []);

  const activeDreams = dreams.filter(d => !d.isArchived).length;
  const completedGoals = goals.filter(g => g.status === GoalStatus.COMPLETED).length;
  const avgProgress = goals.length > 0 
    ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length) 
    : 0;

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-black text-xs uppercase tracking-[0.2em] mb-1">
            <greeting.icon size={12} />
            {greeting.text}
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tighter">Your Focus</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Consistency is the bridge between goals and accomplishment.</p>
        </div>
        
        <div className="pro-card p-5 rounded-3xl flex items-start gap-4 max-w-sm border-teal-500/10 dark:bg-slate-900/80">
          <Quote size={20} className="text-teal-600 dark:text-teal-400 flex-shrink-0 mt-1 opacity-50" />
          <div className="space-y-2">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300 italic leading-relaxed">"{quote.text}"</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">— {quote.author}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Visions', value: activeDreams, icon: Star, color: 'text-teal-500 bg-teal-50 dark:bg-teal-900/20' },
          { label: 'Completed', value: completedGoals, icon: Trophy, color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
          { label: 'Momentum', value: `${avgProgress}%`, icon: Zap, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' },
          { label: 'Pending', value: goals.filter(g => g.status !== GoalStatus.COMPLETED).length, icon: Target, color: 'text-rose-500 bg-rose-50 dark:bg-rose-900/20' }
        ].map((stat, i) => (
          <div key={i} className="pro-card p-5 rounded-2xl flex flex-col justify-between h-32 group cursor-default">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color} transition-transform group-hover:scale-110 duration-500`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-black dark:text-white leading-none tracking-tight">{stat.value}</p>
              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
        <section className="pro-card p-6 rounded-3xl space-y-5">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-lg flex items-center gap-2">
              <Zap size={18} className="text-teal-500" />
              Latest Action
            </h3>
            <button className="text-xs font-black text-teal-600 dark:text-teal-400 uppercase tracking-widest hover:underline flex items-center gap-1">History <ArrowRight size={12} /></button>
          </div>
          <div className="space-y-3">
            {logs.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-sm text-slate-400 font-bold italic">No entries yet. Start small.</p>
              </div>
            ) : (
              logs.slice(0, 3).map(log => (
                <div key={log.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/50 transition-all hover:bg-white dark:hover:bg-slate-800">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-relaxed">{log.content}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="pro-card p-6 rounded-3xl space-y-5">
          <h3 className="font-extrabold text-lg flex items-center gap-2">
             <Target size={18} className="text-amber-500" />
             Core Visions
          </h3>
          <div className="space-y-5">
            {dreams.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-sm text-slate-400 font-bold italic">No active visions.</p>
              </div>
            ) : (
              dreams.slice(0, 3).map(dream => {
                const dGoals = goals.filter(g => g.dreamId === dream.id);
                const progress = dGoals.length > 0 ? Math.round(dGoals.reduce((a, b) => a + b.progress, 0) / dGoals.length) : 0;
                return (
                  <div key={dream.id} className="space-y-2 group cursor-pointer">
                    <div className="flex justify-between items-end">
                      <p className="font-extrabold text-sm dark:text-white truncate pr-4 group-hover:text-teal-500 transition-colors">{dream.title}</p>
                      <span className="text-xs font-black text-teal-500">{progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden p-0.5 shadow-inner">
                      <div 
                        className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${progress}%` }} 
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
