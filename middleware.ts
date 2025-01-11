import NextAuth from "next-auth";
import authConfig from "./auth.config";

// const intlMiddleware = createMiddleware(routing)
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
