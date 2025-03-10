// src/context/WishlistContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { handleWishlist } from "@/lib/actions/wishlist.actions";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { data: session } = useSession();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (session) {
      fetchWishlist();
    }
  }, [session]);

  const fetchWishlist = async () => {
    try {
      const res = await handleWishlist("", "fetch"); // Create a fetch-only action
      if (res.success) setWishlist(res.wishlist);
    } catch (error) {
      console.error("Failed to fetch wishlist", error);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, setWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
