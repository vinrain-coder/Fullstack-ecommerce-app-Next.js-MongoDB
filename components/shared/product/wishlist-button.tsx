"use client";

import { useWishlistStore } from "@/hooks/use-wishlist-store";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function WishlistButton({ productId }: { productId: string }) {
  const { data: session } = useSession();
  const { wishlist, toggleWishlist } = useWishlistStore();
  const isWishlisted = wishlist.includes(productId);

  const handleClick = async () => {
    if (!session?.user) {
      toast.error("Please log in to use the wishlist", {
        action: {
          label: "Login",
          onClick: () => (window.location.href = "/login"),
        },
      });
      return;
    }

    try {
      await toggleWishlist(productId, session.user);
    } catch (error) {
      console.error("Wishlist action failed:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant={isWishlisted ? "destructive" : "outline"}
      className="flex items-center gap-2 rounded-full w-full transition-all"
      aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
    >
      <Heart
        className={`w-5 h-5 transition-all ${
          isWishlisted ? "fill-red-500 text-red-500" : "text-gray-500"
        }`}
      />
      {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
    </Button>
  );
}
