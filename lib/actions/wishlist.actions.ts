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

  const user = await User.findById(session.user.id).populate({
    path: "wishlist",
    select: "_id",
  });

  if (!user) throw new Error("User not found");

  if (action === "fetch") {
    return {
      success: true,
      wishlist: user.wishlist.map((p) => p._id.toString()),
    };
  }

  const productObjectId = new mongoose.Types.ObjectId(productId);
  const productExists = await Product.exists({ _id: productObjectId });

  if (!productExists) throw new Error("Product not found");

  if (action === "add" && !user.wishlist.includes(productObjectId)) {
    user.wishlist.push(productObjectId);
  } else if (action === "remove") {
    user.wishlist = user.wishlist.filter((id) => !id.equals(productObjectId));
  }

  await user.save();

  return {
    success: true,
    message: action === "add" ? "Added to wishlist" : "Removed from wishlist",
    wishlist: user.wishlist.map((p) => p._id.toString()), // Ensure wishlist is an array of product IDs
  };
}
