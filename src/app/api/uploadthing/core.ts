import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";

const f = createUploadthing();

// Define the metadata type
type UploadThingMetadata = {
  url: string;
  user: {
    id: string;
    avatarUrl?: string;
  };
  // Add other metadata properties if needed
};

export const fileRouter = {
  avatar: f({
    image: { maxFileSize: "512KB" },
  })
    .middleware(async () => {
      const { user } = await validateRequest();
      if (!user) throw new UploadThingError("Unauthorized");
      return { user };
    })
    .onUploadComplete(async ({ metadata, file }: { metadata: UploadThingMetadata; file: any }) => {
      const oldAvatarUrl = metadata.user.avatarUrl;

      if (oldAvatarUrl) {
        const key = oldAvatarUrl.split(
          `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
        )[1];

        await new UTApi().deleteFiles(key);
      }

      const newAvatarUrl = file.url.replace(
        "/f/",
        `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
      );

      console.log('New avatar URL:', newAvatarUrl);
      console.log('APP_ID:', process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID);

      await Promise.all([
        prisma.user.update({
          where: { id: metadata.user.id },
          data: {
            avatarUrl: newAvatarUrl,
          },
        }),
        streamServerClient.partialUpdateUser({
          id: metadata.user.id,
          set: {
            image: newAvatarUrl,
          },
        }),
      ]);

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
    .onUploadComplete(async ({ metadata, file }: { metadata: UploadThingMetadata; file: any }) => {
      console.log('Original URL:', metadata.url);
      const url = metadata.url.replace(
        "/f/",
        `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
      );

      console.log('Transformed URL:', url);
      console.log('APP_ID:', process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID);

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