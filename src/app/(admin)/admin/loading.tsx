import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="animate-fade-in space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl bg-white/[0.07] border border-white/[0.12] p-5 space-y-3"
          >
            <Skeleton className="h-4 w-24 bg-white/[0.1]" />
            <Skeleton className="h-8 w-16 bg-white/[0.1]" />
            <Skeleton className="h-3 w-32 bg-white/[0.1]" />
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-36 bg-white/[0.1]" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-xl bg-white/[0.1]" />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-40 bg-white/[0.1]" />
        <div className="rounded-xl bg-white/[0.07] border border-white/[0.12] divide-y divide-white/[0.06]">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <Skeleton className="h-9 w-9 rounded-full bg-white/[0.1]" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4 bg-white/[0.1]" />
                <Skeleton className="h-3 w-1/3 bg-white/[0.1]" />
              </div>
              <Skeleton className="h-3 w-16 bg-white/[0.1]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
