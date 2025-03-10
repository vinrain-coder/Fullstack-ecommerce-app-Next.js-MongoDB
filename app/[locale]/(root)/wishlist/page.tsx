// "use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ProductPrice from "@/components/shared/product/product-price";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { auth } from "@/auth";
import { handleWishlist } from "@/lib/actions/wishlist.actions";

export default async function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const session = await auth();
  const router = useRouter();
  const t = useTranslations();

  useEffect(() => {
    if (session) {
      fetch("/api/wishlist")
        .then((res) => res.json())
        .then((data) => setWishlistItems(data.wishlist))
        .catch((err) => console.error(err));
    }
  }, [session]);

  async function removeFromWishlist(productId: string) {
    try {
      await handleWishlist(productId, "remove");
      setWishlistItems((prev) => prev.filter((item) => item._id !== productId));
      toast.success(t("Wishlist.Removed from Wishlist"));
    } catch (error) {
      toast.error(t("Wishlist.Failed to remove item"));
    }
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
        {wishlistItems.length === 0 ? (
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
          <div className="col-span-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {wishlistItems.map((item) => (
              <Card key={item._id} className="rounded-md overflow-hidden">
                <Link href={`/product/${item.slug}`}>
                  <div className="relative w-full h-56">
                    <Image
                      src={item.images?.[0] || "/placeholder.png"}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 20vw"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </Link>
                <CardContent className="p-4 space-y-2">
                  <Link
                    href={`/product/${item.slug}`}
                    className="hover:no-underline"
                  >
                    <h3 className="text-lg font-medium">{item.name}</h3>
                  </Link>
                  <p className="text-sm">
                    {t("Wishlist.Brand")}: {item.brand}
                  </p>
                  <p className="text-sm">
                    {t("Wishlist.Category")}: {item.category}
                  </p>
                  <div className="flex items-center justify-between">
                    <ProductPrice price={item.price} />
                    <Button
                      variant="outline"
                      size="sm"
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
