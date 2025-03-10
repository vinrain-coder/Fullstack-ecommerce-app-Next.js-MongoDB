"use server";

import { auth } from "@/auth";
import { connectToDatabase } from "../db";
import User from "../db/models/user.model";
import Product from "../db/models/product.model";
import mongoose from "mongoose";

export async function handleWishlist(
  productId: string,
  action: "add" | "remove" | "fetch"
) {
  await connectToDatabase();
  const session = await auth();
  if (!session) throw new Error("User not authenticated");

  const userId = session.user.id;

  if (action === "fetch") {
    const user = await User.findById(userId, "wishlist");
    if (!user) throw new Error("User not found");

    return {
      success: true,
      wishlist: user.wishlist.map((p) => p.toString()),
    };
  }

  // Validate Product ID
  const productObjectId = new mongoose.Types.ObjectId(productId);
  if (!(await Product.exists({ _id: productObjectId }))) {
    throw new Error("Product not found");
  }

  // Use atomic update to modify wishlist efficiently
  const update =
    action === "add"
      ? { $addToSet: { wishlist: productObjectId } }
      : { $pull: { wishlist: productObjectId } };

  const updatedUser = await User.findByIdAndUpdate(userId, update, {
    new: true,
    select: "wishlist",
  });

  if (!updatedUser) throw new Error("User not found");

  return {
    success: true,
    message: action === "add" ? "Added to wishlist" : "Removed from wishlist",
    wishlist: updatedUser.wishlist.map((p) => p.toString()), // Ensure wishlist returns an array of product IDs
  };
}
