import { create } from "zustand"

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("streamify-theme") || "forest",
  setTheme: (theme) => {
    // stored in local storage so that it presist even after reload
    localStorage.setItem("streamify-theme", theme)
    set({ theme })
  },
}))
