
import React from 'react';

export const StatCardSkeleton = () => (
  <div className="pro-card p-5 rounded-2xl flex flex-col justify-between h-32 skeleton border-none" />
);

export const LogSkeleton = () => (
  <div className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 skeleton h-20" />
);

export const DreamCardSkeleton = () => (
  <div className="pro-card rounded-[2.5rem] p-8 h-64 skeleton border-none" />
);

export const DashboardSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    <div className="h-12 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl" />
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => <StatCardSkeleton key={i} />)}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="pro-card p-6 rounded-2xl h-64 skeleton border-none" />
      <div className="pro-card p-6 rounded-2xl h-64 skeleton border-none" />
    </div>
  </div>
);
