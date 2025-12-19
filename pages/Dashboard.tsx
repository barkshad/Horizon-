
import React from 'react';
import { Dream, Goal, ActionLog, GoalStatus } from '../types';
import StatCard from '../components/StatCard';
import { Star, Clock, CheckCircle2, TrendingUp, Calendar, Zap } from 'lucide-react';

interface DashboardProps {
  dreams: Dream[];
  goals: Goal[];
  logs: ActionLog[];
}

const Dashboard: React.FC<DashboardProps> = ({ dreams, goals, logs }) => {
  const activeDreams = dreams.filter(d => !d.isArchived).length;
  const completedGoals = goals.filter(g => g.status === GoalStatus.COMPLETED).length;
  const inProgressGoals = goals.filter(g => g.status === GoalStatus.IN_PROGRESS).length;
  
  const avgProgress = goals.length > 0 
    ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length) 
    : 0;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Your Horizon</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Today is a beautiful day to build your future.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl text-sm font-bold border border-indigo-100 dark:border-indigo-800/50">
            <Calendar size={16} />
            <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Active Dreams" 
          value={activeDreams} 
          colorClass="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
          icon={<Star size={24} />}
        />
        <StatCard 
          label="In Progress" 
          value={inProgressGoals} 
          colorClass="bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
          icon={<Clock size={24} />}
        />
        <StatCard 
          label="Completed" 
          value={completedGoals} 
          colorClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
          icon={<CheckCircle2 size={24} />}
        />
        <StatCard 
          label="Overall Momentum" 
          value={`${avgProgress}%`} 
          colorClass="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
          icon={<TrendingUp size={24} />}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <section className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black dark:text-white tracking-tight flex items-center gap-2">
              <Zap size={22} className="text-indigo-500" />
              Latest Momentum
            </h3>
          </div>
          <div className="grid gap-4">
            {logs.slice(0, 5).map((log, idx) => (
              <div 
                key={log.id} 
                className="glass-card p-5 rounded-3xl flex gap-5 group hover:bg-white dark:hover:bg-slate-800/80 transition-all"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex-shrink-0 w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-black text-slate-400 leading-none mb-1">{new Date(log.date).toLocaleDateString(undefined, { month: 'short' })}</span>
                  <span className="text-lg font-black text-slate-800 dark:text-white leading-none">{new Date(log.date).getDate()}</span>
                </div>
                <div>
                  <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{log.content}</p>
                  <p className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-widest">{new Date(log.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            ))}
            {logs.length === 0 && (
              <div className="text-center py-20 glass-card rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                <p className="text-slate-400 font-bold">No entries yet. Start with a small win today.</p>
              </div>
            )}
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-black dark:text-white tracking-tight">Visions in Focus</h3>
          <div className="space-y-4">
            {dreams.length === 0 && (
              <div className="p-10 text-center glass-card rounded-3xl">
                <p className="text-slate-400 font-bold italic">No dreams added yet.</p>
              </div>
            )}
            {dreams.slice(0, 4).map(dream => {
              const dreamGoals = goals.filter(g => g.dreamId === dream.id);
              const progress = dreamGoals.length > 0 
                ? Math.round(dreamGoals.reduce((acc, g) => acc + g.progress, 0) / dreamGoals.length) 
                : 0;
              return (
                <div key={dream.id} className="glass-card p-6 rounded-3xl group cursor-pointer hover:border-indigo-500/50 transition-all">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">{dream.category}</span>
                    <span className="text-xs font-black dark:text-white">{progress}%</span>
                  </div>
                  <h4 className="text-lg font-bold truncate dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{dream.title}</h4>
                  <div className="mt-4 w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
