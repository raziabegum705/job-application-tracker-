export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-5 py-4 border-b border-line dark:border-slate-800">
      <div className="skeleton w-9 h-9 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-3.5 w-1/3 rounded" />
        <div className="skeleton h-3 w-1/4 rounded" />
      </div>
      <div className="skeleton h-6 w-20 rounded-full" />
      <div className="skeleton h-3 w-16 rounded hidden sm:block" />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-line dark:border-slate-800 p-5 space-y-3">
      <div className="skeleton h-3 w-1/3 rounded" />
      <div className="skeleton h-7 w-1/2 rounded" />
      <div className="skeleton h-3 w-2/3 rounded" />
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-line dark:border-slate-800 p-6">
      <div className="skeleton h-4 w-1/3 rounded mb-4" />
      <div className="skeleton h-52 w-full rounded-xl" />
    </div>
  );
}
