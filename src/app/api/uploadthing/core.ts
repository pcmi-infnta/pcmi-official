import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";

const f = createUploadthing();

// Define the metadata type to match what the middleware returns
interface UploadThingMetadata {
  user: {
    avatarUrl?: string;
    // Add other user properties as needed
  };
}

export const fileRouter = {
  avatar: f({
    image: { maxFileSize: "512KB" },
  })
    .middleware(async () => {
      const { user } = await validateRequest();
      if (!user) throw new UploadThingError("Unauthorized");
      return { user };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const oldAvatarUrl = metadata.user.avatarUrl;

      if (oldAvatarUrl) {
        const key = oldAvatarUrl.split(
          `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
        )[1];

        await new UTApi().deleteFiles(key);
      }

      const newAvatarUrl = file.url; // Use file.url directly
      console.log('New avatar URL:', newAvatarUrl);

      await prisma.user.update({
        where: { id: metadata.user.id },
        data: {
          avatarUrl: newAvatarUrl,
        },
      });

      await streamServerClient.partialUpdateUser({
        id: metadata.user.id,
        set: {
          image: newAvatarUrl,
        },
      });

      return { avatarUrl: newAvatarUrl };
    }),

  attachment: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
    video: { maxFileSize: "64MB", maxFileCount: 5 },
  })
    .middleware(async () => {
      const { user } = await validateRequest();
      if (!user) throw new UploadThingError("Unauthorized");
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      const url = file.url; // Use file.url directly
      console.log('Transformed URL:', url);

      const media = await prisma.media.create({
        data: {
          url,
          type: file.type.startsWith("image") ? "IMAGE" : "VIDEO",
        },
      });
      console.log("Created media record:", media);

      return { mediaId: media.id };
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;