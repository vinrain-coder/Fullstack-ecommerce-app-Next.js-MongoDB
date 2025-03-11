"use client";

import { useWishlist } from "@/hooks/use-wishlist-store";
import { Heart, HeartOff } from "lucide-react";

const WishlistIcon = ({ productId }: { productId: string }) => {
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const isInWishlist = wishlist.includes(productId);

  const toggleWishlist = () => {
    isInWishlist ? removeFromWishlist(productId) : addToWishlist(productId);
  };

  return (
    <button onClick={toggleWishlist} className="text-red-500">
      {isInWishlist ? (
        <Heart className="w-6 h-6 fill-red-500" />
      ) : (
        <Heart className="w-6 h-6" />
      )}
    </button>
  );
};

export default WishlistIcon;
