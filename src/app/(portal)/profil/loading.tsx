import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="animate-fade-in space-y-6">
      {/* Page Title */}
      <Skeleton className="h-8 w-32 bg-white/[0.1]" />

      {/* Profile Card */}
      <div className="rounded-xl bg-white/[0.07] border border-white/[0.12] p-6 space-y-6 max-w-2xl">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-20 w-20 rounded-full bg-white/[0.1]" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40 bg-white/[0.1]" />
            <Skeleton className="h-4 w-28 bg-white/[0.1]" />
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16 bg-white/[0.1]" />
            <Skeleton className="h-10 w-full rounded-lg bg-white/[0.1]" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20 bg-white/[0.1]" />
            <Skeleton className="h-10 w-full rounded-lg bg-white/[0.1]" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16 bg-white/[0.1]" />
            <Skeleton className="h-10 w-full rounded-lg bg-white/[0.1]" />
          </div>
        </div>

        {/* Save Button */}
        <Skeleton className="h-10 w-32 rounded-lg bg-white/[0.1]" />
      </div>
    </div>
  );
}
