
import React, { useState } from 'react';
import { Dream, Goal, DreamCategory, TimeHorizon, GoalStatus } from '../types';
import { storageService } from '../services/storageService';
import { Plus, ArrowLeft, MoreHorizontal, Check, TrendingUp, Info } from 'lucide-react';

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
    const title = prompt('Define a specific, measurable step:');
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
    setGoals(prev => prev.map(g => g.id === goalId ? { ...g, ...updates } : g));
    await storageService.updateGoal(goalId, updates);
  };

  if (selectedDreamId && selectedDream) {
    const dreamGoals = goals.filter(g => g.dreamId === selectedDream.id);
    const overallProgress = dreamGoals.length > 0 ? Math.round(dreamGoals.reduce((a, b) => a + b.progress, 0) / dreamGoals.length) : 0;

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <button 
          onClick={() => setSelectedDreamId(null)}
          className="group flex items-center gap-3 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold transition-all"
        >
          <div className="p-2 bg-white dark:bg-slate-800 rounded-xl group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors border border-slate-200 dark:border-slate-700">
            <ArrowLeft size={18} />
          </div>
          Back to Visions
        </button>

        <div className="glass-card rounded-[2.5rem] p-8 md:p-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] -z-10" />
          
          <div className="flex flex-col xl:flex-row gap-12">
            <div className="flex-1 space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                <span className="px-4 py-1.5 bg-indigo-600 text-white rounded-full text-xs font-black uppercase tracking-widest">
                  {selectedDream.category}
                </span>
                <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-tighter">
                  <TrendingUp size={14} />
                  {selectedDream.horizon} Horizon
                </div>
              </div>
              <h2 className="text-5xl font-black dark:text-white tracking-tighter leading-none">{selectedDream.title}</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-2xl">{selectedDream.description}</p>
            </div>

            <div className="w-full xl:w-64">
              <div className="glass-card bg-white/40 dark:bg-slate-800/40 p-6 rounded-[2rem] border-slate-200/50 dark:border-slate-700/50">
                <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">Master Progress</p>
                <div className="relative w-full aspect-square flex items-center justify-center">
                   <svg className="w-full h-full transform -rotate-90">
                      <circle cx="50%" cy="50%" r="45%" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-800" />
                      <circle cx="50%" cy="50%" r="45%" fill="transparent" stroke="currentColor" strokeWidth="8" 
                        strokeDasharray="283" strokeDashoffset={`${283 - (283 * overallProgress) / 100}`}
                        strokeLinecap="round" className="text-indigo-600 dark:text-indigo-400 transition-all duration-1000 ease-out" />
                   </svg>
                   <span className="absolute text-4xl font-black dark:text-white">{overallProgress}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black dark:text-white tracking-tight flex items-center gap-3">
                <Check size={24} className="text-emerald-500" />
                Actionable Steps
              </h3>
              <button 
                onClick={() => handleAddGoal(selectedDream.id)}
                className="px-6 py-3 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 text-sm font-black shadow-lg shadow-indigo-200 dark:shadow-none"
              >
                <Plus size={18} />
                Add Goal
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dreamGoals.map(goal => (
                <div key={goal.id} className="glass-card bg-white/20 dark:bg-slate-800/20 p-6 rounded-[1.8rem] group hover:bg-white dark:hover:bg-slate-800 transition-all border border-slate-200/40 dark:border-slate-700/40">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <h4 className="font-extrabold text-lg dark:text-white pr-4 leading-snug">{goal.title}</h4>
                      <span className={`flex-shrink-0 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        goal.status === GoalStatus.COMPLETED ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        goal.status === GoalStatus.IN_PROGRESS ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' :
                        'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}>
                        {goal.status}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                        <span>Completion</span>
                        <span className="text-slate-900 dark:text-white">{goal.progress}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={goal.progress} 
                        onChange={(e) => updateGoalProgress(goal.id, parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-indigo-600"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {dreamGoals.length === 0 && (
                <div className="md:col-span-2 text-center py-16 glass-card rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                  <Info size={32} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-400 font-bold italic">Small steps lead to giant leaps. Add your first goal.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Your Visions</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">What would you attempt if you knew you couldn't fail?</p>
        </div>
        <button 
          onClick={() => setIsAddingDream(true)}
          className="px-8 py-4 bg-indigo-600 text-white rounded-[1.2rem] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-100 dark:shadow-none flex items-center gap-3 font-black text-sm"
        >
          <Plus size={20} />
          Create New Dream
        </button>
      </header>

      {isAddingDream && (
        <div className="glass-card p-8 rounded-[2rem] border-2 border-indigo-500/20 shadow-2xl animate-in zoom-in-95 duration-300">
          <form onSubmit={handleAddDream} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Dream Title</label>
                <input 
                  required
                  className="w-full px-5 py-4 rounded-[1.2rem] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all dark:text-white font-bold"
                  value={newDream.title}
                  onChange={(e) => setNewDream({ ...newDream, title: e.target.value })}
                  placeholder="e.g., Retire by 40"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Category</label>
                <select 
                  className="w-full px-5 py-4 rounded-[1.2rem] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all dark:text-white font-bold appearance-none cursor-pointer"
                  value={newDream.category}
                  onChange={(e) => setNewDream({ ...newDream, category: e.target.value as DreamCategory })}
                >
                  {Object.values(DreamCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">The Vision Statement (Why?)</label>
              <textarea 
                rows={3}
                className="w-full px-5 py-4 rounded-[1.2rem] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all dark:text-white font-bold resize-none"
                value={newDream.description}
                onChange={(e) => setNewDream({ ...newDream, description: e.target.value })}
                placeholder="Paint the picture of your future..."
              />
            </div>
            <div className="flex items-center gap-6 pt-2">
               <button type="submit" className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:scale-105 transition-all">Launch Vision</button>
               <button type="button" onClick={() => setIsAddingDream(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white font-black text-sm transition-all">Nevermind</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8 pb-20">
        {activeDreams.length === 0 && !isAddingDream && (
          <div className="col-span-full text-center py-40 glass-card rounded-[3rem]">
            <h3 className="text-3xl font-black dark:text-white mb-2">A blank canvas awaits.</h3>
            <p className="text-slate-500 font-bold italic">Start by dreaming big.</p>
          </div>
        )}
        {activeDreams.map((dream, idx) => {
          const dreamGoals = goals.filter(g => g.dreamId === dream.id);
          const progress = dreamGoals.length > 0 ? Math.round(dreamGoals.reduce((acc, g) => acc + g.progress, 0) / dreamGoals.length) : 0;
          return (
            <div 
              key={dream.id} 
              onClick={() => setSelectedDreamId(dream.id)}
              className="group glass-card rounded-[2.5rem] p-8 hover:bg-white dark:hover:bg-slate-800/80 hover:translate-y-[-8px] transition-all cursor-pointer relative overflow-hidden"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/5 group-hover:bg-indigo-500/10 rounded-full blur-3xl transition-all" />
              
              <div className="mb-8">
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200/50 dark:border-slate-700/50 transition-all group-hover:bg-indigo-600 group-hover:text-white">
                  {dream.category}
                </span>
              </div>
              
              <h3 className="text-3xl font-black mb-4 dark:text-white tracking-tighter group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-none">
                {dream.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 line-clamp-2 font-medium leading-relaxed mb-10">
                {dream.description}
              </p>
              
              <div className="mt-auto space-y-4">
                <div className="flex items-center justify-between text-xs font-black tracking-widest uppercase">
                  <span className="text-slate-400">{dreamGoals.length} Milestones</span>
                  <span className="text-slate-900 dark:text-white">{progress}% Vision Map</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden shadow-inner p-0.5">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 h-full rounded-full transition-all duration-1000 ease-out"
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
