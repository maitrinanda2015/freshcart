import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useOrders = create(
  persist(
    (set) => ({
      orders: [], // newest first

            placeOrder: ({ items, subtotal, delivery, total, email }) =>
        set((state) => ({
          orders: [
            {
              id: "FC" + Date.now().toString().slice(-6),
              date: new Date().toISOString(),
              userEmail: email, // who placed this order
              items,
              subtotal,
              delivery,
              total,
              status: "On Delivery",
            },
            ...state.orders,
          ],
        })),

      updateStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        })),
    }),
    {
      name: "freshcart-orders",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);