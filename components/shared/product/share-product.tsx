"use client";

import { useEffect, useState } from "react";
import { Clipboard, ClipboardCheck, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function ShareProduct({ slug, name }: { slug: string; name: string }) {
  const [copied, setCopied] = useState(false);
  const [productUrl, setProductUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setProductUrl(`${window.location.origin}/product/${slug}`);
    }
  }, [slug]);

  const handleCopy = () => {
    navigator.clipboard.writeText(productUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const shareOnMobile = () => {
    if (navigator.share) {
      navigator.share({
        title: name,
        text: `Check out this product: ${name}`,
        url: productUrl,
      });
    } else {
      handleCopy();
    }
  };

  return (
    <div className="flex gap-3 mt-4">
      {/* Copy Link Button */}
      <div>
        <Button
          onClick={handleCopy}
          className="flex gap-2 items-center bg-slate-600 hover:bg-slate-800 text-white"
        >
          {copied ? <ClipboardCheck size={18} /> : <Clipboard size={18} />}
          {copied ? "Copied!" : "Copy Link"}
        </Button>
      </div>

      {/* Mobile Share Button */}
      <div>
        <Button
          onClick={shareOnMobile}
          className="flex gap-2 items-center bg-gray-700 hover:bg-gray-800 text-white"
        >
          <Share2 size={18} />
          Share
        </Button>
      </div>

      {/* Social Media Share Buttons */}
      {/* <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-700 hover:bg-blue-800 text-white p-2 rounded-md flex items-center"
      >
        <Facebook size={20} />
      </a>

      <a
        href={`https://twitter.com/intent/tweet?text=Check out this product: ${encodeURIComponent(name)}&url=${encodeURIComponent(productUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md flex items-center"
      >
        <Twitter size={20} />
      </a> */}

      <a
        href={`https://api.whatsapp.com/send?text=Check out this product: ${encodeURIComponent(name)} ${encodeURIComponent(productUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-md flex items-center"
      >
        <MessageCircle size={20} />
      </a>
    </div>
  );
}

export default ShareProduct;
