"use client";

import { useWishlistStore } from "@/hooks/use-wishlist-store";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import { toast } from "sonner";

interface WishlistIconProps {
  productId: string;
  className?: string;
}

export const WishlistIcon: React.FC<WishlistIconProps> = ({
  productId,
  className = "",
}) => {
  const { data: session } = useSession();
  const { wishlist, toggleWishlist } = useWishlistStore();
  const isWishlisted = wishlist.includes(productId);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

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
      console.error("Wishlist toggle failed:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full hover:bg-gray-100 transition-all ${className}`}
      aria-label="Toggle Wishlist"
    >
      <Heart
        className={`w-6 h-6 transition-all ${
          isWishlisted ? "fill-red-500 text-red-500" : "text-gray-500"
        }`}
      />
    </button>
  );
};
