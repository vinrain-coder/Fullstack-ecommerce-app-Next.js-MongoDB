"use client";

import ProductCard from "@/components/shared/product/product-card";
import { useWishlistStore } from "@/hooks/use-wishlist-store";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function WishlistPage() {
  const { wishlist } = useWishlistStore();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (wishlist.length === 0) {
      setProducts([]);
      return;
    }

    setLoading(true);
    fetch(`/api/products/wishlist?ids=${wishlist.join(",")}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setLoading(false);
      });
  }, [wishlist]);

  return (
    <div className="container">
      <h1 className="text-2xl font-bold my-5">My Wishlist</h1>

      {loading ? (
        <p>
          <Loader2 className="size-5 animate-spin text-primary" />
          Loading...
        </p>
      ) : products.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} hideAddToCart/>
          ))}
        </div>
      )}
    </div>
  );
}
