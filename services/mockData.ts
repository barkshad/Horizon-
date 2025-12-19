
import { DreamCategory, TimeHorizon, GoalStatus, Dream, Goal, ActionLog } from '../types';

export const INITIAL_DREAMS: Dream[] = [
  {
    id: 'd1',
    userId: 'u1',
    title: 'Become a Senior Software Architect',
    description: 'Lead large scale systems and influence engineering culture.',
    category: DreamCategory.CAREER,
    horizon: TimeHorizon.FIVE_YEARS,
    createdAt: Date.now() - 10000000,
    updatedAt: Date.now(),
    isArchived: false,
  },
  {
    id: 'd2',
    userId: 'u1',
    title: 'Financial Independence',
    description: 'Invest enough to cover all living expenses from passive income.',
    category: DreamCategory.MONEY,
    horizon: TimeHorizon.TEN_YEARS,
    createdAt: Date.now() - 20000000,
    updatedAt: Date.now(),
    isArchived: false,
  }
];

export const INITIAL_GOALS: Goal[] = [
  {
    id: 'g1',
    dreamId: 'd1',
    userId: 'u1',
    title: 'Master System Design Patterns',
    status: GoalStatus.IN_PROGRESS,
    progress: 65,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'g2',
    dreamId: 'd1',
    userId: 'u1',
    title: 'Speak at a Tech Conference',
    status: GoalStatus.NOT_STARTED,
    progress: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'g3',
    dreamId: 'd2',
    userId: 'u1',
    title: 'Save $100k for initial investment',
    status: GoalStatus.COMPLETED,
    progress: 100,
    createdAt: Date.now() - 5000000,
    updatedAt: Date.now(),
  }
];

export const INITIAL_LOGS: ActionLog[] = [
  {
    id: 'l1',
    userId: 'u1',
    content: 'Read 3 chapters of Designing Data-Intensive Applications.',
    date: Date.now(),
    createdAt: Date.now(),
  },
  {
    id: 'l2',
    userId: 'u1',
    content: 'Automated the monthly investment transfer.',
    date: Date.now() - 86400000,
    createdAt: Date.now() - 86400000,
  }
];
