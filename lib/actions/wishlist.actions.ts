import { auth } from "@/auth";
import { connectToDatabase } from "../db";

export async function toggleWishlist(productId: string) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, message: "Login required" };
  }

  const { db } = await connectToDatabase();
  const wishlistCollection = db.collection("wishlist");

  const userId = session.user.id;

  const existing = await wishlistCollection.findOne({ userId, productId });

  if (existing) {
    await wishlistCollection.deleteOne({ _id: existing._id });
    return { success: true, action: "removed" };
  } else {
    await wishlistCollection.insertOne({ userId, productId });
    return { success: true, action: "added" };
  }
}
