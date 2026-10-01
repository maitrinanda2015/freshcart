import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useUser = create(
  persist(
    (set) => ({
      user: null, // { name, email } when logged in

      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: "freshcart-user",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);