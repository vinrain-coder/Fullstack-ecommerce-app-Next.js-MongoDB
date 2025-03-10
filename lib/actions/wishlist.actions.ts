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
    const user = await User.findById(userId)
      .populate({
        path: "wishlist",
        select: "_id name slug price images", // Ensure product details are fetched
      })
      .lean(); // Converts Mongoose document to plain object

    if (!user) throw new Error("User not found");

    return {
      success: true,
      wishlist: Array.isArray(user.wishlist) ? user.wishlist : [],
    };
  }

  // Validate Product ID
  const productObjectId = new mongoose.Types.ObjectId(productId);
  if (!(await Product.exists({ _id: productObjectId }))) {
    throw new Error("Product not found");
  }

  const update =
    action === "add"
      ? { $addToSet: { wishlist: productObjectId } }
      : { $pull: { wishlist: productObjectId } };

  const updatedUser = await User.findByIdAndUpdate(userId, update, {
    new: true,
  })
    .populate({
      path: "wishlist",
      select: "_id name slug price images",
    })
    .lean();

  if (!updatedUser) throw new Error("User not found");

  return {
    success: true,
    message: action === "add" ? "Added to wishlist" : "Removed from wishlist",
    wishlist: Array.isArray(updatedUser.wishlist) ? updatedUser.wishlist : [],
  };
}
