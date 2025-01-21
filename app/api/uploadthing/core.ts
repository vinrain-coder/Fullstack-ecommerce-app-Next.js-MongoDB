import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@/auth";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 5 } }) // Adjust file size and count as needed
    .middleware(async () => {
      // Authenticate the user
      const session = await auth();

      if (!session || !session.user?.id) {
        throw new UploadThingError("Unauthorized");
      }

      // // Ensure the user has admin privileges (adjust this based on your auth logic)
      // if (session.user.role !== "admin") {
      //   throw new UploadThingError("Insufficient permissions");
      // }

      // Metadata available to `onUploadComplete`
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Log the upload event for debugging or audit purposes
      console.log("File uploaded successfully:", {
        userId: metadata.userId,
        fileUrl: file.url,
        fileName: file.name,
        fileSize: file.size,
      });

      // No further processing or database interaction
      return { uploadedBy: metadata.userId, fileUrl: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
