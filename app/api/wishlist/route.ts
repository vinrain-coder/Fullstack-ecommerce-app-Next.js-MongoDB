import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db";
import User from "@/lib/db/models/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDatabase();
  const session = await auth();
  if (!session) return NextResponse.json([], { status: 401 });

  const user = await User.findById(session.user.id).populate("wishlist");
  if (!user) return NextResponse.json([], { status: 404 });

  return NextResponse.json(user.wishlist);
}
