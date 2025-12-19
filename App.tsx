
import React, { useState, useEffect } from 'react';
import { User, Dream, Goal, ActionLog } from './types';
import { storageService } from './services/storageService';
import { supabase } from './services/supabase';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import DreamsPage from './pages/DreamsPage';
import ActionLogPage from './pages/ActionLogPage';
import DiscoveryPage from './pages/DiscoveryPage';
import ProfilePage from './pages/ProfilePage';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';

export type AppTab = 'dashboard' | 'dreams' | 'logs' | 'discovery' | 'profile';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [logs, setLogs] = useState<ActionLog[]>([]);
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const u: User = {
          uid: session.user.id,
          email: session.user.email || null,
          displayName: session.user.user_metadata?.full_name || 'Explorer',
          accountType: 'registered',
          createdAt: new Date(session.user.created_at).getTime(),
        };
        setUser(u);
        fetchData(u.uid);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u: User = {
          uid: session.user.id,
          email: session.user.email || null,
          displayName: session.user.user_metadata?.full_name || 'Explorer',
          accountType: 'registered',
          createdAt: new Date(session.user.created_at).getTime(),
        };
        setUser(u);
        fetchData(u.uid);
      } else {
        setUser(null);
        setDreams([]);
        setGoals([]);
        setLogs([]);
      }
    });

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    
    return () => {
      subscription.unsubscribe();
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const fetchData = async (uid: string) => {
    try {
      const [fetchedDreams, fetchedGoals, fetchedLogs] = await Promise.all([
        storageService.getDreams(uid),
        storageService.getGoals(uid),
        storageService.getLogs(uid)
      ]);
      setDreams(fetchedDreams);
      setGoals(fetchedGoals);
      setLogs(fetchedLogs);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleInstallApp = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') setInstallPrompt(null);
    } else {
      alert("Installation ready: Add this page to your home screen via browser settings.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return <AuthPage />;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        onLogout={handleLogout} 
        onInstall={handleInstallApp}
        isInstallable={!!installPrompt}
      />
      
      <main className="flex-1 overflow-y-auto custom-scrollbar safe-pt lg:pb-0 pb-20">
        <div className="max-w-5xl mx-auto px-4 py-6 md:px-8 lg:py-12">
          {activeTab === 'dashboard' && <Dashboard dreams={dreams} goals={goals} logs={logs} />}
          {activeTab === 'dreams' && (
            <DreamsPage 
              dreams={dreams} 
              setDreams={setDreams} 
              goals={goals} 
              setGoals={setGoals} 
              userId={user.uid}
            />
          )}
          {activeTab === 'logs' && (
            <ActionLogPage 
              logs={logs} 
              setLogs={setLogs} 
              userId={user.uid}
            />
          )}
          {activeTab === 'discovery' && <DiscoveryPage />}
          {activeTab === 'profile' && <ProfilePage user={user} onLogout={handleLogout} />}
        </div>
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;
