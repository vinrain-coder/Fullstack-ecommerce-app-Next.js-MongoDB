"use client";

import { useWishlist } from "@/hooks/use-wishlist-store";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface WishlistButtonProps {
  productId: string;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ productId }) => {
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const isInWishlist = wishlist.includes(productId);
  const router = useRouter();
  const pathname = usePathname(); // Get current path
  const { data: session } = useSession(); // Get user session

  const toggleWishlist = () => {
    if (!session) {
      // Redirect user to login with callbackUrl
      const loginUrl = `/login?callbackUrl=${encodeURIComponent(pathname)}`;

      toast.error("You need to log in to use the wishlist", {
        action: {
          label: "Login",
          onClick: () => router.push(loginUrl),
        },
      });
      return;
    }

    if (isInWishlist) {
      removeFromWishlist(productId);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(productId);
      toast.success("Added to wishlist");
    }
  };

  return (
    <Button
      onClick={toggleWishlist}
      variant="outline"
      className="flex items-center rounded-full w-full gap-1"
    >
      <Heart
        className={`w-6 h-6 text-red-500 ${isInWishlist ? "fill-red-500" : ""}`}
      />
      {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
    </Button>
  );
};

export default WishlistButton;
