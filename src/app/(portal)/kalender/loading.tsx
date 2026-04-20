import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="animate-fade-in space-y-6">
      {/* Page Title */}
      <Skeleton className="h-8 w-36 bg-white/[0.1]" />

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Calendar Grid */}
        <div className="rounded-xl bg-white/[0.07] border border-white/[0.12] p-5 space-y-4">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2">
            {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((day) => (
              <Skeleton key={day} className="h-5 w-full rounded bg-white/[0.1]" />
            ))}
          </div>
          {/* Calendar Cells — 5 rows × 7 cols */}
          {Array.from({ length: 5 }).map((_, row) => (
            <div key={row} className="grid grid-cols-7 gap-2">
              {Array.from({ length: 7 }).map((_, col) => (
                <Skeleton
                  key={col}
                  className="h-12 w-full rounded-lg bg-white/[0.1]"
                />
              ))}
            </div>
          ))}
        </div>

        {/* Event Cards */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl bg-white/[0.07] border border-white/[0.12] p-4 space-y-3"
            >
              <Skeleton className="h-4 w-20 bg-white/[0.1]" />
              <Skeleton className="h-5 w-3/4 bg-white/[0.1]" />
              <Skeleton className="h-4 w-full bg-white/[0.1]" />
              <Skeleton className="h-3 w-28 bg-white/[0.1]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
