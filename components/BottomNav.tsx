
import React from 'react';
import { AppTab } from '../App';
import { LayoutDashboard, Target, MessageSquare, Compass, UserCircle } from 'lucide-react';

interface BottomNavProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'dreams', label: 'Visions', icon: Target },
    { id: 'logs', label: 'Momentum', icon: MessageSquare },
    { id: 'discovery', label: 'Discover', icon: Compass },
    { id: 'profile', label: 'Profile', icon: UserCircle },
  ] as const;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-50 safe-pb shadow-lg">
      <div className="flex justify-around items-center h-16">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex flex-col items-center justify-center w-full h-full relative transition-all duration-200 ${
              activeTab === id ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            <Icon size={24} className={activeTab === id ? 'scale-110' : ''} />
            <span className="text-[10px] mt-1 font-bold">{label}</span>
            {activeTab === id && <div className="active-tab-indicator" />}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
