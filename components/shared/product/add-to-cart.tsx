/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useCartStore from "@/hooks/use-cart-store";
import { useToast } from "@/hooks/use-toast";
import { OrderItem } from "@/types";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddToCart({
  item,
  minimal = false,
}: {
  item: OrderItem;
  minimal?: boolean;
}) {
  const router = useRouter();
  const { toast } = useToast();

  const { addItem } = useCartStore();

  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [isBuyNowLoading, setIsBuyNowLoading] = useState(false); // Loading for "Buy Now"

  const t = useTranslations();

  const handleAddToCart = async () => {
    setIsLoading(true); // Start loading
    try {
      const itemId = await addItem(item, quantity);
      router.push(`/cart/${itemId}`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.message,
      });
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const handleBuyNow = async () => {
    setIsBuyNowLoading(true); // Start loading for "Buy Now"
    try {
      addItem(item, quantity);
      router.push(`/checkout`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.message,
      });
    } finally {
      setIsBuyNowLoading(false); // End loading for "Buy Now"
    }
  };

  return minimal ? (
    <Button
      className="rounded-full w-auto"
      onClick={async () => {
        setIsLoading(true); // Start loading
        try {
          addItem(item, 1);
          toast({
            description: t("Product.Added to Cart"),
            action: (
              <Button
                onClick={() => {
                  router.push("/cart");
                }}
              >
                {t("Product.Go to Cart")}
              </Button>
            ),
          });
        } catch (error: any) {
          toast({
            variant: "destructive",
            description: error.message,
          });
        } finally {
          setIsLoading(false); // End loading
        }
      }}
      disabled={isLoading} // Disable the button while loading
    >
      {isLoading ? t("Product.Loading...") : t("Product.Add to Cart")}
    </Button>
  ) : (
    <div className="w-full space-y-2">
      <Select
        value={quantity.toString()}
        onValueChange={(i) => setQuantity(Number(i))}
      >
        <SelectTrigger>
          <SelectValue>
            {t("Product.Quantity")}: {quantity}
          </SelectValue>
        </SelectTrigger>
        <SelectContent position="popper">
          {Array.from({ length: item.countInStock }).map((_, i) => (
            <SelectItem key={i + 1} value={`${i + 1}`}>
              {i + 1}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        className="rounded-full w-full"
        type="button"
        onClick={handleAddToCart}
        disabled={isLoading} // Disable the button while loading
      >
        {isLoading ? t("Product.Loading...") : t("Product.Add to Cart")}
      </Button>
      <Button
        variant="secondary"
        onClick={handleBuyNow}
        disabled={isBuyNowLoading} // Disable the button while loading
        className="w-full rounded-full"
      >
        {isBuyNowLoading ? t("Product.Loading...") : t("Product.Buy Now")}
      </Button>
    </div>
  );
}
