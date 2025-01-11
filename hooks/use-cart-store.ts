import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Cart, OrderItem } from "@/types";
import { calculateDeliveryDateAndPrice } from "@/lib/actions/order.actions";

const initialState: Cart = {
  items: [],
  itemsPrice: 0,
  taxPrice: undefined,
  shippingPrice: undefined,
  totalPrice: 0,
  paymentMethod: undefined,
  deliveryDateIndex: undefined,
};

interface CartState {
  cart: Cart;
  addItem: (item: OrderItem, quantity: number) => Promise<string>;
  updateItem: (item: OrderItem, quantity: number) => Promise<void>;
  removeItem: (item: OrderItem) => void; // RemoveItem method is declared but not implemented in the provided code
  init: () => void; // Ensure `init` is part of the interface
}

const useCartStore = create(
  persist<CartState>(
    (set, get) => ({
      cart: initialState,

      addItem: async (item: OrderItem, quantity: number) => {
        const { items } = get().cart;

        const existItem = items.find(
          (x) =>
            x.product === item.product &&
            x.color === item.color &&
            x.size === item.size
        );

        if (existItem) {
          if (existItem.countInStock < quantity + existItem.quantity) {
            throw new Error("Not enough items in stock");
          }
        } else {
          if (item.countInStock < quantity) {
            throw new Error("Not enough items in stock");
          }
        }

        const updatedCartItems = existItem
          ? items.map((x) =>
              x.product === item.product &&
              x.color === item.color &&
              x.size === item.size
                ? { ...existItem, quantity: existItem.quantity + quantity }
                : x
            )
          : [...items, { ...item, quantity }];

        const calculatedValues = await calculateDeliveryDateAndPrice({
          items: updatedCartItems,
        });

        set({
          cart: {
            ...get().cart,
            items: updatedCartItems,
            ...calculatedValues,
          },
        });

        const addedItem = updatedCartItems.find(
          (x) =>
            x.product === item.product &&
            x.color === item.color &&
            x.size === item.size
        );

        if (!addedItem) {
          throw new Error("Failed to add the item to the cart.");
        }

        return addedItem.clientId!;
      },

      updateItem: async (item: OrderItem, quantity: number) => {
        const { items } = get().cart;

        const exist = items.find(
          (x) =>
            x.product === item.product &&
            x.color === item.color &&
            x.size === item.size
        );

        if (!exist) return;

        const updatedCartItems = items.map((x) =>
          x.product === item.product &&
          x.color === item.color &&
          x.size === item.size
            ? { ...exist, quantity }
            : x
        );

        const calculatedValues = await calculateDeliveryDateAndPrice({
          items: updatedCartItems,
        });

        set({
          cart: {
            ...get().cart,
            items: updatedCartItems,
            ...calculatedValues,
          },
        });
      },

      removeItem: (item: OrderItem) => {
        const { items } = get().cart;

        const updatedCartItems = items.filter(
          (x) =>
            x.product !== item.product ||
            x.color !== item.color ||
            x.size !== item.size
        );

        set({
          cart: {
            ...get().cart,
            items: updatedCartItems,
          },
        });
      },

      init: () => set({ cart: initialState }),
    }),

    {
      name: "cart-store",
    }
  )
);

export default useCartStore;
