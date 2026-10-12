"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Camera, Recycle, Trash2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useSispendigPublicStore, type SispendigTab } from "./store";

const tabLoading = () => <div className="min-h-48" aria-busy="true" />;
const ArticlesTab = dynamic(() => import("./articles-tab"), { loading: tabLoading });
const DocumentationTab = dynamic(() => import("./documentation-tab"), { loading: tabLoading });
const DashboardTab = dynamic(() => import("./dashboard-tab"), { loading: tabLoading, ssr: false });

const tabItems: { value: SispendigTab; label: string; icon: typeof BookOpen }[] = [
  { value: "news", label: "Edukasi", icon: BookOpen },
  { value: "documentation", label: "Dokumentasi", icon: Camera },
  { value: "dashboard", label: "Setoran Sampah", icon: Trash2 },
];

export default function SispendigClient() {
  const activeTab = useSispendigPublicStore((state) => state.activeTab);
  const setActiveTab = useSispendigPublicStore((state) => state.setActiveTab);

  return (
    <div className="container mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6">
      <div className="space-y-1.5 text-center print:hidden">
        <div className="flex items-center justify-center gap-2">
          <Recycle className="h-6 w-6 text-emerald-600 sm:h-7 sm:w-7" />
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
            Sispendig SMPN 24 Padang
          </h1>
        </div>
        <p className="mx-auto max-w-2xl text-xs text-muted-foreground sm:text-sm">
          Sistem Pengelolaan Sampah Digital
          <br />
          Pantau setoran sampah, edukasi lingkungan, dan dokumentasi kegiatan.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as SispendigTab)} className="mt-4 w-full">
        <TabsList className="mx-auto grid h-auto w-full max-w-2xl grid-cols-3 gap-1 rounded-full bg-muted/70 p-1 print:hidden sm:gap-2">
          {tabItems.map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="min-h-11 gap-1.5 rounded-full px-2 text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground sm:gap-2 sm:px-4 sm:text-sm"
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="news">{activeTab === "news" && <ArticlesTab />}</TabsContent>
        <TabsContent value="documentation">{activeTab === "documentation" && <DocumentationTab />}</TabsContent>
        <TabsContent value="dashboard">{activeTab === "dashboard" && <DashboardTab />}</TabsContent>
      </Tabs>
    </div>
  );
}
