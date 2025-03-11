"use client";
import { create } from "zustand";
import { toast } from "sonner";

interface WishlistState {
  wishlist: string[];
  syncWishlist: (sessionUser: any) => Promise<void>;
  toggleWishlist: (productId: string, sessionUser: any) => Promise<void>;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlist: [],

  syncWishlist: async (sessionUser) => {
    if (!sessionUser) return set({ wishlist: [] });

    try {
      const res = await fetch("/api/wishlist");
      if (!res.ok) throw new Error("Failed to fetch wishlist");
      const data = await res.json();
      set({ wishlist: data.wishlist || [] });
    } catch (error) {
      console.error("Failed to sync wishlist", error);
      set({ wishlist: [] });
    }
  },

  toggleWishlist: async (productId, sessionUser) => {
    if (!sessionUser) {
      toast.error("Please log in to use wishlist", {
        action: {
          label: "Login",
          onClick: () => (window.location.href = "/login"),
        },
      });
      return;
    }

    console.log("Toggling wishlist for product:", productId);

    const isWished = get().wishlist.includes(productId);
    const action = isWished ? "remove" : "add";

    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, action }),
      });

      if (!res.ok) throw new Error("Wishlist update failed");

      const data = await res.json();
      set({ wishlist: data.wishlist });

      toast.success(
        action === "add"
          ? "Added to your wishlist ❤️"
          : "Removed from your wishlist"
      );
    } catch (error) {
      console.error("Wishlist update failed", error);
      toast.error("Could not update wishlist");
    }
  },
}));
