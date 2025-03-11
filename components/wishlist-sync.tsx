"use client";

import { useWishlist } from "@/hooks/use-wishlist-store";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function WishlistSync() {
  const { data: session } = useSession();
  const { fetchWishlist, resetWishlist } = useWishlist();

  useEffect(() => {
    if (session) {
      fetchWishlist();
    } else {
      resetWishlist();
    }
  }, [session]);

  return null;
}
