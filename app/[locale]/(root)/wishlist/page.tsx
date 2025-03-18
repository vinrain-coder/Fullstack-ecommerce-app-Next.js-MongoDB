"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/shared/product/product-card";
import Link from "next/link";
import { getWishlistProducts } from "@/lib/actions/wishlist.actions";
import { IProduct } from "@/lib/db/models/product.model";

export default function WishlistPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWishlist() {
      setLoading(true);
      const data = await getWishlistProducts();
      setProducts(data);
      setLoading(false);
    }
    fetchWishlist();
  }, []);

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Wishlist</h2>
      {loading ? (
        <div className="text-center text-gray-500">Loading wishlist...</div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id.toString()} product={product} hideAddToCart />
          ))}
        </div>
      ) : (
        <div className="text-center mt-10">
          <p>Your wishlist is empty.</p>
          <Link href="/" className="inline-block px-6 py-2 text-blue-600">Go to Home</Link>
        </div>
      )}
    </div>
  );
}
