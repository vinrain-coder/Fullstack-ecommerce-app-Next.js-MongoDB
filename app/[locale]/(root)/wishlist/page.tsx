"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import ProductPrice from "@/components/shared/product/product-price";
import { handleWishlist } from "@/lib/actions/wishlist.actions";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const router = useRouter();
  const t = useTranslations();

  useEffect(() => {
    async function fetchWishlist() {
      const res = await fetch("/api/wishlist");
      const data = await res.json();
      setWishlist(data);
    }
    fetchWishlist();
  }, []);

  const removeFromWishlist = async (productId: string) => {
    await handleWishlist(productId, "remove");
    setWishlist((prev) => prev.filter((item) => item._id !== productId));
  };

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
            {wishlist.map((item) => (
              <Card key={item._id} className="rounded-md">
                <Link
                  href={`/product/${item.slug}`}
                  className="relative w-full h-48"
                >
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </Link>
                <CardContent className="p-4">
                  <Link
                    href={`/product/${item.slug}`}
                    className="text-lg font-semibold hover:no-underline"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm">
                    {t("Wishlist.Category")}: {item.category}
                  </p>
                  <p className="text-sm">
                    {t("Wishlist.Brand")}: {item.brand}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <ProductPrice price={item.price} />
                    <Button
                      variant="outline"
                      onClick={() => removeFromWishlist(item._id)}
                    >
                      {t("Wishlist.Remove")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
