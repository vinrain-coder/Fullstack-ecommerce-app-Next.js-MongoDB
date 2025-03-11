import { NextResponse } from "next/server";
import { auth } from "@/auth"; // Ensure this fetches session data
import { connectToDatabase } from "@/lib/db"; // Your MongoDB connection

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
    const db = await connectToDatabase();
    const userId = session.user.id;

    const user = await db.collection("users").findOne({ _id: userId });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let wishlist = user.wishlist || [];
    if (action === "add") {
      if (!wishlist.includes(productId)) wishlist.push(productId);
    } else {
      wishlist = wishlist.filter((id) => id !== productId);
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
