"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface OrderViaWhatsAppProps {
  productName: string;
  variant: string;
  size: string;
  quantity?: number;
  price: number; // Add price as a prop
}

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

export default function OrderViaWhatsApp({
  productName,
  variant,
  size,
  quantity = 1,
  price, // Use price in the message
}: OrderViaWhatsAppProps) {
  const [pageUrl, setPageUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPageUrl(window.location.href); // Get the current page URL
    }
  }, []);

  if (!whatsappNumber) {
    console.error("WhatsApp number is missing in the environment variables.");
    return null;
  }

  const totalPrice = price * quantity; // Calculate total price
  const formattedPrice = new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
  }).format(totalPrice);

  const message = encodeURIComponent(
    `Hello ShoePedi, I'm interested in ordering:
- Product: ${productName}
- Variant: ${variant} / Size: ${size}
- Quantity: ${quantity}
- Price: ${formattedPrice}

Link: ${pageUrl}`
  );

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <Button
      asChild
      className="bg-green-500 hover:bg-green-600 text-white rounded-full w-full"
    >
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        <MessageCircle className="w-6 h-6" />
        Order via WhatsApp
      </a>
    </Button>
  );
}
