"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import kyInstance from "@/lib/ky";
import { PostsPage } from "@/lib/types";

export default function VideosFeed() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "videos"],
    queryFn: async ({ pageParam }) => {
      const url = pageParam 
        ? `/api/posts/videos?cursor=${pageParam}`
        : "/api/posts/videos";
      return kyInstance.get(url).json<PostsPage>();
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  if (status === "pending") {
    return <PostsLoadingSkeleton />;
  }

  if (status === "success" && posts.length === 0 && !hasNextPage) {
    return <div className="text-center py-10">No videos have been uploaded yet.</div>;
  }

  if (status === "error") {
    return <div className="text-center py-10">Error loading videos. Please try again.</div>;
  }

  return (
    <InfiniteScrollContainer
      onBottomReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
    >
      <div className="space-y-5">
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
        {isFetchingNextPage && (
          <div className="flex justify-center py-5">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
      </div>
    </InfiniteScrollContainer>
  );
}