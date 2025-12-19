
import React, { useState } from 'react';
import { Dream, Goal, DreamCategory, TimeHorizon, GoalStatus } from '../types';
import { storageService } from '../services/storageService';

interface DreamsPageProps {
  dreams: Dream[];
  setDreams: React.Dispatch<React.SetStateAction<Dream[]>>;
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
  userId: string;
}

const DreamsPage: React.FC<DreamsPageProps> = ({ dreams, setDreams, goals, setGoals, userId }) => {
  const [selectedDreamId, setSelectedDreamId] = useState<string | null>(null);
  const [isAddingDream, setIsAddingDream] = useState(false);
  const [newDream, setNewDream] = useState({ title: '', description: '', category: DreamCategory.PERSONAL, horizon: TimeHorizon.ONE_YEAR });

  const activeDreams = dreams.filter(d => !d.isArchived);
  const selectedDream = dreams.find(d => d.id === selectedDreamId);

  const handleAddDream = async (e: React.FormEvent) => {
    e.preventDefault();
    const dreamData: Omit<Dream, 'id'> = {
      ...newDream,
      userId,
      isArchived: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const id = await storageService.addDream(dreamData);
    setDreams([{ ...dreamData, id }, ...dreams]);
    setIsAddingDream(false);
    setNewDream({ title: '', description: '', category: DreamCategory.PERSONAL, horizon: TimeHorizon.ONE_YEAR });
  };

  const handleAddGoal = async (dreamId: string) => {
    const title = prompt('Enter goal title:');
    if (!title) return;
    const goalData: Omit<Goal, 'id'> = {
      dreamId,
      userId,
      title,
      status: GoalStatus.NOT_STARTED,
      progress: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const id = await storageService.addGoal(goalData);
    setGoals([...goals, { ...goalData, id }]);
  };

  const updateGoalProgress = async (goalId: string, progress: number) => {
    const newStatus = progress === 100 ? GoalStatus.COMPLETED : progress > 0 ? GoalStatus.IN_PROGRESS : GoalStatus.NOT_STARTED;
    const updates = { progress, status: newStatus, updatedAt: Date.now() };
    
    // Optimistic update
    setGoals(prev => prev.map(g => g.id === goalId ? { ...g, ...updates } : g));
    await storageService.updateGoal(goalId, updates);
  };

  if (selectedDreamId && selectedDream) {
    const dreamGoals = goals.filter(g => g.dreamId === selectedDream.id);
    return (
      <div className="space-y-6">
        <button 
          onClick={() => setSelectedDreamId(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Dreams
        </button>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 rounded-full text-xs font-bold uppercase tracking-wider">
                  {selectedDream.category}
                </span>
                <span className="text-slate-400 text-sm">{selectedDream.horizon} Horizon</span>
              </div>
              <h2 className="text-3xl font-bold dark:text-white">{selectedDream.title}</h2>
              <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">{selectedDream.description}</p>
            </div>
            <div className="flex-shrink-0">
               <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-slate-500 font-bold uppercase">Overall Completion</p>
                    <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                      {dreamGoals.length > 0 ? Math.round(dreamGoals.reduce((a, b) => a + b.progress, 0) / dreamGoals.length) : 0}%
                    </p>
                  </div>
               </div>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold dark:text-white">Active Goals</h3>
              <button 
                onClick={() => handleAddGoal(selectedDream.id)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm font-semibold"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                Add Goal
              </button>
            </div>

            <div className="space-y-4">
              {dreamGoals.map(goal => (
                <div key={goal.id} className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700/50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold dark:text-white">{goal.title}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          goal.status === GoalStatus.COMPLETED ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                          goal.status === GoalStatus.IN_PROGRESS ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                          'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                        }`}>
                          {goal.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <div className="w-full sm:w-48">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-slate-500 font-bold">Progress</span>
                        <span className="text-xs font-black dark:text-white">{goal.progress}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={goal.progress} 
                        onChange={(e) => updateGoalProgress(goal.id, parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {dreamGoals.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-slate-500 italic">No goals defined yet. Break your dream into actionable steps.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Life Dreams</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">The north stars guiding your journey.</p>
        </div>
        <button 
          onClick={() => setIsAddingDream(true)}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 flex items-center gap-2 font-bold"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          Add New Dream
        </button>
      </header>

      {isAddingDream && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border-2 border-indigo-100 dark:border-indigo-900/30 shadow-xl">
          <form onSubmit={handleAddDream} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Dream Title</label>
                <input 
                  required
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                  value={newDream.title}
                  onChange={(e) => setNewDream({ ...newDream, title: e.target.value })}
                  placeholder="e.g., Live by the ocean"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Category</label>
                <select 
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                  value={newDream.category}
                  onChange={(e) => setNewDream({ ...newDream, category: e.target.value as DreamCategory })}
                >
                  {Object.values(DreamCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Description (Why does this matter?)</label>
              <textarea 
                rows={2}
                className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                value={newDream.description}
                onChange={(e) => setNewDream({ ...newDream, description: e.target.value })}
                placeholder="I want to wake up to the sound of waves because..."
              />
            </div>
            <div className="flex items-center gap-4">
               <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">Create Dream</button>
               <button type="button" onClick={() => setIsAddingDream(false)} className="text-slate-500 hover:text-slate-800 dark:hover:text-white font-medium transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeDreams.map(dream => {
          const dreamGoals = goals.filter(g => g.dreamId === dream.id);
          const progress = dreamGoals.length > 0 
            ? Math.round(dreamGoals.reduce((acc, g) => acc + g.progress, 0) / dreamGoals.length) 
            : 0;
          return (
            <div 
              key={dream.id} 
              onClick={() => setSelectedDreamId(dream.id)}
              className="group bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </div>
              <div className="mb-4">
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 rounded-md text-[10px] font-bold uppercase tracking-tight">
                  {dream.category}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors dark:text-white">
                {dream.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-6">
                {dream.description}
              </p>
              
              <div className="mt-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-400">{dreamGoals.length} Goals</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-white">{progress}% Complete</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DreamsPage;
