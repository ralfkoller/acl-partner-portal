import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="animate-fade-in space-y-6">
      {/* Page Title */}
      <Skeleton className="h-8 w-32" />

      {/* Search Bar */}
      <Skeleton className="h-11 w-full max-w-lg rounded-lg" />

      {/* FAQ Categories */}
      {Array.from({ length: 3 }).map((_, catIdx) => (
        <div key={catIdx} className="space-y-3">
          {/* Category Name */}
          <Skeleton className="h-6 w-44" />

          {/* Accordion Items */}
          {Array.from({ length: catIdx === 1 ? 3 : 2 }).map((_, itemIdx) => (
            <div
              key={itemIdx}
              className="rounded-xl border-l-4 border-l-acl-orange bg-white p-4 space-y-2"
            >
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
