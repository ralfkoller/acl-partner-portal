import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="animate-fade-in space-y-8">
      {/* Hero Banner */}
      <Skeleton className="h-48 w-full rounded-xl bg-white/[0.07]" />

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

      {/* Section Header — Neueste Beiträge */}
      <div className="space-y-4">
        <Skeleton className="h-7 w-48 bg-white/[0.1]" />

        {/* News Cards */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl bg-white/[0.07] border border-white/[0.12] p-5 space-y-3"
            >
              <Skeleton className="h-5 w-3/4 bg-white/[0.1]" />
              <Skeleton className="h-4 w-full bg-white/[0.1]" />
              <Skeleton className="h-4 w-5/6 bg-white/[0.1]" />
              <Skeleton className="h-3 w-28 bg-white/[0.1]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
