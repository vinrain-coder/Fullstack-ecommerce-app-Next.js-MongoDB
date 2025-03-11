"use client";

import { useWishlist } from "@/hooks/use-wishlist-store";
import { Heart } from "lucide-react";

interface WishlistButtonProps {
  productId: string;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ productId }) => {
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const isInWishlist = wishlist.includes(productId);

  const toggleWishlist = () => {
    isInWishlist ? removeFromWishlist(productId) : addToWishlist(productId);
  };

  return (
    <button
      onClick={toggleWishlist}
      className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition"
    >
      <Heart
        className={`w-5 h-5 ${isInWishlist ? "fill-red-500 text-white" : ""}`}
      />
      {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
    </button>
  );
};

export default WishlistButton;
