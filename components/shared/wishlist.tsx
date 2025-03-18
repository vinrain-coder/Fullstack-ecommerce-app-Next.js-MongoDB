"use client";

import { useEffect, useState } from "react";
import { IProduct } from "@/lib/db/models/product.model";
import ProductCard from "@/components/shared/product/product-card";
import Link from "next/link";
import {
  getWishlistProducts,
  getWishlist,
} from "@/lib/actions/wishlist.actions";

export default function WishlistPage() {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]); // ✅ Add state for products

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const wishlistProducts = await getWishlistProducts();
        setProducts(wishlistProducts); // ✅ Update state properly

        const ids = await getWishlist();
        setWishlistIds(ids);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchWishlist();
  }, []);

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Wishlist</h2>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product._id.toString()}
              product={product}
              isInWishlist={wishlistIds.includes(product._id.toString())}
              hideAddToCart
            />
          ))}
        </div>
      ) : (
        <div className="text-center mt-10">
          <p>Your wishlist is empty.</p>
          <Link href="/" className="inline-block px-6 py-2 text-blue-600">
            Go to Home
          </Link>
        </div>
      )}
    </div>
  );
}
