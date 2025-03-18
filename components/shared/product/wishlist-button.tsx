"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/lib/actions/wishlist.actions";
import { Button } from "@/components/ui/button";

interface WishlistButtonProps {
  productId: string;
  initialWishlist: string[]; // Pass from parent to avoid extra fetch
}

const WishlistButton: React.FC<WishlistButtonProps> = ({
  productId,
  initialWishlist,
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isInWishlist, setIsInWishlist] = useState(
    initialWishlist?.includes(productId) || false
  );

  const [pending, startTransition] = useTransition();

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

    // Optimistic UI update
    setIsInWishlist(!isInWishlist);

    startTransition(async () => {
      try {
        if (isInWishlist) {
          await removeFromWishlist(productId);
          toast.success("Removed from wishlist");
        } else {
          await addToWishlist(productId);
          toast.success("Added to wishlist");
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setIsInWishlist(isInWishlist); // Revert if error
        toast.error("Something went wrong!");
      }
    });
  };

  return (
    <Button
      onClick={toggleWishlist}
      className="flex items-center gap-1 w-full rounded-full"
      variant="outline"
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
