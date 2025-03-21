import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    wishlist: string[]; // Add wishlist property
  }

  interface Session {
    user: User;
  }
}
