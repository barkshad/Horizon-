
import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

const LoadingScreen: React.FC<{ isReady: boolean }> = ({ isReady }) => {
  const [shouldRender, setShouldRender] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isReady) {
      // Small delay to ensure minimum visibility for branding
      const timer = setTimeout(() => {
        setIsVisible(false);
        const exitTimer = setTimeout(() => setShouldRender(false), 600);
        return () => clearTimeout(exitTimer);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isReady]);

  if (!shouldRender) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950 transition-all duration-700 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0 scale-105 pointer-events-none'
      }`}
    >
      <div className="relative">
        <div className="w-20 h-20 bg-teal-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-teal-900/40 animate-pulse">
          <Sparkles size={40} className="text-white" />
        </div>
        <div className="absolute -inset-4 bg-teal-600/20 blur-2xl rounded-full animate-ping opacity-30" />
      </div>
      
      <div className="mt-8 text-center space-y-2">
        <h1 className="text-3xl font-black text-white tracking-tighter">HORIZON</h1>
        <div className="flex items-center justify-center gap-2">
          <div className="h-px w-8 bg-slate-800" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">v1.1 Alpha</p>
          <div className="h-px w-8 bg-slate-800" />
        </div>
      </div>

      <div className="absolute bottom-12 text-center">
        <p className="text-xs font-bold text-slate-600 tracking-wide">
          Built by <span className="text-slate-400">Shadrack</span>
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
