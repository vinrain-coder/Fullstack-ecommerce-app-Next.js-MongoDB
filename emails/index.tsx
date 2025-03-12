import { Resend } from "resend";
import PurchaseReceiptEmail from "./purchase-receipt";
import AskReviewOrderItemsEmail from "./ask-review-order-items";
import StockSubscriptionNotificationEmail from "./stock-subscription";
import { IOrder } from "@/lib/db/models/order.model";
import { IProduct } from "@/lib/db/models/product.model";
import { SENDER_EMAIL, SENDER_NAME } from "@/lib/constants";
import { getSetting } from "@/lib/actions/setting.actions"; // Add this import to get site settings

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const sendPurchaseReceipt = async ({ order }: { order: IOrder }) => {
  await resend.emails.send({
    from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
    to: (order.user as { email: string }).email,
    subject: "Order Confirmation",
    react: <PurchaseReceiptEmail order={order} />,
  });
};

export const sendAskReviewOrderItems = async ({ order }: { order: IOrder }) => {
  const oneDayFromNow = new Date(
    Date.now() + 1000 * 60 * 60 * 24
  ).toISOString();

  await resend.emails.send({
    from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
    to: (order.user as { email: string }).email,
    subject: "Review your order items",
    react: <AskReviewOrderItemsEmail order={order} />,
    scheduledAt: oneDayFromNow,
  });
};

// ✅ New: Send Stock Subscription Notification Email
export const sendStockSubscriptionNotification = async ({
  email,
  product,
}: {
  email: string;
  product: IProduct;
}) => {
  const { site } = await getSetting(); // Fetch site settings to get the site URL

  await resend.emails.send({
    from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
    to: email,
    subject: `🔔 "${product.name}" is back in stock!`,
    react: (
      <StockSubscriptionNotificationEmail
        product={product}
        email={email}
        siteUrl={site.url} // Pass siteUrl here
      />
    ),
  });

  console.log(
    `✅ Stock notification email sent to ${email} for "${product.name}"`
  );
};
