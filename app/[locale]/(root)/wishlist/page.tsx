"use client";

import ProductCard from "@/components/shared/product/product-card";
import { useWishlist } from "@/hooks/use-wishlist-store";
import { getProductsByIds } from "@/lib/actions/product.actions";
import { IProduct } from "@/lib/db/models/product.model";
import { useEffect, useState } from "react";

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    if (wishlist.length > 0) {
      getProductsByIds(wishlist).then(setProducts);
    }
  }, [wishlist]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Wishlist</h2>
      {products.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product._id.toString()}
              product={product}
              hideAddToCart
            />
          ))}
        </div>
      )}
    </div>
  );
}
