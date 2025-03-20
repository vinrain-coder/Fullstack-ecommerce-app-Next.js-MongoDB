"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface OrderViaWhatsAppProps {
  productName: string;
  variant: string;
  size: string;
  quantity?: number;
}

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

export default function OrderViaWhatsApp({
  productName,
  variant,
  size,
  quantity = 1,
}: OrderViaWhatsAppProps) {
  if (!whatsappNumber) {
    console.error("WhatsApp number is missing in the environment variables.");
    return null; // Don't render the button if number is missing
  }

  const message = encodeURIComponent(
    `Hello, I'm interested in ordering:
  - Product: ${productName}
  - Variant: ${variant} / Size: ${size}
  - Quantity: ${quantity}
  
  Can you provide more details?`
  );

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <Button
      asChild
      className="bg-green-500 hover:bg-green-600 text-white w-full rounded-full"
    >
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        <MessageCircle className="w-6 h-6" />
        Order via WhatsApp
      </a>
    </Button>
  );
}
