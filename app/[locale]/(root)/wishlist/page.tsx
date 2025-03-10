"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import ProductCard from "@/components/shared/product/product-card";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations();

  useEffect(() => {
    async function fetchWishlist() {
      try {
        const res = await fetch("/api/wishlist", { credentials: "include" });
        const data = await res.json();
        if (data.success) {
          setWishlist(data.wishlist || []);
        } else {
          console.error("Failed to fetch wishlist:", data.message);
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchWishlist();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">{t("Wishlist.Your Wishlist")}</h1>

      {loading ? (
        <p className="text-lg">Loading...</p>
      ) : wishlist.length === 0 ? (
        <Card className="col-span-4 rounded-none">
          <CardHeader className="text-3xl">
            {t("Wishlist.Your Wishlist is empty")}
          </CardHeader>
          <CardContent>
            {t.rich("Wishlist.Continue browsing", {
              home: (chunks) => <Link href="/">{chunks}</Link>,
            })}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlist.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
