
import React from 'react';
import { Compass, Sparkles, BookOpen, Lightbulb } from 'lucide-react';

const DiscoveryPage: React.FC = () => {
  const cards = [
    { title: 'The Power of Atomic Habits', type: 'Concept', icon: Lightbulb, color: 'bg-amber-100 text-amber-600' },
    { title: 'Designing for the 10-Year Self', type: 'Framework', icon: Compass, color: 'bg-blue-100 text-blue-600' },
    { title: 'Stoic Principles for Modern Life', type: 'Wisdom', icon: BookOpen, color: 'bg-emerald-100 text-emerald-600' },
    { title: 'Mastering Visual Focus', type: 'Technique', icon: Sparkles, color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">Discovery</h1>
        <p className="text-slate-500 font-medium">Feed your mind with concepts for growth.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((card, i) => (
          <div key={i} className="pro-card p-6 rounded-2xl flex items-center gap-5 cursor-pointer hover:border-teal-500/50">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${card.color} shadow-sm flex-shrink-0`}>
              <card.icon size={28} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{card.type}</span>
              <h3 className="font-bold text-lg dark:text-white leading-snug">{card.title}</h3>
            </div>
          </div>
        ))}
      </div>

      <section className="p-8 pro-card rounded-[2rem] bg-gradient-to-br from-indigo-600 to-indigo-800 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Compass size={120} />
        </div>
        <div className="relative z-10 max-w-lg space-y-4">
          <h2 className="text-2xl font-black leading-tight">AI Mentor Insight</h2>
          <p className="text-indigo-100 text-sm leading-relaxed">
            "The greatest danger for most of us is not that our aim is too high and we miss it, 
            but that it is too low and we reach it." 
          </p>
          <div className="pt-2">
            <button className="px-6 py-2 bg-white text-indigo-700 rounded-full font-bold text-xs">Unlock Insight</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DiscoveryPage;
