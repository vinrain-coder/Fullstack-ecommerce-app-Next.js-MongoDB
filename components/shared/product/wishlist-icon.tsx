"use client";

import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { handleWishlist } from "@/lib/actions/wishlist.actions";

const WishlistIcon = ({
  productId,
  isWishlisted,
}: {
  productId: string;
  isWishlisted: boolean;
}) => {
  const { data: session } = useSession();
  const [inWishlist, setInWishlist] = useState(isWishlisted);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleClick = () => {
    if (!session) {
      toast.error("You must log in to use the wishlist.", {
        action: {
          label: "Login",
          onClick: () => router.push("/login"),
        },
      });
      return;
    }

    startTransition(async () => {
      try {
        const action = inWishlist ? "remove" : "add";
        const res = await handleWishlist(productId, action);
        if (res.success) {
          setInWishlist(!inWishlist);
          toast.success(res.message);
        }
      } catch (error) {
        toast.error("Something went wrong. Try again.");
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="p-1 rounded-full bg-white shadow-md hover:bg-gray-100 transition"
    >
      {isPending ? (
        <Loader2 className="animate-spin text-gray-500" size={20} />
      ) : inWishlist ? (
        <Heart className="text-red-500" size={20} />
      ) : (
        <Heart className="text-gray-400" size={20} />
      )}
    </button>
  );
};

export default WishlistIcon;
