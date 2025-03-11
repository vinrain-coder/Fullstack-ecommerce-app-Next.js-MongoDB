// hooks/use-wishlist-store.ts
"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface WishlistState {
  wishlist: string[];
  toggleWishlist: (productId: string) => Promise<void>;
  syncWishlist: () => Promise<void>;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlist: [],

      syncWishlist: async () => {
        const { data: session } = useSession();
        if (!session?.user) return set({ wishlist: [] });
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

      toggleWishlist: async (productId: string) => {
        const { data: session } = useSession();
        if (!session?.user) {
          toast.error("Please log in to use wishlist", {
            action: {
              label: "Login",
              onClick: () => (window.location.href = "/login"),
            },
          });
          return;
        }

        const isWished = get().wishlist.includes(productId);
        const newWishlist = isWished
          ? get().wishlist.filter((id) => id !== productId)
          : [...get().wishlist, productId];

        set({ wishlist: newWishlist });

        try {
          const res = await fetch("/api/wishlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              productId,
              action: isWished ? "remove" : "add",
            }),
          });
          if (!res.ok) throw new Error("Wishlist update failed");
        } catch (error) {
          console.error("Wishlist update failed", error);
          toast.error("Could not update wishlist");
          set({ wishlist: get().wishlist });
        }
      },
    }),
    { name: "wishlist-storage" }
  )
);
