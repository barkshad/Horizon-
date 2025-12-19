
import React, { useState, useEffect } from 'react';
import { User, Dream, Goal, ActionLog } from './types';
import { storageService } from './services/storageService';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import DreamsPage from './pages/DreamsPage';
import ActionLogPage from './pages/ActionLogPage';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [logs, setLogs] = useState<ActionLog[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'dreams' | 'logs'>('dashboard');

  useEffect(() => {
    const localUser = storageService.getLocalUser();
    if (localUser) {
      setUser(localUser);
      fetchData(localUser.uid);
    }
    setLoading(false);
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

  const handleLogin = (u: User) => {
    setUser(u);
    storageService.setLocalUser(u);
    fetchData(u.uid);
  };

  const handleLogout = () => {
    storageService.clearSession();
    setUser(null);
    setDreams([]);
    setGoals([]);
    setLogs([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        onLogout={handleLogout} 
      />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 transition-all">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'dashboard' && (
            <Dashboard dreams={dreams} goals={goals} logs={logs} />
          )}
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
        </div>
      </main>
    </div>
  );
};

export default App;
