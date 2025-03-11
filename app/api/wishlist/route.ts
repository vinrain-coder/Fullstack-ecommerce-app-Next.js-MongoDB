import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db";
import User from "@/lib/db/models/user.model";
import Product from "@/lib/db/models/product.model";

export async function POST(req: Request) {
  await connectToDatabase();
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    console.log("Received Wishlist Request:", body);

    const { productId, action } = body;
    if (!productId || !["add", "remove"].includes(action)) {
      console.error("Invalid wishlist request:", body);
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (action === "add") {
      if (!user.wishlist.includes(productId)) {
        user.wishlist.push(productId);
      }
    } else {
      user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    }

    await user.save();
    return NextResponse.json({ wishlist: user.wishlist });
  } catch (error) {
    console.error("Wishlist error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  await connectToDatabase();
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await User.findById(session.user.id).populate("wishlist");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ wishlist: user.wishlist || [] });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
