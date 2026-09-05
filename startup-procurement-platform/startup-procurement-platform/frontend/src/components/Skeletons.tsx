import React from 'react';

export function SkeletonLine() {
  return <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />;
}

export function SkeletonBlock() {
  return <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />;
}

export function SkeletonCard() {
  return (
    <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
      <div className="space-y-3">
        <SkeletonLine />
        <SkeletonLine />
        <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
      </div>
    </div>
  );
}

export function SkeletonCircle() {
  return <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />;
}

export function SkeletonTable({ rows = 5, columns = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-3">
          {Array.from({ length: columns }).map((_, j) => (
            <div key={j} className="flex-1 h-10 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonGrid({ items = 6, columns = 3 }) {
  return (
    <div className={`grid gap-4 grid-cols-1 md:grid-cols-${columns}`}>
      {Array.from({ length: items }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonList({ items = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded">
          <SkeletonCircle />
          <div className="flex-1 space-y-2">
            <SkeletonLine />
            <SkeletonLine />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonHeader() {
  return (
    <div className="space-y-4">
      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-3/4" />
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-1/2" />
    </div>
  );
}
