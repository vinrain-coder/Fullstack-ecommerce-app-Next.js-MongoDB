"use server";
import { auth } from "@/auth";
import { Types } from "mongoose";
import { connectToDatabase } from "../db";
import User from "../db/models/user.model";
import Product from "../db/models/product.model";

export async function handleWishlist(
  productId: string,
  action: "add" | "remove"
) {
  await connectToDatabase();
  const session = await auth();
  if (!session) throw new Error("User not authenticated");

  const user = await User.findById(session.user.id);
  if (!user) throw new Error("User not found");

  if (!Types.ObjectId.isValid(productId)) throw new Error("Invalid product ID");

  const productObjectId = new Types.ObjectId(productId);
  const productExists = await Product.findById(productObjectId);
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
  };
}
