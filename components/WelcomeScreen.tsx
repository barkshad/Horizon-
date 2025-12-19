
import React from 'react';
import { Smartphone, Sparkles, ArrowRight, ShieldCheck, Zap, Target, BarChart3, CloudMoon } from 'lucide-react';

interface WelcomeScreenProps {
  onProceed: () => void;
  onInstall: () => void;
  isInstallable: boolean;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onProceed, onInstall, isInstallable }) => {
  const features = [
    {
      icon: Target,
      title: "Visionary Mapping",
      description: "Define your 1, 5, and 10-year horizons. Turn abstract dreams into architectural blueprints.",
      color: "text-teal-500 bg-teal-500/10"
    },
    {
      icon: BarChart3,
      title: "Atomic Momentum",
      description: "Track small wins through our conversation-style feed. Progress is built in the daily logs.",
      color: "text-indigo-500 bg-indigo-500/10"
    },
    {
      icon: CloudMoon,
      title: "Pure Focus",
      description: "A professional, distraction-free environment designed for deep thinking and calm ambition.",
      color: "text-amber-500 bg-amber-500/10"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500 overflow-y-auto overflow-x-hidden relative custom-scrollbar">
      {/* Decorative Background Elements */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/10 blur-[120px] rounded-full animate-pulse pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse pointer-events-none" />

      <div className="max-w-4xl w-full py-12 space-y-12 text-center z-10 animate-in fade-in zoom-in-95 duration-700">
        <header className="space-y-6">
          <div className="relative inline-block group">
            <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-teal-500/20 group-hover:scale-105 transition-transform duration-500">
              <Sparkles size={40} className="text-white animate-pulse" />
            </div>
            <div className="absolute -inset-2 bg-teal-500/20 blur-xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
              HORIZON
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-sm mx-auto">
              Master your future with professional-grade focus.
            </p>
          </div>
        </header>

        {/* Feature Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="pro-card p-6 rounded-[2.5rem] text-left space-y-4 hover:border-teal-500/30 transition-all duration-500 animate-in slide-in-from-bottom-4"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${feature.color}`}>
                <feature.icon size={24} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black dark:text-white leading-tight">{feature.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-md mx-auto space-y-4 pt-4">
          <button 
            onClick={onProceed}
            className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-3xl font-black text-lg flex items-center justify-center gap-3 shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all group"
          >
            Enter Sanctuary
            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <button 
            onClick={onInstall}
            disabled={!isInstallable}
            className={`w-full py-5 bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 border-2 border-slate-200 dark:border-slate-800 rounded-3xl font-black text-lg flex items-center justify-center gap-3 shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] ${!isInstallable && 'opacity-50 cursor-not-allowed'}`}
          >
            <Smartphone size={22} />
            {isInstallable ? 'Instant App Download' : 'App Installed'}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200 dark:border-slate-800 max-w-sm mx-auto">
          <div className="space-y-1">
            <div className="flex justify-center text-teal-500"><ShieldCheck size={20} /></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Secure</p>
          </div>
          <div className="space-y-1">
            <div className="flex justify-center text-indigo-500"><Zap size={20} /></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fast</p>
          </div>
          <div className="space-y-1">
            <div className="flex justify-center text-amber-500 font-black text-sm uppercase">PWA</div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ready</p>
          </div>
        </div>
      </div>

      <footer className="mt-12 text-center pb-8">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
          Horizon v1.1.0 · Build by Shadrack
        </p>
      </footer>
    </div>
  );
};

export default WelcomeScreen;
