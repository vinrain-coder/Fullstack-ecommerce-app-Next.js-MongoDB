"use client";

import { useState, useCallback } from "react";
import { handleWishlist } from "@/lib/actions/wishlist.actions";
import { Button } from "@/components/ui/button";
import { Heart, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/hooks/use-wishlist";

interface WishlistButtonProps {
  productId: string;
}

const WishlistButton = ({ productId }: WishlistButtonProps) => {
  const { data: session, status } = useSession();
  const { wishlist, toggleWishlist } = useWishlist();
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const isWishlisted = wishlist.includes(productId);

  if (status === "loading") return null;

  const handleClick = useCallback(async () => {
    if (!session) {
      return toast.error("Please log in to use the wishlist", {
        action: {
          label: "Login",
          onClick: () => router.push("/login"),
        },
      });
    }

    // Optimistically update UI
    toggleWishlist(productId);
    setIsPending(true);

    try {
      const action = isWishlisted ? "remove" : "add";
      const res = await handleWishlist(productId, action);
      if (!res.success) throw new Error(res.message);

      toast.success(res.message);
    } catch {
      // Revert UI update if action fails
      toggleWishlist(productId);
      toast.error("Something went wrong. Try again.");
    } finally {
      setIsPending(false);
    }
  }, [session, isWishlisted, productId, toggleWishlist, router]);

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2 rounded-full w-full"
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="animate-spin" size={18} />
      ) : (
        <Heart
          className={`transition-all ${isWishlisted ? "text-red-500 fill-red-500" : ""}`}
          size={18}
        />
      )}
      {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
    </Button>
  );
};

export default WishlistButton;
