"use client";

import ResetPasswordForm from "@/components/shared/reset-password-form";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (!token) {
    return <p className="text-red-500 text-center mt-10">Invalid reset link</p>;
  }

  return <ResetPasswordForm token={token} />;
}
