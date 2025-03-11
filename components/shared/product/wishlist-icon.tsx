"use client";

import { useWishlistStore } from "@/hooks/use-wishlist-store";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import { toast } from "sonner";

export const WishlistIcon = ({
  productId,
  className = "",
}: {
  productId: string;
  className?: string;
}) => {
  const { data: session } = useSession();
  const { wishlist, toggleWishlist } = useWishlistStore();
  const isWished = wishlist.includes(productId);

  const handleClick = (e: React.MouseEvent) => {
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

    toggleWishlist(productId, session.user);
  };

  return (
    <button
      onClick={handleClick}
      className={`text-red-500 ${className}`}
      aria-label="Toggle Wishlist"
    >
      <Heart className={isWished ? "w-5 h-5 fill-red-500" : "w-5 h-5"} />
    </button>
  );
};
