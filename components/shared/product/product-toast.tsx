"use client";

import { useEffect, useState, useRef } from "react";
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
  avgRating?: number;
  tags?: string[];
};

export default function ProductToast() {
  const [products, setProducts] = useState<Product[]>([]);
  const notificationSound = useRef(
    typeof Audio !== "undefined" ? new Audio("/sounds/notification.wav") : null
  );
  const toastInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const { products } = await getAllProducts({
        query: "all",
        category: "all",
        tag: "all",
        limit: 20,
        page: 1,
        price: "all",
        rating: "all",
        sort: "best-selling",
      });

      setProducts(
        products.map((p) => ({
          ...p,
          _id: p._id.toString(),
        }))
      );
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (!products.length) return;

    const messages = [
      "Just viewed in",
      "Trending now in",
      "Just ordered in",
      "Just enquired in",
    ];
    const locations = [
      "Nairobi",
      "Mombasa",
      "Kisumu",
      "Nakuru",
      "Eldoret",
      "Thika",
      "Malindi",
      "Garissa",
      "Kitale",
      "Nyeri",
      "Machakos",
      "Kericho",
      "Embu",
      "Kakamega",
      "Kisii",
      "Migori",
    ];

    const showRandomToast = () => {
      const product = products[Math.floor(Math.random() * products.length)];
      const message = messages[Math.floor(Math.random() * messages.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];

      // Play notification sound
      if (notificationSound.current) {
        notificationSound.current.currentTime = 0;
        notificationSound.current
          .play()
          .catch((err) => console.warn("Sound play error:", err));
      }

      toast.custom(
        () => (
          <motion.div
            initial={{ x: "-120%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-120%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
            className="w-[200px] bg-white shadow-md p-1 rounded-md border border-gray-200 cursor-pointer hover:shadow-lg transition-all"
          >
            <Link
              href={`/product/${product.slug}`}
              className="flex items-center gap-1"
            >
              <Image
                src={product.images[0]}
                alt={product.name}
                width={40}
                height={40}
                className="rounded-md"
              />
              <div className="flex flex-col w-full">
                <p className="text-[10px] text-gray-500 font-medium">
                  {message} {location}
                </p>
                <p className="text-[12px] font-semibold text-gray-800 w-full line-clamp-1">
                  {product.name}
                </p>

                {/* Star Rating */}
                {product.avgRating !== undefined && (
                  <div className="flex gap-[2px] text-primary text-[10px]">
                    {"★".repeat(Math.round(product.avgRating))}
                    {"☆".repeat(5 - Math.round(product.avgRating))}
                  </div>
                )}

                <p className="text-[12px] font-bold text-gray-900">
                  KES {product.price}
                </p>

                {/* Product Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div className="flex gap-1 mt-[2px]">
                    {product.tags.slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-700 text-[10px] px-1 py-[1px] rounded"
                      >
                        {tag
                          .replace(/-/g, " ")
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          </motion.div>
        ),
        {
          position: "bottom-left",
          duration: 6000,
        }
      );
    };

    const startToastInterval = () => {
      if (!toastInterval.current) {
        toastInterval.current = setInterval(showRandomToast, 120000);
      }
    };

    const stopToastInterval = () => {
      if (toastInterval.current) {
        clearInterval(toastInterval.current);
        toastInterval.current = null;
      }
    };

    // Handle visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopToastInterval();
      } else {
        startToastInterval();
      }
    };

    // Start interval when component mounts
    startToastInterval();

    // Listen for page visibility changes
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopToastInterval();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [products]);

  return <Toaster richColors closeButton visibleToasts={1} />;
}
