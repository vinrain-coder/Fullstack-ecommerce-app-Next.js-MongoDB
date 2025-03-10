"use client";

import { useSession } from "next-auth/react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { handleWishlist } from "@/lib/actions/wishlist.actions";
import { useWishlist } from "@/hooks/use-wishlist";

const WishlistIcon = ({ productId }: { productId: string }) => {
  const { data: session } = useSession();
  const { wishlist, toggleWishlist } = useWishlist();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const isWishlisted = wishlist.includes(productId);

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
        const action = isWishlisted ? "remove" : "add";
        const res = await handleWishlist(productId, action);
        if (res.success) {
          toggleWishlist(productId);
          toast.success(res.message);
        } else {
          throw new Error(res.message);
        }
      } catch {
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
        <Loader2 className="animate-spin text-primary" size={16} />
      ) : (
        <Heart
          className={`transition-all ${isWishlisted ? "text-red-500 fill-red-500" : "text-gray-400"}`}
          size={16}
        />
      )}
    </button>
  );
};

export default WishlistIcon;
