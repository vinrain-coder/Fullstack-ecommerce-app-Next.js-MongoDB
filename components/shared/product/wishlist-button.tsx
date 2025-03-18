"use client";

import { useState, useTransition, useEffect } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "@/lib/actions/wishlist.actions";

interface WishlistButtonProps {
  productId: string;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ productId }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    async function checkWishlist() {
      const wishlist = await getWishlist(); // ✅ Fetch initial wishlist status
      setIsInWishlist(wishlist.includes(productId));
    }
    checkWishlist();
  }, [productId]);

  const toggleWishlist = () => {
    if (!session) {
      const loginUrl = `/login?callbackUrl=${encodeURIComponent(pathname)}`;
      toast.error("You need to log in to use the wishlist", {
        action: {
          label: "Login",
          onClick: () => router.push(loginUrl),
        },
      });
      return;
    }

    startTransition(async () => {
      if (isInWishlist) {
        await removeFromWishlist(productId);
        toast.success("Removed from wishlist");
        setIsInWishlist(false);
      } else {
        await addToWishlist(productId);
        toast.success("Added to wishlist");
        setIsInWishlist(true);
      }
    });
  };

  return (
    <Button
      onClick={toggleWishlist}
      variant="outline"
      className="flex items-center rounded-full w-full gap-1"
      disabled={pending}
    >
      <Heart
        className={`w-6 h-6 text-red-500 ${isInWishlist ? "fill-red-500" : ""}`}
      />
      {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
    </Button>
  );
};

export default WishlistButton;
