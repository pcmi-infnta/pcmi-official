import { Skeleton } from "../ui/skeleton";

export default function PostsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <PostLoadingSkeleton />
      <PostLoadingSkeleton />
      <PostLoadingSkeleton />
    </div>
  );
} 

function PostLoadingSkeleton() {
  return (
    <div className="w-full space-y-4 rounded-2xl bg-card p-5 shadow-sm border border-border/30">
      <div className="flex flex-wrap gap-3">
        <Skeleton className="size-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4.5 w-32 rounded-md" />
          <Skeleton className="h-3.5 w-24 rounded-md" />
        </div>
      </div>
      <Skeleton className="h-20 rounded-lg" />
      <div className="flex gap-4 pt-1">
        <Skeleton className="h-8 w-20 rounded-md" />
        <Skeleton className="h-8 w-20 rounded-md" />
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
    </div>
  );
}