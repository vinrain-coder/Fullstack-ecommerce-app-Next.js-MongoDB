"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { verifyEmail } from "@/lib/actions/user.actions";
import { signIn } from "next-auth/react";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [status, setStatus] = useState({
    message: "Verifying...",
    success: false,
  });

  const router = useRouter();

  useEffect(() => {
    if (!token) {
      setStatus({ message: "Invalid verification link.", success: false });
      return;
    }

    async function verify() {
      const result = await verifyEmail(token);
      setStatus(result);

      if (result.success) {
        const email = searchParams.get("email");

        if (email) {
          await signIn("credentials", { email, redirect: false });
        }

        setTimeout(() => {
          const callbackUrl = searchParams.get("callbackUrl") || "/";
          router.replace(callbackUrl);
        }, 2000);
      }
    }

    verify();
  }, [token, router, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md bg-white p-6 rounded-lg shadow-lg text-center">
        <h1
          className={`text-xl font-bold ${status.success ? "text-green-600" : "text-red-600"}`}
        >
          {status.success ? "Success!" : "Error"}
        </h1>
        <p className="mt-2 text-gray-700">{status.message}</p>
        {status.success && (
          <Link href="/" className="mt-4 block text-blue-600 hover:underline">
            Go to Homepage
          </Link>
        )}
      </div>
    </div>
  );
}
