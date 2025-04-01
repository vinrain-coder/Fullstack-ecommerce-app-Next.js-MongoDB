import { MongoDBAdapter } from "@auth/mongodb-adapter";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./lib/db";
import client from "./lib/db/client";
import User from "./lib/db/models/user.model";

import NextAuth, { type DefaultSession } from "next-auth";
import authConfig from "./auth.config";

// Extend the User and AdapterUser types in NextAuth to include wishlist and role
declare module "next-auth" {
  interface Session {
    user: {
      role: string;
      wishlist: string[];
    } & DefaultSession["user"];
  }

  interface User {
    wishlist: string[]; // Add wishlist here to ensure it's recognized in the user object
    role: string; // Add role to ensure it's recognized in the user object
  }

  // Extending the AdapterUser type to include wishlist and role
  interface AdapterUser {
    wishlist: string[]; // Custom wishlist field
    role: string; // Custom role field
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  pages: {
    signIn: "/sign-in",
    newUser: "/sign-up",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  //@ts-ignore
  adapter: MongoDBAdapter(client),
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        await connectToDatabase();
        if (credentials == null) return null;

        const user = await User.findOne({ email: credentials.email });

        if (user && user.password) {
          const isMatch = await bcrypt.compare(
            credentials.password as string,
            user.password
          );
          if (isMatch) {
            return {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
              role: user.role,
              wishlist: user.wishlist.map((productId) => productId.toString()), // Ensure wishlist is included
            };
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      if (user) {
        if (!user.name) {
          await connectToDatabase();
          await User.findByIdAndUpdate(user.id, {
            name: user.name || user.email!.split("@")[0],
            role: "user",
          });
        }
        token.name = user.name || user.email!.split("@")[0];
        token.role = (user as { role: string }).role;
        token.wishlist = user.wishlist || []; // Ensure wishlist is added to the token
      }

      if (session?.user?.name && trigger === "update") {
        token.name = session.user.name;
      }
      return token;
    },
    session: async ({ session, user, trigger, token }) => {
      session.user.id = token.sub as string;
      session.user.role = token.role as string;
      session.user.wishlist = token.wishlist as string[]; // Ensure wishlist is set in the session
      session.user.name = token.name;
      if (trigger === "update") {
        session.user.name = user.name;
      }
      return session;
    },
  },
});
