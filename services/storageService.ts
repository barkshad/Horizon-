
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc,
  serverTimestamp,
  orderBy
} from "firebase/firestore";
import { db } from "./firebase";
import { Dream, Goal, ActionLog } from "../types";

export const storageService = {
  // Dreams
  async getDreams(userId: string): Promise<Dream[]> {
    const q = query(collection(db, "dreams"), where("userId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Dream));
  },
  async addDream(dream: Omit<Dream, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, "dreams"), {
      ...dream,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    return docRef.id;
  },
  async updateDream(dreamId: string, updates: Partial<Dream>): Promise<void> {
    const docRef = doc(db, "dreams", dreamId);
    await updateDoc(docRef, { ...updates, updatedAt: Date.now() });
  },

  // Goals
  async getGoals(userId: string): Promise<Goal[]> {
    const q = query(collection(db, "goals"), where("userId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Goal));
  },
  async addGoal(goal: Omit<Goal, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, "goals"), {
      ...goal,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    return docRef.id;
  },
  async updateGoal(goalId: string, updates: Partial<Goal>): Promise<void> {
    const docRef = doc(db, "goals", goalId);
    await updateDoc(docRef, { ...updates, updatedAt: Date.now() });
  },

  // Logs
  async getLogs(userId: string): Promise<ActionLog[]> {
    const q = query(
      collection(db, "logs"), 
      where("userId", "==", userId),
      orderBy("date", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ActionLog));
  },
  async addLog(log: Omit<ActionLog, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, "logs"), {
      ...log,
      createdAt: Date.now()
    });
    return docRef.id;
  }
};
