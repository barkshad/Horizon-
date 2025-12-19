
import React, { useMemo } from 'react';
import { Dream, Goal, ActionLog, GoalStatus } from '../types';
import { Zap, Target, Star, Trophy, ArrowRight, Quote } from 'lucide-react';
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
  
  const activeDreams = dreams.filter(d => !d.isArchived).length;
  const completedGoals = goals.filter(g => g.status === GoalStatus.COMPLETED).length;
  const avgProgress = goals.length > 0 
    ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length) 
    : 0;

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Today's Focus</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Progress is built one decision at a time.</p>
        </div>
        
        <div className="bg-slate-100 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-3 max-w-sm">
          <Quote size={16} className="text-teal-600 flex-shrink-0 mt-1" />
          <div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 italic leading-snug">"{quote.text}"</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">— {quote.author}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Visions', value: activeDreams, icon: Star, color: 'text-teal-500 bg-teal-50 dark:bg-teal-900/20' },
          { label: 'Completed', value: completedGoals, icon: Trophy, color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
          { label: 'Momentum', value: `${avgProgress}%`, icon: Zap, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' },
          { label: 'Active', value: goals.filter(g => g.status !== GoalStatus.COMPLETED).length, icon: Target, color: 'text-rose-500 bg-rose-50 dark:bg-rose-900/20' }
        ].map((stat, i) => (
          <div key={i} className="pro-card p-5 rounded-2xl flex flex-col justify-between h-32 hover:scale-[1.02] active:scale-[0.98]">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-black dark:text-white leading-none">{stat.value}</p>
              <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="pro-card p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-lg flex items-center gap-2">
              <Zap size={18} className="text-teal-500" />
              Recent Momentum
            </h3>
            <button className="text-xs font-bold text-teal-600 flex items-center gap-1 hover:underline">View All <ArrowRight size={12} /></button>
          </div>
          <div className="space-y-3">
            {logs.length === 0 ? (
              <p className="text-sm text-slate-400 font-medium italic py-4">No momentum logs yet...</p>
            ) : (
              logs.slice(0, 3).map(log => (
                <div key={log.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors hover:bg-white dark:hover:bg-slate-800">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">{log.content}</p>
                  <span className="text-[10px] font-black text-slate-400 uppercase mt-2 block tracking-widest">{new Date(log.date).toLocaleDateString()}</span>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="pro-card p-6 rounded-2xl space-y-4">
          <h3 className="font-extrabold text-lg">Top Visions</h3>
          <div className="space-y-4">
            {dreams.length === 0 ? (
              <p className="text-sm text-slate-400 font-medium italic py-4">Add your first vision in the Visions tab...</p>
            ) : (
              dreams.slice(0, 3).map(dream => {
                const dGoals = goals.filter(g => g.dreamId === dream.id);
                const progress = dGoals.length > 0 ? Math.round(dGoals.reduce((a, b) => a + b.progress, 0) / dGoals.length) : 0;
                return (
                  <div key={dream.id} className="space-y-2 group cursor-pointer">
                    <div className="flex justify-between items-end">
                      <p className="font-bold text-sm dark:text-white truncate pr-4 group-hover:text-teal-500 transition-colors">{dream.title}</p>
                      <span className="text-xs font-black text-teal-500">{progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-teal-500 rounded-full transition-all duration-1000 ease-out" 
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
