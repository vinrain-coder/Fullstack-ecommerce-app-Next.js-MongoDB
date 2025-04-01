import { ObjectId } from "mongoose";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    wishlist: string[];
  }

  interface Session {
    user: User;
  }
}
