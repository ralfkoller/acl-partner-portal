import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="animate-fade-in space-y-6">
      {/* Page Title */}
      <Skeleton className="h-8 w-40" />

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-full" />
        ))}
        <div className="ml-auto">
          <Skeleton className="h-10 w-64 rounded-lg" />
        </div>
      </div>

      {/* File Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border-l-4 border-l-acl-orange bg-white p-5 space-y-3"
          >
            {/* Icon Placeholder */}
            <Skeleton className="h-10 w-10 rounded-lg" />
            {/* Title */}
            <Skeleton className="h-5 w-3/4" />
            {/* Description Lines */}
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
