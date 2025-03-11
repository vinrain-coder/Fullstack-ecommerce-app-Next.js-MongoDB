"use client";

import ProductCard from "@/components/shared/product/product-card";
import { useWishlist } from "@/hooks/use-wishlist-store";
import { getProductsByIds } from "@/lib/actions/product.actions";
import { IProduct } from "@/lib/db/models/product.model";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true); // Start as true initially

  useEffect(() => {
    if (wishlist.length > 0) {
      setLoading(true);
      getProductsByIds(wishlist)
        .then(setProducts)
        .finally(() => setLoading(false));
    } else {
      setProducts([]);
      setLoading(false); // Ensure loading stops when wishlist is empty
    }
  }, [wishlist]);

  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-4">Your Wishlist</h2>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <p className="animate-pulse text-gray-500">
            Loading your wishlist...
          </p>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 transition-opacity duration-500">
          {products.map((product) => (
            <ProductCard
              key={product._id.toString()}
              product={product}
              hideAddToCart
            />
          ))}
        </div>
      ) : (
        <div className="text-center mt-10">
          <p className="text-lg">Your wishlist is empty.</p>
          <p className="mb-4">Browse and add products to your wishlist!</p>
          <Link href="/" className="inline-block px-6 py-2 text-undeline">
            Go to Home
          </Link>
        </div>
      )}
    </div>
  );
}
