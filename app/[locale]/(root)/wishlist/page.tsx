"use client";

import ProductCard from "@/components/shared/product/product-card";
import { useWishlistStore } from "@/hooks/use-wishlist-store";
import { useEffect, useState } from "react";

export default function WishlistPage() {
  const { wishlist } = useWishlistStore();
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    if (wishlist.length > 0) {
      fetch(`/api/products?ids=${wishlist.join(",")}`)
        .then((res) => res.json())
        .then((data) => setProducts(data))
        .catch(() => setProducts([]));
    } else {
      setProducts([]);
    }
  }, [wishlist]);

  return (
    <div className="container">
      <h1 className="text-2xl font-bold my-5">My Wishlist</h1>
      {products.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} hideBorder />
          ))}
        </div>
      )}
    </div>
  );
}
