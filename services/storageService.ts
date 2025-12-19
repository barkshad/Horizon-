
import { Dream, Goal, ActionLog, User } from '../types';
import { INITIAL_DREAMS, INITIAL_GOALS, INITIAL_LOGS } from './mockData';

const KEYS = {
  USER: 'horizon_user',
  DREAMS: 'horizon_dreams',
  GOALS: 'horizon_goals',
  LOGS: 'horizon_logs',
};

export const storageService = {
  getUser: (): User | null => {
    const data = localStorage.getItem(KEYS.USER);
    return data ? JSON.parse(data) : null;
  },
  setUser: (user: User | null) => {
    if (user) localStorage.setItem(KEYS.USER, JSON.stringify(user));
    else localStorage.removeItem(KEYS.USER);
  },
  getDreams: (): Dream[] => {
    const data = localStorage.getItem(KEYS.DREAMS);
    return data ? JSON.parse(data) : INITIAL_DREAMS;
  },
  saveDreams: (dreams: Dream[]) => {
    localStorage.setItem(KEYS.DREAMS, JSON.stringify(dreams));
  },
  getGoals: (): Goal[] => {
    const data = localStorage.getItem(KEYS.GOALS);
    return data ? JSON.parse(data) : INITIAL_GOALS;
  },
  saveGoals: (goals: Goal[]) => {
    localStorage.setItem(KEYS.GOALS, JSON.stringify(goals));
  },
  getLogs: (): ActionLog[] => {
    const data = localStorage.getItem(KEYS.LOGS);
    return data ? JSON.parse(data) : INITIAL_LOGS;
  },
  saveLogs: (logs: ActionLog[]) => {
    localStorage.setItem(KEYS.LOGS, JSON.stringify(logs));
  },
  clearAll: () => {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  }
};
