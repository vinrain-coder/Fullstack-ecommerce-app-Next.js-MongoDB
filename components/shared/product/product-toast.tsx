"use client";

import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import Image from "next/image";
import { getAllProducts } from "@/lib/actions/product.actions";
import { motion } from "framer-motion";
import Link from "next/link";

type Product = {
  _id: string;
  name: string;
  slug: string;
  category: string;
  images: string[];
  price: number;
  listPrice?: number;
  avgRating?: number;
};

export default function ProductToast() {
  const [shuffledProducts, setShuffledProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      const { products } = await getAllProducts({
        query: "all",
        category: "all",
        tag: "all",
        limit: 50, // Increase limit to fetch more products
        page: 1,
        price: "all",
        rating: "all",
        sort: "best-selling",
      });

      if (products.length) {
        setShuffledProducts(
          products
            .map((p) => ({
              ...p,
              _id: p._id.toString(), // Ensure _id is a string
            }))
            .sort(() => Math.random() - 0.5)
        );
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (!shuffledProducts.length) return;

    const messages = [
      "Someone just viewed",
      "Trending now:",
      "Limited stock!",
      "Hot deal:",
      "Popular pick:",
    ];
    const locations = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"];

    const showToast = () => {
      const product = shuffledProducts[currentIndex];
      const message = messages[Math.floor(Math.random() * messages.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const discount = product.listPrice
        ? Math.round(
            ((product.listPrice - product.price) / product.listPrice) * 100
          )
        : 0;

      toast.custom(
        () => (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 100 }}
            className="w-[250px] opacity-0 animate-fadeIn"
          >
            <Link href={`/product/${product.slug}`} className="block">
              <div className="flex items-center gap-3 bg-white shadow-lg p-3 rounded-lg border border-gray-200 cursor-pointer hover:shadow-xl transition-all">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={50}
                  height={50}
                  className="rounded-md"
                />
                <div className="gap-3">
                  <p className="text-xs text-gray-500">
                    {message} ({location})
                  </p>
                  <p className="text-sm font-bold line-clamp-2 text-gray-700">
                    {product.name}
                  </p>

                  {/* Star Rating */}
                  {product.avgRating !== undefined && (
                    <div className="flex gap-1 text-primary text-sm">
                      {"★".repeat(Math.round(product.avgRating))}
                      {"☆".repeat(5 - Math.round(product.avgRating))}
                    </div>
                  )}

                  <p className="text-xs font-semibold text-gray-600">
                    KES {product.price}
                  </p>

                  {/* Discount Badge */}
                  {discount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-md">
                      {discount}% OFF
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        ),
        {
          position: "bottom-left",
          duration: 5000,
        }
      );

      // Move to the next product or restart cycle
      setCurrentIndex((prevIndex) =>
        prevIndex + 1 < shuffledProducts.length ? prevIndex + 1 : 0
      );
    };

    const interval = setInterval(
      showToast,
      Math.random() * (25000 - 10000) + 10000
    );

    return () => clearInterval(interval);
  }, [shuffledProducts, currentIndex]);

  return <Toaster richColors closeButton />;
}
