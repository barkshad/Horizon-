
import React, { useState, useEffect, useCallback } from 'react';
import { User, Dream, Goal, ActionLog } from './types';
import { storageService } from './services/storageService';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import DreamsPage from './pages/DreamsPage';
import ActionLogPage from './pages/ActionLogPage';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(storageService.getUser());
  const [dreams, setDreams] = useState<Dream[]>(storageService.getDreams());
  const [goals, setGoals] = useState<Goal[]>(storageService.getGoals());
  const [logs, setLogs] = useState<ActionLog[]>(storageService.getLogs());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'dreams' | 'logs'>('dashboard');

  useEffect(() => {
    storageService.setUser(user);
  }, [user]);

  useEffect(() => {
    storageService.saveDreams(dreams);
  }, [dreams]);

  useEffect(() => {
    storageService.saveGoals(goals);
  }, [goals]);

  useEffect(() => {
    storageService.saveLogs(logs);
  }, [logs]);

  const handleLogout = () => {
    storageService.clearAll();
    setUser(null);
    setDreams([]);
    setGoals([]);
    setLogs([]);
  };

  const handleLogin = (u: User) => {
    setUser(u);
    // Reload data if guest vs real user logic was needed
    setDreams(storageService.getDreams());
    setGoals(storageService.getGoals());
    setLogs(storageService.getLogs());
  };

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
      
      <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
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
            />
          )}
          {activeTab === 'logs' && (
            <ActionLogPage logs={logs} setLogs={setLogs} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
