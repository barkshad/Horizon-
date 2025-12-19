
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

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-500">
      {/* Target Pulse - only shown if target is not 'none' */}
      {currentStep.target !== 'none' && (
        <div className="fixed inset-0 pointer-events-none">
          {/* This is a visual hint, real-world positioning usually uses element.getBoundingClientRect() 
              For this simplified logic, we assume standard layout positions */}
          <div className={`absolute transition-all duration-700 rounded-full border-4 border-teal-500 animate-ping opacity-75 ${
            currentStep.target === 'dashboard-nav' ? 'bottom-8 left-1/2 -translate-x-[150%]' :
            currentStep.target === 'dreams-nav' ? 'bottom-8 left-1/2 -translate-x-[50%]' :
            currentStep.target === 'logs-nav' ? 'bottom-8 left-1/2 translate-x-[50%]' : ''
          } w-16 h-16 lg:hidden`} />
          
          <div className={`absolute transition-all duration-700 rounded-2xl border-4 border-teal-500 animate-pulse opacity-75 hidden lg:block ${
            currentStep.target === 'dashboard-nav' ? 'top-24 left-8 w-64 h-14' :
            currentStep.target === 'dreams-nav' ? 'top-[164px] left-8 w-64 h-14' :
            currentStep.target === 'logs-nav' ? 'top-[228px] left-8 w-64 h-14' : ''
          }`} />
        </div>
      )}

      <div className="max-w-sm w-full bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-6 relative animate-in zoom-in-95 duration-300">
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
    </div>
  );
};

export default OnboardingWizard;
