
import { Dream, Goal, ActionLog } from "../types";

const KEYS = {
  DREAMS: 'horizon_dreams',
  GOALS: 'horizon_goals',
  LOGS: 'horizon_logs',
  USER: 'horizon_user'
};

const generateId = () => Math.random().toString(36).substr(2, 9);

const getItem = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const setItem = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const storageService = {
  // User Session
  getLocalUser(): any | null {
    const user = localStorage.getItem(KEYS.USER);
    return user ? JSON.parse(user) : null;
  },
  setLocalUser(user: any): void {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  },
  clearSession(): void {
    localStorage.removeItem(KEYS.USER);
  },

  // Dreams
  async getDreams(userId: string): Promise<Dream[]> {
    const dreams = getItem<Dream>(KEYS.DREAMS);
    return dreams.filter(d => d.userId === userId);
  },
  async addDream(dream: Omit<Dream, 'id'>): Promise<string> {
    const dreams = getItem<Dream>(KEYS.DREAMS);
    const newDream = { ...dream, id: generateId(), createdAt: Date.now(), updatedAt: Date.now() };
    setItem(KEYS.DREAMS, [newDream, ...dreams]);
    return newDream.id;
  },
  async updateDream(dreamId: string, updates: Partial<Dream>): Promise<void> {
    const dreams = getItem<Dream>(KEYS.DREAMS);
    const updated = dreams.map(d => d.id === dreamId ? { ...d, ...updates, updatedAt: Date.now() } : d);
    setItem(KEYS.DREAMS, updated);
  },

  // Goals
  async getGoals(userId: string): Promise<Goal[]> {
    const goals = getItem<Goal>(KEYS.GOALS);
    return goals.filter(g => g.userId === userId);
  },
  async addGoal(goal: Omit<Goal, 'id'>): Promise<string> {
    const goals = getItem<Goal>(KEYS.GOALS);
    const newGoal = { ...goal, id: generateId(), createdAt: Date.now(), updatedAt: Date.now() };
    setItem(KEYS.GOALS, [...goals, newGoal]);
    return newGoal.id;
  },
  async updateGoal(goalId: string, updates: Partial<Goal>): Promise<void> {
    const goals = getItem<Goal>(KEYS.GOALS);
    const updated = goals.map(g => g.id === goalId ? { ...g, ...updates, updatedAt: Date.now() } : g);
    setItem(KEYS.GOALS, updated);
  },

  // Logs
  async getLogs(userId: string): Promise<ActionLog[]> {
    const logs = getItem<ActionLog>(KEYS.LOGS);
    return logs
      .filter(l => l.userId === userId)
      .sort((a, b) => b.date - a.date);
  },
  async addLog(log: Omit<ActionLog, 'id'>): Promise<string> {
    const logs = getItem<ActionLog>(KEYS.LOGS);
    const newLog = { ...log, id: generateId(), createdAt: Date.now() };
    setItem(KEYS.LOGS, [newLog, ...logs]);
    return newLog.id;
  }
};
