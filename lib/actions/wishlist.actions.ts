"use server";

import mongoose, { Types } from "mongoose";
import { connectToDatabase } from "../db";
import { auth } from "@/auth";
import User from "../db/models/user.model";

export async function getWishlist() {
  await connectToDatabase();
  const session = await auth();

  if (!session) return [];

  const user = await User.findOne({ email: session.user?.email }).populate("wishlist");

  if (!user) return [];

  return user.wishlist.map((item: any) => item._id.toString());
}

export async function addToWishlist(productId: string) {
  await connectToDatabase();
  const session = await auth();

  if (!session) return [];

  let user = await User.findOne({ email: session.user?.email });

  if (!user) {
    return [];
  }

  const productObjectId = new mongoose.Types.ObjectId(productId); // Convert to ObjectId

  if (!user.wishlist.includes(productObjectId)) {
    user.wishlist.push(productObjectId);
    await user.save();
  }

  return user.wishlist.map((item: any) => item.toString());
}

export async function removeFromWishlist(productId: string) {
  await connectToDatabase();
  const session = await auth();

  if (!session) return [];

  let user = await User.findOne({ email: session.user?.email });

  if (!user) {
    return [];
  }

  const productObjectId = new mongoose.Types.ObjectId(productId); // Convert to ObjectId

  user.wishlist = user.wishlist.filter((id) => !id.equals(productObjectId));
  await user.save();

  return user.wishlist.map((item: any) => item.toString());
}
