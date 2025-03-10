import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db";
import User from "@/lib/db/models/user.model";

export async function GET() {
  await connectToDatabase();
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const user = await User.findById(session.user.id).populate("wishlist");
  if (!user) return new Response("User not found", { status: 404 });

  return Response.json({ wishlist: user.wishlist });
}
