
import React from 'react';
import { User } from '../types';
import { LogOut, Settings, Bell, Shield, HelpCircle, User as UserIcon } from 'lucide-react';

interface ProfilePageProps {
  user: User;
  onLogout: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onLogout }) => {
  const options = [
    { icon: Settings, label: 'Preferences', desc: 'Theme, Language' },
    { icon: Bell, label: 'Notifications', desc: 'Reminders, Updates' },
    { icon: Shield, label: 'Privacy & Security', desc: 'Password, RLS' },
    { icon: HelpCircle, label: 'Help & Support', desc: 'FAQs, Contact' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col items-center text-center py-8">
        <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-3xl font-black text-indigo-600 border-4 border-white dark:border-slate-900 shadow-xl overflow-hidden mb-4">
          {user.photoURL ? <img src={user.photoURL} className="w-full h-full object-cover" /> : user.displayName.charAt(0)}
        </div>
        <h2 className="text-2xl font-black dark:text-white">{user.displayName}</h2>
        <p className="text-slate-500 text-sm font-medium">{user.email}</p>
        <div className="mt-4 px-4 py-1.5 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 rounded-full text-xs font-black uppercase tracking-widest">
          Explorer Level 12
        </div>
      </header>

      <div className="space-y-3">
        {options.map((opt, i) => (
          <div key={i} className="pro-card p-5 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50">
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500">
              <opt.icon size={20} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm dark:text-white">{opt.label}</p>
              <p className="text-xs text-slate-400 font-medium">{opt.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={onLogout}
        className="w-full p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 font-bold text-sm flex items-center justify-center gap-2 hover:bg-rose-100 transition-colors mt-8"
      >
        <LogOut size={18} />
        Sign Out of Horizon
      </button>
      
      <p className="text-center text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] pt-8">
        Horizon v2.4.0 — Open Alpha
      </p>
    </div>
  );
};

export default ProfilePage;
