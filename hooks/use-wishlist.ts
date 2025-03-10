"use client";

import { useEffect, useState, useRef } from "react";
import { handleWishlist } from "@/lib/actions/wishlist.actions";

export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const isFetching = useRef(false); // Prevents duplicate fetches

  useEffect(() => {
    if (isFetching.current) return; // Prevent multiple API calls
    isFetching.current = true;

    const fetchWishlist = async () => {
      try {
        const res = await handleWishlist("", "fetch");
        if (res.success && Array.isArray(res.wishlist)) {
          setWishlist(res.wishlist);
        }
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      }
    };

    fetchWishlist();
  }, []);

  const toggleWishlist = async (productId: string) => {
    const isWishlisted = wishlist.includes(productId);
    const action = isWishlisted ? "remove" : "add";

    // Optimistic UI update (instant feedback)
    setWishlist((prev) =>
      isWishlisted
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );

    try {
      const res = await handleWishlist(productId, action);
      if (res.success && Array.isArray(res.wishlist)) {
        setWishlist(res.wishlist); // Sync state with database response
      } else {
        throw new Error("Failed to update wishlist");
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      // Revert UI if API fails
      setWishlist((prev) =>
        isWishlisted
          ? [...prev, productId]
          : prev.filter((id) => id !== productId)
      );
    }
  };

  return { wishlist, toggleWishlist };
}
