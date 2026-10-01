import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useCart = create(
  persist(
    (set) => ({
      items: [], // each item: { id, name, price, unit, emoji, bg, qty }

      addItem: (product, qty = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === product.id ? { ...i, qty: i.qty + qty } : i
              ),
            };
          }
          return { items: [...state.items, { ...product, qty }] };
        }),

      decreaseItem: (id) =>
        set((state) => ({
          items: state.items
            .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
            .filter((i) => i.qty > 0),
        })),

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "freshcart-cart", // key used in storage
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const getCount = (items) => items.reduce((sum, i) => sum + i.qty, 0);
export const getSubtotal = (items) => items.reduce((sum, i) => sum + i.price * i.qty, 0);