import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb"; // Import ObjectId

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId, action } = await req.json();
  if (!productId || !["add", "remove"].includes(action)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db(); // Get database instance
    const userId = new ObjectId(session.user.id); // Convert user ID to ObjectId

    const user = await db.collection("users").findOne({ _id: userId });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let wishlist = user.wishlist || [];

    if (action === "add") {
      if (!wishlist.includes(productId)) wishlist.push(productId);
    } else {
      wishlist = wishlist.filter((id: string) => id !== productId);
    }

    await db
      .collection("users")
      .updateOne({ _id: userId }, { $set: { wishlist } });

    return NextResponse.json({ wishlist });
  } catch (error) {
    console.error("Wishlist error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
