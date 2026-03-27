import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="animate-fade-in space-y-6 max-w-4xl">
      {/* Back Link */}
      <Skeleton className="h-5 w-32" />

      {/* Title Input */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>

      {/* Tiptap Editor */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-14" />
        {/* Toolbar */}
        <div className="flex items-center gap-2 rounded-t-lg border border-b-0 p-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded" />
          ))}
        </div>
        {/* Editor Body */}
        <Skeleton className="h-72 w-full rounded-b-lg" />
      </div>

      {/* Bottom Controls */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-11 rounded-full" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-28 rounded-lg" />
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
