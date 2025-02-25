import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { user } = await validateRequest();

  if (!user) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const cursor = request.nextUrl.searchParams.get("cursor");
  const limit = 10;

  const posts = await prisma.post.findMany({
  where: {
    attachments: {
      some: {
        type: "VIDEO",
      },
    },
  },
  include: {
    user: true,
    attachments: true,
    _count: {
      select: {
        comments: true,
        likes: true,
      },
    },
    likes: {
      where: {
        userId: user.id,
      },
      select: {
        userId: true,  // Select userId instead of id
        postId: true,  // You can also select postId if needed
      },
    },
    bookmarks: {
      where: {
        userId: user.id,
      },
      select: {
        id: true,  // This is fine since Bookmark has an id field
      },
    },
  },
  orderBy: {
    createdAt: "desc",
  },
  take: limit + 1,
  ...(cursor
    ? {
        cursor: {
          id: cursor,
        },
        skip: 1,
      }
    : {}),
});

  let nextCursor: string | null = null;
  if (posts.length > limit) {
    const nextItem = posts.pop();
    nextCursor = nextItem!.id;
  }

  return NextResponse.json({
    posts,
    nextCursor,
  });
}