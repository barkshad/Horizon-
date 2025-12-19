
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
import WelcomeScreen from './components/WelcomeScreen';

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
  const [hasProceeded, setHasProceeded] = useState(false);
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('horizon-theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('horizon-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

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
        setHasProceeded(true); // Skip welcome if logged in
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
    setHasProceeded(false);
  };

  const handleInstallApp = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') setInstallPrompt(null);
    } else {
      alert("Horizon App is ready! Select 'Add to Home Screen' from your browser's share/menu options for a native experience.");
    }
  };

  const isStartupComplete = authReady && (user ? dataReady : true);

  if (!authReady) return <LoadingScreen isReady={false} />;

  return (
    <>
      <LoadingScreen isReady={isStartupComplete} />
      
      {!user ? (
        !hasProceeded ? (
          <WelcomeScreen 
            onProceed={() => setHasProceeded(true)} 
            onInstall={handleInstallApp}
            isInstallable={!!installPrompt}
          />
        ) : (
          <AuthPage />
        )
      ) : (
        <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-opacity duration-500 overflow-hidden">
          <Sidebar 
            activeTab={activeTab === 'dashboard' || activeTab === 'dreams' || activeTab === 'logs' ? activeTab as any : 'dashboard'} 
            setActiveTab={setActiveTab as any} 
            user={user} 
            onLogout={handleLogout} 
            onInstall={handleInstallApp}
            isInstallable={!!installPrompt}
            isDarkMode={isDarkMode}
            toggleTheme={() => setIsDarkMode(!isDarkMode)}
          />
          
          <main className="flex-1 overflow-y-auto custom-scrollbar safe-pt lg:pb-0 pb-20">
            <div className="max-w-5xl mx-auto px-4 py-6 md:px-8 lg:py-12 content-transition">
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
              {activeTab === 'profile' && <ProfilePage user={user} onLogout={handleLogout} isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} />}
            </div>
          </main>

          <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      )}
    </>
  );
};

export default App;
