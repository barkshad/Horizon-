
export enum DreamCategory {
  CAREER = 'Career',
  MONEY = 'Money',
  EDUCATION = 'Education',
  HEALTH = 'Health',
  RELATIONSHIPS = 'Relationships',
  PERSONAL = 'Personal'
}

export enum TimeHorizon {
  ONE_YEAR = '1 Year',
  FIVE_YEARS = '5 Years',
  TEN_YEARS = '10 Years',
  LIFETIME = 'Lifetime'
}

export enum GoalStatus {
  NOT_STARTED = 'Not Started',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed'
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string;
  photoURL?: string;
  accountType: 'guest' | 'registered';
  createdAt: number;
}

export interface Dream {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: DreamCategory;
  horizon: TimeHorizon;
  createdAt: number;
  updatedAt: number;
  isArchived: boolean;
}

export interface Goal {
  id: string;
  dreamId: string;
  userId: string;
  title: string;
  status: GoalStatus;
  progress: number; // 0-100
  deadline?: number;
  createdAt: number;
  updatedAt: number;
}

export interface ActionLog {
  id: string;
  userId: string;
  content: string;
  date: number;
  createdAt: number;
}
