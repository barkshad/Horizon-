
import React from 'react';
import { User } from '../types';
import { LogOut, Settings, Bell, Shield, HelpCircle, User as UserIcon, Moon, Sun } from 'lucide-react';

interface ProfilePageProps {
  user: User;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onLogout, isDarkMode, toggleTheme }) => {
  const options = [
    { icon: Settings, label: 'Preferences', desc: 'Theme, Language, Regional' },
    { icon: Bell, label: 'Notifications', desc: 'Reminders, Milestone updates' },
    { icon: Shield, label: 'Privacy & Security', desc: 'Password, Biometric, RLS' },
    { icon: HelpCircle, label: 'Help & Support', desc: 'FAQs, User guide, Contact' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-2xl mx-auto">
      <header className="flex flex-col items-center text-center py-10">
        <div className="relative group">
          <div className="w-28 h-28 rounded-[2.5rem] bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-4xl font-black text-teal-600 border-4 border-white dark:border-slate-900 shadow-2xl overflow-hidden mb-6 transition-transform group-hover:scale-105 duration-500">
            {user.photoURL ? <img src={user.photoURL} className="w-full h-full object-cover" /> : user.displayName.charAt(0)}
          </div>
          <div className="absolute -bottom-2 -right-2 p-3 bg-teal-600 rounded-2xl text-white shadow-xl shadow-teal-900/20 border-2 border-white dark:border-slate-900">
            <UserIcon size={16} />
          </div>
        </div>
        <h2 className="text-3xl font-black dark:text-white tracking-tight">{user.displayName}</h2>
        <p className="text-slate-500 text-sm font-medium mt-1">{user.email}</p>
        <div className="mt-6 inline-flex items-center gap-2 px-5 py-2 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
          Registered Explorer
        </div>
      </header>

      <div className="space-y-4">
        <div className="px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Configuration</div>
        
        <button 
          onClick={toggleTheme}
          className="w-full pro-card p-5 rounded-2xl flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 group-hover:text-teal-600 transition-colors">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </div>
            <div className="text-left">
              <p className="font-bold text-sm dark:text-white">Appearance</p>
              <p className="text-xs text-slate-400 font-medium">Switch to {isDarkMode ? 'Light' : 'Dark'} mode</p>
            </div>
          </div>
          <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${isDarkMode ? 'bg-teal-600' : 'bg-slate-300'}`}>
            <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`} />
          </div>
        </button>

        {options.map((opt, i) => (
          <div key={i} className="pro-card p-5 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 group">
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 group-hover:text-teal-600 transition-colors">
              <opt.icon size={20} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm dark:text-white">{opt.label}</p>
              <p className="text-xs text-slate-400 font-medium">{opt.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-8">
        <button 
          onClick={onLogout}
          className="w-full p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 font-black text-sm flex items-center justify-center gap-3 hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-all shadow-sm border border-rose-100 dark:border-rose-900/20"
        >
          <LogOut size={20} />
          End Horizon Session
        </button>
      </div>
      
      <p className="text-center text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] pt-12 pb-20">
        Horizon v1.1.0 · Build by Shadrack
      </p>
    </div>
  );
};

export default ProfilePage;
