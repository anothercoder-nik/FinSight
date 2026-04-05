import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Role } from "@/types";

interface RoleStore {
  role: Role;
  isDark: boolean;
  setRole: (role: Role) => void;
  toggleDark: () => void;
}

export const useRoleStore = create<RoleStore>()(
  persist(
    (set) => ({
      role: "viewer",
      isDark: false,
      setRole: (role) => set({ role }),
      toggleDark: () =>
        set((state) => {
          const next = !state.isDark;
          document.documentElement.classList.toggle("dark", next);
          return { isDark: next };
        }),
    }),
    {
      name: "finflow-ui",
      onRehydrateStorage: () => (state) => {
        if (state?.isDark) {
          document.documentElement.classList.add("dark");
        }
      },
    }
  )
);