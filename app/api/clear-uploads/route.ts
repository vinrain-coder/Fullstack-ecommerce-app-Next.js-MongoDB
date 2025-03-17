"use server";

import { UTApi } from "uploadthing/server";
import { connectToDatabase } from "@/lib/db";
import Product from "@/lib/db/models/product.model";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return Response.json(
        { message: "Invalid authorization header" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Get all images currently used in products
    const products = await Product.find({}, "images");
    const usedImages = new Set(products.flatMap((p) => p.images));

    // Fetch all uploaded files from UploadThing
    const utApi = new UTApi();
    const uploadedFiles = (await utApi.listFiles()).files;

    if (!uploadedFiles.length) {
      return Response.json({ success: true, message: "No files to delete." });
    }

    // Find unused files (not in any product)
    const unusedFiles = uploadedFiles.filter(
      (file) => !usedImages.has(`https://utfs.io/f/${file.key}`)
    );

    if (unusedFiles.length > 0) {
      const fileKeys = unusedFiles.map((file) => file.key);
      await utApi.deleteFiles(fileKeys);
    }

    return Response.json({
      success: true,
      deletedCount: unusedFiles.length,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
