"use client";

import { handleWishlist } from "@/lib/actions/wishlist.actions";
import { useTransition } from "react";
import { toast } from "sonner";

export default function useWishlist() {
  const [isPending, startTransition] = useTransition();

  const toggleWishlist = (productId: string, isInWishlist: boolean) => {
    startTransition(async () => {
      try {
        const action = isInWishlist ? "remove" : "add";
        const response = await handleWishlist(productId, action);

        if (response.success) {
          toast.success(response.message);
        } else {
          toast.error("Something went wrong");
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to update wishlist");
      }
    });
  };

  return { toggleWishlist, isPending };
}
