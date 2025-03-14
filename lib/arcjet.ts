"use server";

import { request } from "@arcjet/next";
import { arcjetInstance } from "@/lib/arcjetInstance";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function handleArcjetDecision(decision: any) {
  if (decision.isDenied()) {
    let errorMessage = "Unauthorized request detected.";

    if (decision.reason.isEmail()) {
      const emailTypes = decision.reason.emailTypes;
      if (emailTypes.includes("DISPOSABLE"))
        errorMessage = "Disposable emails are not allowed.";
      if (emailTypes.includes("INVALID"))
        errorMessage = "Invalid email address.";
      if (emailTypes.includes("NO_MX_RECORDS"))
        errorMessage = "Email domain is not valid.";
    }
    if (decision.reason.isBot()) errorMessage = "Bot activity detected.";
    if (decision.reason.isRateLimit())
      errorMessage = "Too many requests! Try again later.";

    return { error: errorMessage, success: false, status: 403 };
  }

  return { success: true };
}

export async function validateRequest(email: string) {
  const req = await request();
  const decision = await arcjetInstance.protect(req, { email });
  return handleArcjetDecision(decision);
}
