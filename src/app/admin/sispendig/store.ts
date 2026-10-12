"use client";

import { create } from "zustand";

export type SispendigAdminTab = "kelas" | "guru" | "masyarakat" | "laporan";

const isSispendigAdminTab = (value: string): value is SispendigAdminTab =>
  ["kelas", "guru", "masyarakat", "laporan"].includes(value);

type SispendigAdminState = {
  activeTab: SispendigAdminTab;
  setActiveTab: (value: string) => void;
};

export const useSispendigAdminStore = create<SispendigAdminState>((set) => ({
  activeTab: "kelas",
  setActiveTab: (value) => {
    if (isSispendigAdminTab(value)) set({ activeTab: value });
  },
}));
