"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "@/lib/actions/wishlist.actions";
import { motion, AnimatePresence } from "framer-motion";

const WishlistIcon = ({ productId }: { productId: string }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [pending, startTransition] = useTransition();
  const [showSparkle, setShowSparkle] = useState(false);

  // Fetch wishlist status on mount
  useState(() => {
    async function checkWishlist() {
      const wishlist = await getWishlist();
      setIsInWishlist(wishlist.includes(productId));
    }
    checkWishlist();
  });

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
        setShowSparkle(true); // Trigger sparkle effect

        // Hide sparkle after animation ends
        setTimeout(() => {
          setShowSparkle(false);
        }, 500);
      }
    });
  };

  return (
    <button onClick={toggleWishlist} className="relative" disabled={pending}>
      {/* Sparkle Effect */}
      <AnimatePresence>
        {showSparkle && (
          <motion.div
            className="absolute -top-2 -right-2 text-yellow-400"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1.5 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            ✨
          </motion.div>
        )}
      </AnimatePresence>

      {/* Heart Icon with Animation */}
      <motion.div
        animate={isInWishlist ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Heart
          className={`w-6 h-6 text-red-500 ${isInWishlist ? "fill-red-500" : ""}`}
        />
      </motion.div>
    </button>
  );
};

export default WishlistIcon;
