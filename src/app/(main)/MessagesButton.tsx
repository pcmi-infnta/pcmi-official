"use client";

import { Button } from "@/components/ui/button";
import kyInstance from "@/lib/ky";
import { MessageCountInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { MessagesSquare } from "lucide-react";
import Link from "next/link";

interface MessagesButtonProps {
  initialState: MessageCountInfo;
}

export default function MessagesButton({ initialState }: MessagesButtonProps) {
  const { data } = useQuery({
    queryKey: ["unread-messages-count"],
    queryFn: () =>
      kyInstance.get("/api/messages/unread-count").json<MessageCountInfo>(),
    initialData: initialState,
    refetchInterval: 60 * 1000,
  });

  return (
    <Button
  variant="ghost"
  className="flex items-center justify-start gap-3 w-full md:w-auto"
  title="Messages"
  asChild
>
  <Link href="/messages" className="w-full">
    <MessagesSquare className="h-5 w-5" />
    <span>Messages</span>
    {data.unreadCount > 0 && (
      <span className="ml-auto rounded-full bg-primary px-2 text-sm text-primary-foreground">
        {data.unreadCount}
      </span>
    )}
  </Link>
</Button>
  );
}
