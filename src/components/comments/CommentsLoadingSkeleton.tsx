import { Skeleton } from "@/components/ui/skeleton";

export default function CommentsLoadingSkeleton() {
  return (
    <div className="space-y-4 pt-4">
      <Skeleton className="h-8 w-32 rounded-md" />
      <div className="space-y-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-10 w-10 flex-none rounded-full" />
            <div className="w-full space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-3 w-16 rounded-md" />
              </div>
              <Skeleton className="h-16 w-full rounded-md" />
              <div className="flex gap-3">
                <Skeleton className="h-6 w-16 rounded-md" />
                <Skeleton className="h-6 w-16 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}