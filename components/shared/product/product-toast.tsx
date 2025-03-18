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
  avgRating?: number;
  tags?: string[];
};

export default function ProductToast() {
  const [products, setProducts] = useState<Product[]>([]);

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

    // const sound = new Audio("/notification.mp3");

    const showRandomToast = () => {
      const product = products[Math.floor(Math.random() * products.length)];
      const message = messages[Math.floor(Math.random() * messages.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];

      // sound.play().catch((err) => console.warn("Sound play error:", err));

      toast.custom(
        () => (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 100 }}
            className="w-[240px] bg-white shadow-md p-2 rounded-lg border border-gray-200 cursor-pointer hover:shadow-lg transition-all"
          >
            <Link
              href={`/product/${product.slug}`}
              className="flex items-center gap-2"
            >
              <Image
                src={product.images[0]}
                alt={product.name}
                width={50}
                height={50}
                className="rounded-md"
              />
              <div className="flex flex-col w-full">
                <p className="text-xs text-gray-500 font-medium">
                  {message} {location}
                </p>
                <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                  {product.name}
                </p>

                {/* Star Rating */}
                {product.avgRating !== undefined && (
                  <div className="flex gap-[2px] text-primary text-sm">
                    {"★".repeat(Math.round(product.avgRating))}
                    {"☆".repeat(5 - Math.round(product.avgRating))}{" "}
                    <span className="text-gray-700 ml-4">Avg. ratings</span>
                  </div>
                )}

                <p className="text-sm font-bold text-gray-900">
                  KES {product.price}
                </p>

                {/* Product Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div className="flex gap-1 mt-[4px]">
                    {product.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-700 text-[12px] px-2 py-[2px] rounded"
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
          duration: 5000,
        }
      );
    };

    const interval = setInterval(showRandomToast, 15000);
    return () => clearInterval(interval);
  }, [products]);

  return <Toaster richColors closeButton />;
}
