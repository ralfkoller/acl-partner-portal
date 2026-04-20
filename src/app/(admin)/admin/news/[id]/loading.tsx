import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="animate-fade-in space-y-6 max-w-4xl">
      <Skeleton className="h-5 w-32 bg-white/[0.1]" />

      <div className="space-y-2">
        <Skeleton className="h-4 w-12 bg-white/[0.1]" />
        <Skeleton className="h-12 w-full rounded-lg bg-white/[0.1]" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-14 bg-white/[0.1]" />
        <div className="flex items-center gap-2 rounded-t-lg border border-white/[0.12] border-b-0 p-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded bg-white/[0.1]" />
          ))}
        </div>
        <Skeleton className="h-72 w-full rounded-b-lg bg-white/[0.1]" />
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/[0.12]">
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-11 rounded-full bg-white/[0.1]" />
          <Skeleton className="h-4 w-28 bg-white/[0.1]" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-28 rounded-lg bg-white/[0.1]" />
          <Skeleton className="h-10 w-36 rounded-lg bg-white/[0.1]" />
        </div>
      </div>
    </div>
  );
}
