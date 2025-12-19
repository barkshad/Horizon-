
import { supabase } from "./supabase";
import { Dream, Goal, ActionLog } from "../types";

export const storageService = {
  // Dreams
  async getDreams(userId: string): Promise<Dream[]> {
    const { data, error } = await supabase
      .from('dreams')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    // Map snake_case to camelCase if necessary, but here we assume the types match or are flexible
    return (data || []).map(d => ({
      ...d,
      userId: d.user_id,
      isArchived: d.is_archived,
      createdAt: new Date(d.created_at).getTime(),
      updatedAt: new Date(d.updated_at).getTime()
    })) as any;
  },

  async addDream(dream: Omit<Dream, 'id'>): Promise<string> {
    const { data, error } = await supabase
      .from('dreams')
      .insert([{
        user_id: dream.userId,
        title: dream.title,
        description: dream.description,
        category: dream.category,
        horizon: dream.horizon,
        is_archived: dream.isArchived
      }])
      .select()
      .single();

    if (error) throw error;
    return data.id;
  },

  async updateDream(dreamId: string, updates: Partial<Dream>): Promise<void> {
    const payload: any = {};
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.isArchived !== undefined) payload.is_archived = updates.isArchived;
    if (updates.category !== undefined) payload.category = updates.category;
    if (updates.horizon !== undefined) payload.horizon = updates.horizon;
    payload.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('dreams')
      .update(payload)
      .eq('id', dreamId);

    if (error) throw error;
  },

  // Goals
  async getGoals(userId: string): Promise<Goal[]> {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return (data || []).map(g => ({
      ...g,
      userId: g.user_id,
      dreamId: g.dream_id,
      createdAt: new Date(g.created_at).getTime(),
      updatedAt: new Date(g.updated_at).getTime()
    })) as any;
  },

  async addGoal(goal: Omit<Goal, 'id'>): Promise<string> {
    const { data, error } = await supabase
      .from('goals')
      .insert([{
        dream_id: goal.dreamId,
        user_id: goal.userId,
        title: goal.title,
        status: goal.status,
        progress: goal.progress,
        deadline: goal.deadline ? new Date(goal.deadline).toISOString() : null
      }])
      .select()
      .single();

    if (error) throw error;
    return data.id;
  },

  async updateGoal(goalId: string, updates: Partial<Goal>): Promise<void> {
    const payload: any = { ...updates };
    // Map camelCase to snake_case for specific fields if needed
    if (updates.dreamId) { payload.dream_id = updates.dreamId; delete payload.dreamId; }
    if (updates.userId) { payload.user_id = updates.userId; delete payload.userId; }
    payload.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('goals')
      .update(payload)
      .eq('id', goalId);

    if (error) throw error;
  },

  // Logs
  async getLogs(userId: string): Promise<ActionLog[]> {
    const { data, error } = await supabase
      .from('action_logs')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw error;
    return (data || []).map(l => ({
      ...l,
      userId: l.user_id,
      date: new Date(l.date).getTime(),
      createdAt: new Date(l.created_at).getTime()
    })) as any;
  },

  async addLog(log: Omit<ActionLog, 'id'>): Promise<string> {
    const { data, error } = await supabase
      .from('action_logs')
      .insert([{
        user_id: log.userId,
        content: log.content,
        date: new Date(log.date).toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data.id;
  }
};
