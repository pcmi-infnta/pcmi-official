"use client";

import { useQuery } from "@tanstack/react-query";
import UserAvatar from "@/components/UserAvatar";
import UserTooltip from "@/components/UserTooltip";
import FollowButton from "@/components/FollowButton";
import Link from "next/link";
import VerifiedBadge from "@/components/VerifiedBadge";
import kyInstance from "@/lib/ky";
import { Skeleton } from "@/components/ui/skeleton";

type UserToFollow = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;  
  isVerified: boolean;
  createdAt: Date;  
  followers: Array<{
    followerId: string;
  }>;
  _count: {
    posts: number;   
    followers: number;
  };
};

function PeopleLoadingSkeleton() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <Skeleton className="h-9 w-36 mx-4 rounded-lg" />
        <div className="divide-y">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2.5">
                  <Skeleton className="h-4.5 w-28 rounded-md" />
                  <Skeleton className="h-3.5 w-24 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-9 w-28 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function PeoplePage() {
  const { data: usersToFollow, status } = useQuery<UserToFollow[]>({
    queryKey: ["users-to-follow"],
    queryFn: () => kyInstance.get("/api/users/to-follow").json<UserToFollow[]>(),
  });

  if (status === "pending") {
    return <PeopleLoadingSkeleton />;
  }

  if (status === "error") {
    return <p className="text-center text-destructive">Failed to load users.</p>;
  }

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <h1 className="text-2xl font-bold px-4">People</h1>
        <div className="divide-y">
          {usersToFollow.map((user) => (
            <div key={user.id} className="flex items-center justify-between gap-4 p-4">
              <UserTooltip user={user}>
                <Link
                  href={`/${user.username}`}
                  className="flex items-center gap-3"
                >
                  <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
                  <div>
                    <p className="line-clamp-1 break-all font-semibold hover:underline flex items-center">
                      {user.displayName}
                      {user.isVerified && (
                        <VerifiedBadge 
                          size="md" 
                          className="ml-1"
                        />
                      )}
                    </p>
                    <p className="line-clamp-1 break-all text-muted-foreground">
                      @{user.username}
                    </p>
                  </div>
                </Link>
              </UserTooltip>
              <FollowButton
                userId={user.id}
                initialState={{
                  followers: user._count.followers,
                  isFollowedByUser: user.followers.some(
                    ({ followerId }) => followerId === user.id,
                  ),
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}