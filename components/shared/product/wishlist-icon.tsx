"use client";

import { useWishlist } from "@/hooks/use-wishlist-store";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const WishlistIcon = ({ productId }: { productId: string }) => {
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const isInWishlist = wishlist.includes(productId);
  const router = useRouter();
  const { data: session } = useSession(); // Get session data

  const toggleWishlist = () => {
    if (!session) {
      // Show login toast if user is not logged in
      toast.error("You need to log in to use the wishlist", {
        action: {
          label: "Login",
          onClick: () => router.push("/login"),
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
    <button onClick={toggleWishlist} className="text-red-500">
      <Heart className={`w-5 h-5 ${isInWishlist ? "fill-red-500" : ""}`} />
    </button>
  );
};

export default WishlistIcon;
