export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-10 w-64 bg-zinc-200 dark:bg-zinc-800" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700" />
        ))}
      </div>
      <div className="h-64 bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700" />
    </div>
  );
}
