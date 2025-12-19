
import React from 'react';
import { Dream, Goal, ActionLog, GoalStatus } from '../types';
import StatCard from '../components/StatCard';

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
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Your Progress</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Focus on what matters most today.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          label="Active Dreams" 
          value={activeDreams} 
          colorClass="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>}
        />
        <StatCard 
          label="In Progress" 
          value={inProgressGoals} 
          colorClass="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard 
          label="Completed" 
          value={completedGoals} 
          colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard 
          label="Avg. Momentum" 
          value={`${avgProgress}%`} 
          colorClass="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold dark:text-white">Recent Activity</h3>
          </div>
          <div className="space-y-3">
            {logs.slice(0, 5).map(log => (
              <div key={log.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex gap-4">
                <div className="w-1 bg-indigo-500 rounded-full" />
                <div>
                  <p className="text-slate-700 dark:text-slate-300">{log.content}</p>
                  <p className="text-xs text-slate-500 mt-1">{new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            ))}
            {logs.length === 0 && (
              <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                <p className="text-slate-500">No recent activity logs.</p>
              </div>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-bold dark:text-white">Dream Health</h3>
          <div className="space-y-4">
            {dreams.slice(0, 3).map(dream => {
              const dreamGoals = goals.filter(g => g.dreamId === dream.id);
              const progress = dreamGoals.length > 0 
                ? Math.round(dreamGoals.reduce((acc, g) => acc + g.progress, 0) / dreamGoals.length) 
                : 0;
              return (
                <div key={dream.id} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold truncate dark:text-white">{dream.title}</span>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
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
