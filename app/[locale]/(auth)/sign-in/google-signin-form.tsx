"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Google from "@/public/icons/google.png";

export function GoogleSignInForm() {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signIn("google");
    setLoading(false);
  };

  return (
    <Button
      onClick={handleGoogleSignIn}
      disabled={loading}
      className="w-full flex items-center gap-2"
      variant="outline"
    >
      {loading ? (
        <Loader2 className="animate-spin w-5 h-5" />
      ) : (
        <Image
          src={Google}
          alt="Google Logo"
          width={24}
          height={24}
          unoptimized
        />
      )}
      {loading ? "Redirecting to Google..." : "Sign in with Google"}
    </Button>
  );
}
