"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";

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
          src="/icons/google.png"
          alt="Google Logo"
          width={20}
          height={20}
        />
      )}
      {loading ? "Redirecting to Google..." : "Sign in with Google"}
    </Button>
  );
}
