
import React, { useState } from 'react';
import { User } from '../types';

interface AuthPageProps {
  onLogin: (u: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    
    // Simulate a brief load for aesthetic feel
    setTimeout(() => {
      const newUser: User = {
        uid: Math.random().toString(36).substr(2, 9),
        email: null,
        displayName: name,
        accountType: 'registered',
        createdAt: Date.now(),
      };
      onLogin(newUser);
      setLoading(false);
    }, 600);
  };

  const handleGuestMode = () => {
    const guestUser: User = {
      uid: 'guest_user',
      email: null,
      displayName: 'Guest Explorer',
      accountType: 'guest',
      createdAt: Date.now(),
    };
    onLogin(guestUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4 shadow-xl shadow-indigo-200 dark:shadow-indigo-900/30">
             <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Horizon</h1>
          <p className="text-slate-500 mt-2">Your life dreams, clearly defined.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Your Name</label>
              <input 
                type="text"
                required
                autoFocus
                className="w-full px-4 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white text-lg font-medium"
                placeholder="What should we call you?"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              disabled={loading || !name.trim()}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              Start Your Journey
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
          </div>

          <button 
            onClick={handleGuestMode}
            className="w-full mt-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm"
          >
            Continue as Guest
          </button>
        </div>
        
        <p className="text-center text-xs text-slate-400 mt-10">
          Everything is saved locally in your browser. No cloud, no tracking.
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
