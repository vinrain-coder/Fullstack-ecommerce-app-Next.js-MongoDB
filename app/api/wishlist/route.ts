import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db";
import User from "@/lib/db/models/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase(); // Connect to DB only if user is authenticated

    const user = await User.findById(session.user.id)
      .populate({
        path: "wishlist",
        select: "_id name slug price images", // Select only necessary fields
      })
      .lean(); // Improve performance

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, wishlist: user.wishlist },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
