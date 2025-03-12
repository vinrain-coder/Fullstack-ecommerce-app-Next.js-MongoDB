"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../db";
import StockSubscription from "../db/models/stock-subscription.model";
import Product from "../db/models/product.model";
import { z } from "zod";
import { sendStockSubscriptionNotification } from "@/emails";

export const subscribeToStock = async (data: {
  email: string;
  productId: string;
}) => {
  try {
    await connectToDatabase();

    const { email, productId } = data;

    // Validate if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return {
        success: false,
        message: "Product not found.",
      };
    }

    // Check if already subscribed
    const existingSubscription = await StockSubscription.findOne({
      email,
      product: productId,
    });

    if (existingSubscription) {
      return {
        success: false,
        message: "You are already subscribed to this product.",
      };
    }

    // Create new subscription
    await StockSubscription.create({
      email,
      product: productId,
      subscribedAt: new Date(),
    });

    revalidatePath("/admin/stock-subscriptions"); // Revalidate for admin view
    return { success: true, message: "Subscription successful!" };
  } catch (error) {
    console.error("Error subscribing to stock:", error);
    return { success: false, message: "An error occurred. Please try again." };
  }
};

export const checkStockAndNotify = async (productId: string) => {
  try {
    await connectToDatabase();

    const product = await Product.findById(productId);
    if (!product) return { success: false, message: "Product not found." };

    if (product.countInStock > 0) {
      // Fetch all pending subscriptions for this product
      const subscriptions = await StockSubscription.find({
        product: productId,
        isNotified: false,
      });

      if (subscriptions.length === 0)
        return { success: true, message: "No subscribers to notify." };

      // Send notification emails to all subscribers
      await Promise.all(
        subscriptions.map((sub) =>
          sendStockSubscriptionNotification({ email: sub.email, product })
        )
      );

      console.log(
        `✅ Notified ${subscriptions.length} subscribers about "${product.name}"`
      );

      // Mark subscriptions as notified
      await StockSubscription.updateMany(
        { product: productId, isNotified: false },
        { $set: { isNotified: true } }
      );

      revalidatePath("/admin/stock-subscriptions");
      return { success: true, message: "Subscribers notified." };
    }

    return { success: false, message: "Product is still out of stock." };
  } catch (error) {
    console.error("❌ Stock check error:", error);
    return { success: false, message: "An error occurred." };
  }
};
