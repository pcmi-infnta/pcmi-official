import { validateRequest } from "@/auth";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { Bookmark, Home, Users, TvMinimalPlay } from "lucide-react";
import Link from "next/link";
import MessagesButton from "./MessagesButton";
import NotificationsButton from "./NotificationsButton";

interface MenuBarProps {
  className?: string;
}

export default async function MenuBar({ className }: MenuBarProps) {
  const { user } = await validateRequest();

  if (!user) return null;

  const [unreadNotificationsCount, unreadMessagesCount] = await Promise.all([
    prisma.notification.count({
      where: {
        recipientId: user.id,
        read: false,
      },
    }),
    (await streamServerClient.getUnreadCount(user.id)).total_unread_count,
  ]);

  return (
    <div className={`${className} flex flex-row items-center`}>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Home"
        asChild
      >
        <Link href="/">
          <Home />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>

      <Button
  variant="ghost"
  className="flex items-center justify-start gap-3"
  title="People"
  asChild 
>
  <Link href="/people">
    <Users className="h-6 w-6" />
    <span className="hidden lg:inline">People</span>
  </Link>
</Button>

<Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Videos"
        asChild
      >
        <Link href="/videos">
          <TvMinimalPlay className="h-6 w-6" />
          <span className="hidden lg:inline">Videos</span>
        </Link>
      </Button>

      <NotificationsButton
        initialState={{ unreadCount: unreadNotificationsCount }}
      />

 <MessagesButton initialState={{ unreadCount: unreadMessagesCount }} />

      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Bookmarks"
        asChild
      >
        <Link href="/bookmarks">
          <Bookmark />
          <span className="hidden lg:inline">Bookmarks</span>
        </Link>
      </Button>
    </div>
  );
}
