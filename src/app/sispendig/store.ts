"use client";

import {
  getPublicWasteDocumentation,
  getPublicWasteNews,
  getPublicWasteVideos,
} from "@/app/admin/banksampah/actions";
import type {
  WasteDocumentationItem,
  WasteNewsItem,
  WasteVideoItem,
} from "@/types/banksampah";
import { create } from "zustand";
import { getPublicDashboardData } from "./actions";

export type LevelFilter = "all" | "7" | "8" | "9";
export type SispendigTab = "news" | "documentation" | "dashboard";

export type ClassRanking = {
  className: string;
  total: number;
  totalValue: number;
  jenisList: string | null;
  categories: string | null;
};

export type GuruRanking = {
  guruName: string;
  totalKg: number;
  wasteTypes: string | null;
  categories: string | null;
};

export type MasyarakatTotal = {
  wasteType: string;
  category: string | null;
  totalKg: number;
};

export type TopWasteType = {
  wasteType: string;
  totalKg: number;
  totalValue: number;
  category?: string;
};

export type DashboardData = {
  progress: { kelas: string; months: number[] }[];
  classTotals: ClassRanking[];
  summary: { totalKg: number; totalValue: number };
  topWasteTypes: TopWasteType[];
  guruRanking: GuruRanking[];
  masyarakatTotals: MasyarakatTotal[];
};

export const EMPTY_DASHBOARD: DashboardData = {
  progress: [],
  classTotals: [],
  summary: { totalKg: 0, totalValue: 0 },
  topWasteTypes: [],
  guruRanking: [],
  masyarakatTotals: [],
};

const dashboardKey = (month: number, year: number) => `${year}-${month}`;

type SispendigPublicState = {
  activeTab: SispendigTab;
  month: number;
  year: number;
  levelFilter: LevelFilter;
  progressLevelFilter: LevelFilter;
  topRankerType: "kelas" | "guru";
  dashboards: Record<string, DashboardData>;
  loadingDashboardKey: string | null;
  dashboardError: string | null;
  news: WasteNewsItem[] | null;
  videos: WasteVideoItem[] | null;
  documentation: WasteDocumentationItem[] | null;
  loadingNews: boolean;
  loadingVideos: boolean;
  loadingDocumentation: boolean;
  setActiveTab: (tab: SispendigTab) => void;
  setMonth: (month: number) => void;
  setYear: (year: number) => void;
  setLevelFilter: (filter: LevelFilter) => void;
  setProgressLevelFilter: (filter: LevelFilter) => void;
  toggleTopRankerType: () => void;
  loadDashboard: (month: number, year: number) => Promise<void>;
  loadNews: () => Promise<void>;
  loadVideos: () => Promise<void>;
  loadDocumentation: () => Promise<void>;
};

export const useSispendigPublicStore = create<SispendigPublicState>(
  (set, get) => ({
    activeTab: "news",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    levelFilter: "all",
    progressLevelFilter: "all",
    topRankerType: "kelas",
    dashboards: {},
    loadingDashboardKey: null,
    dashboardError: null,
    news: null,
    videos: null,
    documentation: null,
    loadingNews: false,
    loadingVideos: false,
    loadingDocumentation: false,
    setActiveTab: (activeTab) => set({ activeTab }),
    setMonth: (month) => set({ month }),
    setYear: (year) => set({ year }),
    setLevelFilter: (levelFilter) => set({ levelFilter }),
    setProgressLevelFilter: (progressLevelFilter) => set({ progressLevelFilter }),
    toggleTopRankerType: () =>
      set((state) => ({
        topRankerType: state.topRankerType === "kelas" ? "guru" : "kelas",
      })),
    loadDashboard: async (month, year) => {
      const key = dashboardKey(month, year);
      if (get().dashboards[key] || get().loadingDashboardKey === key) return;

      set({ loadingDashboardKey: key, dashboardError: null });
      try {
        const result = await getPublicDashboardData(month, year);
        if (!result.data) throw new Error(result.error || "Gagal memuat data setoran sampah.");

        set((state) => ({
          dashboards: { ...state.dashboards, [key]: result.data as DashboardData },
        }));
      } catch (error) {
        console.error("Failed to load Sispendig dashboard data:", error);
        set({ dashboardError: "Gagal memuat data setoran sampah." });
      } finally {
        if (get().loadingDashboardKey === key) {
          set({ loadingDashboardKey: null });
        }
      }
    },
    loadNews: async () => {
      if (get().news || get().loadingNews) return;

      set({ loadingNews: true });
      try {
        set({ news: (await getPublicWasteNews()) as WasteNewsItem[] });
      } catch (error) {
        console.error("Failed to fetch waste news:", error);
        set({ news: [] });
      } finally {
        set({ loadingNews: false });
      }
    },
    loadVideos: async () => {
      if (get().videos || get().loadingVideos) return;

      set({ loadingVideos: true });
      try {
        set({ videos: (await getPublicWasteVideos()) as WasteVideoItem[] });
      } catch (error) {
        console.error("Failed to fetch waste videos:", error);
        set({ videos: [] });
      } finally {
        set({ loadingVideos: false });
      }
    },
    loadDocumentation: async () => {
      if (get().documentation || get().loadingDocumentation) return;

      set({ loadingDocumentation: true });
      try {
        set({ documentation: (await getPublicWasteDocumentation()) as WasteDocumentationItem[] });
      } catch (error) {
        console.error("Failed to fetch waste documentation:", error);
        set({ documentation: [] });
      } finally {
        set({ loadingDocumentation: false });
      }
    },
  }),
);

export { dashboardKey };
