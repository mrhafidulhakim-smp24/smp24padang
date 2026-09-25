"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { TabLaporanSispendik } from "./components/laporan-sispendik-tab";
import { TabSetoranGuru } from "./components/setoran-guru-tab";
import { TabSetoranKelas } from "./components/setoran-kelas-tab";
import { TabSetoranMasyarakat } from "./components/setoran-masyarakat-tab";
import type { SispendikClientProps } from "./components/types";

type SispendikTab = "kelas" | "guru" | "masyarakat" | "laporan";

function isSispendikTab(value: string): value is SispendikTab {
  return ["kelas", "guru", "masyarakat", "laporan"].includes(value);
}

export default function SispendikClient(props: SispendikClientProps) {
  const [tabValue, setTabValue] = useState<SispendikTab>("kelas");
  const handleTabChange = (value: string) => {
    if (isSispendikTab(value)) setTabValue(value);
  };

  return (
    <Tabs value={tabValue} onValueChange={handleTabChange} className="w-full space-y-6">
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
        <TabLaporanSispendik />
      </TabsContent>
    </Tabs>
  );
}
