"use client";

import { useState } from "react";
import { handleWishlist } from "@/lib/actions/wishlist.actions";
import { Button } from "@/components/ui/button";
import { Heart, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/hooks/use-wishlist";

const WishlistButton = ({ productId }: { productId: string }) => {
  const { data: session, status } = useSession();
  const { wishlist, toggleWishlist } = useWishlist();
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const isWishlisted = wishlist.includes(productId);

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

  const handleClick = async () => {
    setIsPending(true);
    try {
      const action = isWishlisted ? "remove" : "add";
      const res = await handleWishlist(productId, action);
      if (!res.success) throw new Error("Failed to update wishlist");

      toggleWishlist(productId);
      toast.success(res.message);
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setIsPending(false);
    }
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
