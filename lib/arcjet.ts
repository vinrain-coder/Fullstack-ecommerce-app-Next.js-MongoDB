"use server";
import arcjet, {
  protectSignup,
  validateEmail,
  detectBot,
  shield,
  fixedWindow,
} from "@arcjet/next";

export const arcjetInstance = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    // Protect sign-up: Block disposable, invalid, or non-existent emails
    protectSignup({
      email: {
        mode: "LIVE",
        block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
      },
      bots: { mode: "LIVE" ,allow:[]},
      rateLimit: { mode: "LIVE", interval: "10m", max: 5 },
    }),

    // Protect sign-in: Validate emails & prevent brute force
    validateEmail({
      mode: "LIVE",
      block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
    }),

    shield({ mode: "LIVE" }),

    fixedWindow({ mode: "LIVE", window: "60s", max: 3 }), // Limit login attempts
  ],
});

// Helper function to format Arcjet errors
export const handleArcjetDecision = (decision: any) => {
  if (decision.isDenied()) {
    if (decision.reason.isEmail()) {
      const emailTypes = decision.reason.emailTypes;
      if (emailTypes.includes("DISPOSABLE"))
        return errorResponse("Disposable email addresses are not allowed.");
      if (emailTypes.includes("INVALID"))
        return errorResponse("Invalid email.");
      if (emailTypes.includes("NO_MX_RECORDS"))
        return errorResponse("Email domain has no valid MX records.");
    }
    if (decision.reason.isBot()) return errorResponse("Bot activity detected.");
    if (decision.reason.isRateLimit())
      return errorResponse("Too many requests! Try again later.");
    return errorResponse("Unauthorized request detected.");
  }
  return { success: true };
};

const errorResponse = (message: string) => ({
  error: message,
  success: false,
  status: 403,
});
