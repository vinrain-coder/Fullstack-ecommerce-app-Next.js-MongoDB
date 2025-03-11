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

  const handleClick = () => {
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
    <Button
      onClick={handleClick}
      variant={isWishlisted ? "destructive" : "outline"}
      className="flex items-center gap-2 rounded-full w-full"
    >
      <Heart
        className={isWishlisted ? "w-5 h-5 fill-red-500" : "w-5 h-5"}
      />
      {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
    </Button>
  );
}
