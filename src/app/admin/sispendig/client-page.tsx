"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabLaporanSispendig } from "./components/laporan-sispendig-tab";
import { TabSetoranGuru } from "./components/setoran-guru-tab";
import { TabSetoranKelas } from "./components/setoran-kelas-tab";
import { TabSetoranMasyarakat } from "./components/setoran-masyarakat-tab";
import type { SispendigClientProps } from "./components/types";
import { useSispendigAdminStore } from "./store";

export default function SispendigClient(props: SispendigClientProps) {
  const tabValue = useSispendigAdminStore((state) => state.activeTab);
  const setTabValue = useSispendigAdminStore((state) => state.setActiveTab);

  return (
    <Tabs value={tabValue} onValueChange={setTabValue} className="w-full space-y-6">
      <div className="w-full print:hidden">
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-2 w-full h-auto p-1.5 bg-muted/60 rounded-xl border border-border/80 border-b-[3px] border-b-border shadow-sm">
          <TabsTrigger
            value="kelas"
            className="w-full py-2.5 px-3 text-sm font-semibold rounded-lg transition-all text-center whitespace-normal data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:border-b-2 data-[state=active]:border-primary/80"
          >
            Setoran per Kelas
          </TabsTrigger>
          <TabsTrigger
            value="guru"
            className="w-full py-2.5 px-3 text-sm font-semibold rounded-lg transition-all text-center whitespace-normal data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:border-b-2 data-[state=active]:border-primary/80"
          >
            Setoran Guru
          </TabsTrigger>
          <TabsTrigger
            value="masyarakat"
            className="w-full py-2.5 px-3 text-sm font-semibold rounded-lg transition-all text-center whitespace-normal data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:border-b-2 data-[state=active]:border-primary/80"
          >
            Setoran Masyarakat
          </TabsTrigger>
          <TabsTrigger
            value="laporan"
            className="w-full py-2.5 px-3 text-sm font-semibold rounded-lg transition-all text-center whitespace-normal data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:border-b-2 data-[state=active]:border-primary/80"
          >
            Laporan
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="kelas" className="outline-none focus:outline-none">
        <TabSetoranKelas kelas={props.kelas} jenisSampah={props.jenisSampah} />
      </TabsContent>
      <TabsContent value="guru" className="outline-none focus:outline-none">
        <TabSetoranGuru
          jenisSampah={props.jenisSampah}
          gurus={props.gurus}
          initialSetoranGuru={props.initialSetoranGuru}
        />
      </TabsContent>
      <TabsContent value="masyarakat" className="outline-none focus:outline-none">
        <TabSetoranMasyarakat jenisSampah={props.jenisSampah} />
      </TabsContent>
      <TabsContent value="laporan" className="outline-none focus:outline-none">
        <TabLaporanSispendig />
      </TabsContent>
    </Tabs>
  );
}
