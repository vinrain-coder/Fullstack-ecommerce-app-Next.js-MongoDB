"use server";

import { request } from "@arcjet/next";
import { arcjetInstance } from "@/lib/arcjetInstance"; // Import from separate file

export async function handleArcjetDecision(decision: any) {
  const errorResponse = (message: string) => ({
    error: message,
    success: false,
    status: 403,
  });

  if (decision.isDenied()) {
    if (decision.reason.isEmail()) {
      const emailTypes = decision.reason.emailTypes;
      if (emailTypes.includes("DISPOSABLE"))
        return errorResponse("Disposable email addresses are not allowed.");
      if (emailTypes.includes("INVALID")) return errorResponse("Invalid email.");
      if (emailTypes.includes("NO_MX_RECORDS"))
        return errorResponse("Email domain has no valid MX records.");
    }
    if (decision.reason.isBot()) return errorResponse("Bot activity detected.");
    if (decision.reason.isRateLimit())
      return errorResponse("Too many requests! Try again later.");
    return errorResponse("Unauthorized request detected.");
  }
  return { success: true };
}

export async function validateRequest(email: string) {
  const req = await request();
  const decision = await arcjetInstance.protect(req, { email });
  return handleArcjetDecision(decision);
}
