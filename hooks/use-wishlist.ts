//@ts-nocheck
"use client";

import { useEffect, useState, useRef } from "react";
import { handleWishlist } from "@/lib/actions/wishlist.actions";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
}

export function useWishlist() {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const isFetching = useRef(false); // Prevents duplicate fetches

  useEffect(() => {
    if (isFetching.current) return;
    isFetching.current = true;

    const fetchWishlist = async () => {
      try {
        const res = await handleWishlist("", "fetch");

        if (res?.success && Array.isArray(res.wishlist)) {
          setWishlist(res.wishlist as Product[]);
        } else {
          console.warn("Unexpected wishlist response:", res);
          setWishlist([]); // Fallback to empty array
        }
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      }
    };

    fetchWishlist();
  }, []);

  const toggleWishlist = async (product: Product) => {
    const isWishlisted = wishlist.some((p) => p._id === product._id);
    const action = isWishlisted ? "remove" : "add";

    // Optimistic UI update (instant feedback)
    setWishlist((prev) =>
      isWishlisted
        ? prev.filter((p) => p._id !== product._id)
        : [...prev, product]
    );

    try {
      const res = await handleWishlist(product._id, action);

      if (res?.success && Array.isArray(res.wishlist)) {
        setWishlist(res.wishlist as Product[]);
      } else {
        console.warn("Unexpected wishlist response:", res);
        throw new Error("Failed to update wishlist");
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      // Revert UI if API fails
      setWishlist((prev) =>
        isWishlisted
          ? [...prev, product]
          : prev.filter((p) => p._id !== product._id)
      );
    }
  };

  return { wishlist, toggleWishlist };
}
