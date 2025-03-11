import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useWishlistStore } from "@/hooks/use-wishlist-store";
import { Heart, HeartOff } from "lucide-react";

export default function WishlistButton({ productId }: { productId: string }) {
  const { wishlist, toggleWishlist } = useWishlistStore();
  const { data: session } = useSession();
  const isWishlisted = wishlist.includes(productId);

  const handleClick = () => {
    if (!session?.user) {
      return toast.error("Please log in", {
        action: {
          label: "Login",
          onClick: () => (window.location.href = "/login"),
        },
      });
    }
    toggleWishlist(productId);
  };

  return (
    <Button
      onClick={handleClick}
      variant={isWishlisted ? "destructive" : "outline"}
      className="flex items-center gap-2 rounded-full w-full"
    >
      {isWishlisted ? (
        <>
          <HeartOff className="w-5 h-5" /> Remove from Wishlist
        </>
      ) : (
        <>
          <Heart className="w-5 h-5" /> Add to Wishlist
        </>
      )}
    </Button>
  );
}
