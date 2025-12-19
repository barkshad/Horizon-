
import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, X, Target, Zap, LayoutDashboard, CheckCircle2 } from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: () => void;
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete, activeTab, setActiveTab }) => {
  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const steps = [
    {
      title: "Welcome to Horizon",
      description: "This is your professional sanctuary. Let's take a 60-second tour of how to master your future.",
      icon: Sparkles,
      target: "none",
      buttonText: "Begin Tour",
      action: () => {}
    },
    {
      title: "The Command Center",
      description: "Your Dashboard shows your current focus, momentum, and daily wisdom. Consistency starts here.",
      icon: LayoutDashboard,
      target: "dashboard-nav",
      buttonText: "Next",
      action: () => setActiveTab('dashboard')
    },
    {
      title: "Visionary Mapping",
      description: "This is where you define your 1, 5, and 10-year horizons. Dreams without blueprints are just wishes.",
      icon: Target,
      target: "dreams-nav",
      buttonText: "Explore Visions",
      action: () => setActiveTab('dreams')
    },
    {
      title: "Atomic Momentum",
      description: "Log your daily wins here. Small actions compounded over time create legendary results.",
      icon: Zap,
      target: "logs-nav",
      buttonText: "Got it",
      action: () => setActiveTab('logs')
    },
    {
      title: "Ready for Launch",
      description: "You're all set. Start by creating your first Vision in the Dreams tab. We'll track the rest.",
      icon: CheckCircle2,
      target: "none",
      buttonText: "Start Building",
      action: () => {
        setActiveTab('dreams');
        onComplete();
      }
    }
  ];

  const currentStep = steps[step];

  const nextStep = () => {
    currentStep.action();
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  if (!isVisible) return null;

  // Positioning logic for the high-visibility spotlight
  const getSpotlightStyles = () => {
    if (currentStep.target === 'none') return { opacity: 0 };
    
    const isMobile = window.innerWidth < 1024;
    
    if (isMobile) {
      // Logic for Bottom Nav (Simplified assuming 5 items)
      const offsetMap: Record<string, string> = {
        'dashboard-nav': '10%',
        'dreams-nav': '30%',
        'logs-nav': '50%'
      };
      return {
        bottom: '8px',
        left: offsetMap[currentStep.target] || '50%',
        width: '64px',
        height: '64px',
        borderRadius: '16px',
        boxShadow: '0 0 0 9999px rgba(2, 6, 23, 0.85)',
        border: '3px solid #0d9488',
        zIndex: 9998
      };
    } else {
      // Logic for Sidebar
      const topMap: Record<string, string> = {
        'dashboard-nav': '96px',
        'dreams-nav': '160px',
        'logs-nav': '224px'
      };
      return {
        top: topMap[currentStep.target] || '0',
        left: '32px',
        width: '224px',
        height: '48px',
        borderRadius: '16px',
        boxShadow: '0 0 0 9999px rgba(2, 6, 23, 0.85)',
        border: '3px solid #0d9488',
        zIndex: 9998
      };
    }
  };

  return (
    <div className="fixed inset-0 z-[9997] flex items-center justify-center p-6 animate-in fade-in duration-500 overflow-hidden">
      {/* Dynamic Spotlight Hole Effect */}
      <div 
        className="fixed transition-all duration-500 pointer-events-none"
        style={getSpotlightStyles() as any}
      >
        <div className="absolute inset-0 animate-pulse border-4 border-teal-500/50 rounded-[inherit]" />
      </div>

      {/* The Guidance Card */}
      <div className="max-w-sm w-full bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-6 relative animate-in zoom-in-95 duration-300 z-[9999]">
        <button 
          onClick={onComplete}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="w-14 h-14 bg-teal-500/10 rounded-2xl flex items-center justify-center text-teal-600">
          <currentStep.icon size={28} />
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-black dark:text-white tracking-tight leading-tight">
            {currentStep.title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            {currentStep.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? 'w-6 bg-teal-500' : 'w-1.5 bg-slate-200 dark:bg-slate-800'
                }`} 
              />
            ))}
          </div>
          <button 
            onClick={nextStep}
            className="px-6 py-3 bg-slate-900 dark:bg-teal-600 text-white rounded-2xl font-black text-sm flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-teal-900/10"
          >
            {currentStep.buttonText}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
      
      {/* Background click catcher for the rest of the dark area (excluding hole) */}
      {currentStep.target === 'none' && (
        <div className="fixed inset-0 bg-slate-950/80 -z-10" />
      )}
    </div>
  );
};

export default OnboardingWizard;
