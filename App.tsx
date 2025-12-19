
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
import LoadingScreen from './components/LoadingScreen';

export type AppTab = 'dashboard' | 'dreams' | 'logs' | 'discovery' | 'profile';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [dataReady, setDataReady] = useState(false);
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
      } else {
        setDataReady(true);
      }
      setAuthReady(true);
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
        setDataReady(true);
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
    setDataReady(false);
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
    } finally {
      setDataReady(true);
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

  // The loading screen stays until auth is checked
  // If user is auth'd, it stays until first data fetch is done
  const isStartupComplete = authReady && (user ? dataReady : true);

  if (!authReady) return <LoadingScreen isReady={false} />;

  return (
    <>
      <LoadingScreen isReady={isStartupComplete} />
      
      {!user ? (
        <AuthPage />
      ) : (
        <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-opacity duration-500 overflow-hidden">
          <Sidebar 
            activeTab={activeTab === 'dashboard' || activeTab === 'dreams' || activeTab === 'logs' ? activeTab as any : 'dashboard'} 
            setActiveTab={setActiveTab as any} 
            user={user} 
            onLogout={handleLogout} 
            onInstall={handleInstallApp}
            isInstallable={!!installPrompt}
          />
          
          <main className="flex-1 overflow-y-auto custom-scrollbar safe-pt lg:pb-0 pb-20">
            <div className="max-w-5xl mx-auto px-4 py-6 md:px-8 lg:py-12">
              {!dataReady ? (
                <div className="animate-in fade-in duration-500">
                  {/* Global loader used during navigation-based data refreshes if needed */}
                  <div className="h-1 w-full bg-slate-200 dark:bg-slate-800 overflow-hidden fixed top-0 left-0 z-[100]">
                    <div className="h-full bg-teal-500 w-1/3 animate-[shimmer_2s_infinite_linear]" />
                  </div>
                </div>
              ) : null}

              {activeTab === 'dashboard' && <Dashboard dreams={dreams} goals={goals} logs={logs} isLoading={!dataReady} />}
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
      )}
    </>
  );
};

export default App;
