"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import ProductCard from "@/components/shared/product/product-card";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const t = useTranslations();

  useEffect(() => {
    async function fetchWishlist() {
      const res = await fetch("/api/wishlist");
      const data = await res.json();
      setWishlist(data);
    }
    fetchWishlist();
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
        {wishlist.length === 0 ? (
          <Card className="col-span-4 rounded-none">
            <CardHeader className="text-3xl">
              {t("Wishlist.Your Wishlist is Empty")}
            </CardHeader>
            <CardContent>
              {t.rich("Wishlist.Continue browsing", {
                home: (chunks) => <Link href="/">{chunks}</Link>,
              })}
            </CardContent>
          </Card>
        ) : (
          <div className="col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wishlist.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
