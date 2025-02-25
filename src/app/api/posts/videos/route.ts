import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude, PostsPage } from "@/lib/types";
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
      // Only fetch posts that have videos
      attachments: {
        some: {
          type: "VIDEO",
        },
      },
    },
    include: getPostDataInclude(user.id),
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