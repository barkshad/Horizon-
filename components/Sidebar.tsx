
import React from 'react';
import { User } from '../types';
import { LayoutDashboard, Target, History, LogOut, Smartphone, Sparkles, Moon, Sun } from 'lucide-react';

interface SidebarProps {
  activeTab: 'dashboard' | 'dreams' | 'logs';
  setActiveTab: (tab: 'dashboard' | 'dreams' | 'logs') => void;
  user: User;
  onLogout: () => void;
  onInstall: () => void;
  isInstallable: boolean;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  user, 
  onLogout, 
  onInstall, 
  isInstallable,
  isDarkMode,
  toggleTheme 
}) => {
  const NavItem = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
        activeTab === id 
          ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-sm border border-slate-200 dark:border-slate-700' 
          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
      }`}
    >
      <Icon size={20} className={activeTab === id ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
      <span className="font-bold tracking-tight">{label}</span>
    </button>
  );

  return (
    <aside className="hidden lg:flex flex-col w-72 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800/50 p-8 h-screen sticky top-0">
      <div className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-200 dark:shadow-none animate-float">
            <Sparkles size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tighter text-slate-900 dark:text-white">Horizon</h1>
        </div>
        <button 
          onClick={toggleTheme}
          className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:scale-110 active:scale-95 transition-all"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <nav className="flex-1 space-y-3">
        <NavItem id="dashboard" label="Dashboard" icon={LayoutDashboard} />
        <NavItem id="dreams" label="Dreams" icon={Target} />
        <NavItem id="logs" label="Momentum" icon={History} />

        <div className="pt-10 space-y-4">
          <p className="px-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Application</p>
          <button 
            onClick={onInstall}
            className={`w-full group relative flex items-center gap-3 px-4 py-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-teal-600 dark:to-teal-700 text-white font-bold text-sm shadow-xl transition-all hover:scale-[1.03] active:scale-[0.98] ${!isInstallable && 'opacity-50 grayscale'}`}
          >
            <div className="p-2 bg-white/10 rounded-lg">
              <Smartphone size={16} />
            </div>
            <span>Get Native App</span>
            {isInstallable && <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900" />}
          </button>
        </div>
      </nav>

      <div className="mt-auto pt-8 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4 mb-6 p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
          <div className="w-11 h-11 rounded-xl bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center text-teal-600 dark:text-teal-400 font-black overflow-hidden shadow-inner">
            {user.photoURL ? (
              <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
            ) : (
              user.displayName.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate dark:text-white leading-tight">{user.displayName}</p>
            <p className="text-[11px] text-slate-500 font-medium truncate uppercase tracking-tighter">Registered Explorer</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-2xl transition-all"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
