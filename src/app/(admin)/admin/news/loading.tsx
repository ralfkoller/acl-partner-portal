import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-36 bg-white/[0.1]" />
        <Skeleton className="h-10 w-40 rounded-lg bg-white/[0.1]" />
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white/[0.07] border border-white/[0.12] overflow-hidden">
        <div className="grid grid-cols-[1fr_140px_120px_100px] gap-4 border-b border-white/[0.06] px-5 py-3">
          <Skeleton className="h-4 w-16 bg-white/[0.1]" />
          <Skeleton className="h-4 w-14 bg-white/[0.1]" />
          <Skeleton className="h-4 w-12 bg-white/[0.1]" />
          <Skeleton className="h-4 w-16 bg-white/[0.1]" />
        </div>

        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[1fr_140px_120px_100px] gap-4 border-b border-white/[0.06] last:border-b-0 px-5 py-4"
          >
            <Skeleton className="h-5 w-3/4 bg-white/[0.1]" />
            <Skeleton className="h-4 w-24 bg-white/[0.1]" />
            <Skeleton className="h-6 w-20 rounded-full bg-white/[0.1]" />
            <Skeleton className="h-8 w-16 rounded-lg bg-white/[0.1]" />
          </div>
        ))}
      </div>
    </div>
  );
}
