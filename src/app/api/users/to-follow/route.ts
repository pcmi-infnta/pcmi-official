import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";

export async function GET() {
  const { user } = await validateRequest();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const usersToFollow = await prisma.user.findMany({
      where: {
        NOT: {
          id: user.id,
        },
        followers: {
          none: {
            followerId: user.id,
          },
        },
      },
      select: getUserDataSelect(user.id), 
      take: 20,
      orderBy: {
        createdAt: 'desc'
      }
    });

    return Response.json(usersToFollow);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}