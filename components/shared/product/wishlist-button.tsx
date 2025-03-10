"use client";

import { useState, useTransition, useEffect } from "react";
import { handleWishlist } from "@/lib/actions/wishlist.actions";
import { Button } from "@/components/ui/button";
import { Heart, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const WishlistButton = ({
  productId,
  isWishlisted,
}: {
  productId: string;
  isWishlisted: boolean;
}) => {
  const { data: session, status } = useSession();
  const [isPending, startTransition] = useTransition();
  const [inWishlist, setInWishlist] = useState(isWishlisted);

  const router = useRouter();

  if (status === "loading") return null;

  if (!session) {
    return (
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={() =>
          toast.error("Please log in to use the wishlist", {
            action: {
              label: "Login",
              onClick: () => router.push("/login"), 
            },
          })
        }
      >
        <Heart size={18} /> Add to Wishlist
      </Button>
    );
  }

  const handleClick = () => {
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
    <Button
      variant="outline"
      className="flex items-center gap-2"
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="animate-spin" size={18} />
      ) : inWishlist ? (
        <Heart className="text-red-500" size={18} />
      ) : (
        <Heart size={18} />
      )}
      {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
    </Button>
  );
};

export default WishlistButton;
