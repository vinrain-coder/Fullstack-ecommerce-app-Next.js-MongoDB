"use client";

import { addToWishlist, getWishlist, removeFromWishlist } from "@/lib/actions/wishlist.actions";
import { create } from "zustand";

interface WishlistState {
  wishlist: string[];
  fetchWishlist: () => Promise<void>;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  resetWishlist: () => void;
}

export const useWishlist = create<WishlistState>((set) => ({
  wishlist: [],

  fetchWishlist: async () => {
    try {
      const data = await getWishlist();
      set({ wishlist: data });
    } catch {
      set({ wishlist: [] });
    }
  },

  addToWishlist: async (productId: string) => {
    try {
      const data = await addToWishlist(productId);
      set({ wishlist: data });
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  },

  removeFromWishlist: async (productId: string) => {
    try {
      const data = await removeFromWishlist(productId);
      set({ wishlist: data });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  },

  resetWishlist: () => set({ wishlist: [] }),
}));
