import arcjet, {
  protectSignup,
  validateEmail,
  shield,
  fixedWindow,
} from "@arcjet/next";

export const arcjetInstance = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    protectSignup({
      email: {
        mode: "LIVE",
        block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
      },
      bots: { mode: "LIVE", allow: [] },
      rateLimit: { mode: "LIVE", interval: "10m", max: 5 },
    }),
    validateEmail({
      mode: "LIVE",
      block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
    }),
    shield({ mode: "LIVE" }),
    fixedWindow({ mode: "LIVE", window: "60s", max: 3 }),
  ],
});
