import { Skeleton } from "@/components/ui/skeleton";
import PostLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";

export default function ProfileLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="relative h-32 w-full bg-muted/30">
          <Skeleton className="absolute -bottom-16 left-4 h-32 w-32 rounded-full border-4 border-background" />
        </div>
        <div className="mt-16 space-y-4 px-4">
          <div className="flex justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-40 rounded-md" />
              <Skeleton className="h-4 w-32 rounded-md" />
            </div>
            <Skeleton className="h-10 w-28 rounded-md" />
          </div>
          <Skeleton className="h-16 w-full rounded-md" />
          <div className="flex gap-4">
            <Skeleton className="h-5 w-24 rounded-md" />
            <Skeleton className="h-5 w-24 rounded-md" />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <PostLoadingSkeleton />
        <PostLoadingSkeleton />
      </div>
    </div>
  );
}