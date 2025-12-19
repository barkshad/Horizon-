
import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, colorClass }) => {
  return (
    <div className="glass-card p-6 rounded-3xl transition-all duration-300 hover:translate-y-[-4px] group">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</p>
          <h3 className="text-4xl font-black dark:text-white tracking-tighter group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{value}</h3>
        </div>
        <div className={`p-4 rounded-2xl ${colorClass} shadow-inner group-hover:rotate-12 transition-transform duration-500`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
