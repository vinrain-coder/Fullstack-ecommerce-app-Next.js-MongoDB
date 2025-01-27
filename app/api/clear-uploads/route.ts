"use server";

import { connectToDatabase } from "@/lib/db";
// import Product from "@/lib/db/models/product.model";
import { UTApi } from "uploadthing/server";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return Response.json(
        { message: "Invalid authorization header" },
        { status: 401 }
      );
    }

    // Access the database
    const db = await connectToDatabase();

    // Find products where images are not associated with any product (or have null/empty productId)
    const unusedImages = await db
      .collection("products")
      .find({
        images: { $exists: true, $not: { $size: 0 } }, // Ensure that images array exists and is not empty
        ...(process.env.NODE_ENV === "production"
          ? {
              createdAt: {
                $lte: new Date(Date.now() - 1000 * 60 * 60 * 24),
              },
            }
          : {}),
      })
      .toArray();

    // Extract image URLs from products
    const imageUrls = unusedImages.flatMap((product) =>
      product.images.map((url: string) => url)
    );

    // Delete unused images from UploadThing
    const utApi = new UTApi();
    await utApi.deleteFiles(
      imageUrls.map(
        (url) => url.split(`/a/${process.env.UPLOADTHING_TOKEN}/`)[1]
      )
    );

    // Optional: Remove these image URLs from the products
    await db
      .collection("products")
      .updateMany(
        { images: { $in: imageUrls } },
        { $pull: { images: { $in: imageUrls } } }
      );

    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
