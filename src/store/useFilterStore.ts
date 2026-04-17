import { create } from "zustand";

export const useFilterStore = create((set) => ({
  district_id: 1,
  setDistrictId: (id: any) => set({ district_id: id }),

  FAO_BLUE: "#318DDE",
  setFAO_BLUE: (color: any) => set({ FAO_BLUE: color }),

  isDarkMode: false,

  borderColor: "border-gray-300",
  setBorderColor: (color: any) => set({ borderColor: color }),

  cardBg: "bg-white/95",
  setCardBg: (color: any) => set({ cardBg: color }),

  textMuted: "text-gray-500",
  setTextMuted: (color: any) => set({ textMuted: color }),

  headerText: "text-gray-900",
  setHeaderText: (color: any) => set({ headerText: color }),

  setIsDarkMode: (mode: any) =>
    set({
      isDarkMode: mode,

      // cardBg: mode ? "bg-slate-800/85" : "bg-white/95",
      // borderColor: mode ? "border-slate-700/30" : "border-slate-200",
      // textMuted: mode ? "text-slate-400" : "text-slate-500",
      // headerText: mode ? "text-white" : "text-slate-900",
    }),
}));
