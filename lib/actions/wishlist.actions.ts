"use server";

import { auth } from "@/auth";
import { connectToDatabase } from "../db";
import User from "../db/models/user.model";
import Product from "../db/models/product.model";
import mongoose from "mongoose";

export async function handleWishlist(
  productId: string,
  action: "add" | "remove"
) {
  await connectToDatabase();
  const session = await auth();
  if (!session) throw new Error("User not authenticated");

  // Convert productId to ObjectId
  const productObjectId = new mongoose.Types.ObjectId(productId);

  const user = await User.findById(session.user.id);
  if (!user) throw new Error("User not found");

  const product = await Product.findById(productObjectId);
  if (!product) throw new Error("Product not found");

  if (action === "add" && !user.wishlist.includes(productObjectId)) {
    user.wishlist.push(productObjectId);
  } else if (action === "remove") {
    user.wishlist = user.wishlist.filter((id) => !id.equals(productObjectId));
  }

  await user.save();
  return {
    success: true,
    message: action === "add" ? "Added to wishlist" : "Removed from wishlist",
  };
}
