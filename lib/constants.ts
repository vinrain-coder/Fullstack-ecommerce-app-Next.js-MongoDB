export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Shopper";
export const APP_SLOGAN =
  process.env.NEXT_PUBLIC_APP_SLOGAN || "Spend less, enjoy more.";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "An ecommerce website built with Next.js and MomgoDB";
export const APP_COPYRIGHT =
  process.env.NEXT_PUBLIC_APP_COPYRIGHT ||
  `Copyright c 2025 ${APP_NAME}. All rights reserved.`;

export const PAGE_SIZE = Number(process.env.PAGE_SIZE || 9);
export const FREE_SHIPPING_MIN_PRICE = Number(
  process.env.FREE_SHIPPING_MIN_PRICE || 5000
);

export const AVAILABLE_PAYMENT_METHODS = [
  {
    name: "Mpesa",
    commission: 0,
    isDefault: true,
  },
  {
    name: "Paypal",
    commission: 0,
    isDefault: true,
  },
  {
    name: "Stripe",
    commission: 0,
    isDefault: true,
  },

  {
    name: "Cash on delivery",
    commission: 0,
    isDefault: true,
  },
];
export const DEFAULT_PAYMENT_METHOD =
  process.env.DEFAULT_PAYMENT_METHOD || "Mpesa";

export const AVAILABLE_DELIVERY_DATES = [
  {
    name: "Tomorrow",
    daysToDeliver: 1,
    shippingPrice: 500,
    freeShippingMinPrice: 0,
  },
  {
    name: "Next 3 days",
    daysToDeliver: 3,
    shippingPrice: 400,
    freeShippingMinPrice: 0,
  },
  {
    name: "Next 5 days",
    daysToDeliver: 5,
    shippingPrice: 300,
    freeShippingMinPrice: 35,
  },
];
