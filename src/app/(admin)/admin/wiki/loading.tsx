import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-10 w-48 rounded-lg" />
      </div>

      {/* FAQ Categories */}
      {Array.from({ length: 2 }).map((_, catIdx) => (
        <div key={catIdx} className="space-y-3">
          {/* Category Header */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-8 w-20 rounded-lg" />
          </div>

          {/* FAQ Items */}
          {Array.from({ length: 2 }).map((_, itemIdx) => (
            <div
              key={itemIdx}
              className="rounded-xl border-l-4 border-l-acl-orange bg-white p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-8 w-16 rounded-lg" />
              </div>
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
