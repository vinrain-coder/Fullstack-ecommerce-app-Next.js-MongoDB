"use client";

import { useEffect, useState } from "react";
import { handleWishlist } from "@/lib/actions/wishlist.actions";

export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>([]); // Store wishlist as an array of product IDs

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await handleWishlist("", "fetch");
        if (res.success && Array.isArray(res.wishlist)) {
          setWishlist(res.wishlist);
        }
      } catch (error) {
        console.error("Failed to fetch wishlist", error);
      }
    };

    fetchWishlist();
  }, []);

  const toggleWishlist = async (productId: string) => {
    const isWishlisted = wishlist.includes(productId);
    const action = isWishlisted ? "remove" : "add";

    try {
      const res = await handleWishlist(productId, action);
      if (res.success && Array.isArray(res.wishlist)) {
        setWishlist(res.wishlist); // Update wishlist state with latest product IDs
      }
    } catch (error) {
      console.error("Error updating wishlist", error);
    }
  };

  return { wishlist, toggleWishlist };
}
