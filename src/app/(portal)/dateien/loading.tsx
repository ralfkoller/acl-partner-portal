import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="animate-fade-in space-y-6">
      {/* Page Title */}
      <Skeleton className="h-8 w-40 bg-white/[0.1]" />

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-full bg-white/[0.1]" />
        ))}
        <div className="ml-auto">
          <Skeleton className="h-10 w-64 rounded-lg bg-white/[0.1]" />
        </div>
      </div>

      {/* File Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl bg-white/[0.07] border border-white/[0.12] p-5 space-y-3"
          >
            <Skeleton className="h-10 w-10 rounded-lg bg-white/[0.1]" />
            <Skeleton className="h-5 w-3/4 bg-white/[0.1]" />
            <Skeleton className="h-4 w-full bg-white/[0.1]" />
            <Skeleton className="h-4 w-2/3 bg-white/[0.1]" />
          </div>
        ))}
      </div>
    </div>
  );
}
