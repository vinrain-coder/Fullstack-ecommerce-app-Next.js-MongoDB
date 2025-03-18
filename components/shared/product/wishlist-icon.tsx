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

interface WishlistIconProps {
  productId: string;
  initialInWishlist: boolean;
}

const WishlistIcon: React.FC<WishlistIconProps> = ({
  productId,
  initialInWishlist,
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isInWishlist, setIsInWishlist] = useState(initialInWishlist);
  const [pending, startTransition] = useTransition();

  const toggleWishlist = () => {
    if (!session) {
      toast.error("You need to log in to use the wishlist", {
        action: {
          label: "Login",
          onClick: () =>
            router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`),
        },
      });
      return;
    }

    setIsInWishlist(!isInWishlist); // Optimistic update

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
        setIsInWishlist(isInWishlist); // Revert UI if error occurs
        toast.error("Something went wrong!");
      }
    });
  };

  return (
    <button onClick={toggleWishlist} disabled={pending} className="p-2">
      <Heart
        className={`w-6 h-6 transition ${isInWishlist ? "fill-red-500 text-red-500" : "text-gray-500"}`}
      />
    </button>
  );
};

export default WishlistIcon;
