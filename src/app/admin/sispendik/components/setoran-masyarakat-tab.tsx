"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  createSetoranMasyarakat,
  deleteSetoranMasyarakat,
  deleteSetoranMasyarakatByNama,
  getSetoranMasyarakat,
  getSetoranMasyarakatByNama,
  updateSetoranMasyarakat,
} from "../setoran-masyarakat-actions";
import { MONTHS } from "./types";
import { SetoranHeader } from "./setoran-header";
import {
  SetoranSummaryTable,
  type SetoranSummaryRow,
} from "./setoran-summary-table";
import {
  KelolaSetoranDialog,
  type SetoranDetailItem,
} from "./kelola-setoran-dialog";
import { ConfirmDeleteDialog } from "./confirm-delete-dialog";
import { TambahPenyetorDialog } from "./tambah-penyetor-dialog";
import type { JenisSampah } from "./types";

interface TabSetoranMasyarakatProps {
  jenisSampah: JenisSampah[];
}

interface SetoranMasyarakatRawEntry {
  id: number;
  namaPenyetor: string;
  jenisSampahId: number;
  jenisSampah: string;
  kategori: string | null;
  jumlahKg: string | number;
  hargaPerKg: string | number | null;
  tanggalSetoran: Date | string;
}

export function TabSetoranMasyarakat({
  jenisSampah,
}: TabSetoranMasyarakatProps) {
  const { toast } = useToast();
  const [setoranList, setSetoranList] = useState<SetoranMasyarakatRawEntry[]>(
    [],
  );
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  // Modal kelola setoran penyetor
  const [managePenyetor, setManagePenyetor] = useState<string | null>(null);
  const [entries, setEntries] = useState<SetoranMasyarakatRawEntry[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(false);

  // Modal tambah penyetor baru
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Modal hapus penyetor
  const [deletingPenyetor, setDeletingPenyetor] = useState<string | null>(null);

  const refetchAllSetoran = useCallback(async () => {
    setLoading(true);
    const res = await getSetoranMasyarakat(selectedMonth, selectedYear);
    if (res.data) {
      setSetoranList(res.data as SetoranMasyarakatRawEntry[]);
    } else if (res.error) {
      toast({
        title: "Gagal Mengambil Data",
        description: res.error,
        variant: "destructive",
      });
    }
    setLoading(false);
  }, [selectedMonth, selectedYear, toast]);

  useEffect(() => {
    void refetchAllSetoran();
  }, [refetchAllSetoran]);

  const fetchPenyetorEntries = useCallback(
    async (namaPenyetor: string) => {
      setLoadingEntries(true);
      setEntries([]);
      const res = await getSetoranMasyarakatByNama(
        namaPenyetor,
        selectedMonth,
        selectedYear,
      );
      if (res.data) {
        setEntries(res.data as SetoranMasyarakatRawEntry[]);
      } else if (res.error) {
        toast({
          title: "Gagal Memuat Setoran",
          description: res.error,
          variant: "destructive",
        });
      }
      setLoadingEntries(false);
    },
    [toast, selectedMonth, selectedYear],
  );

  const openManagePenyetor = (row: SetoranSummaryRow) => {
    setManagePenyetor(row.name);
    void fetchPenyetorEntries(row.name);
  };

  // Ringkasan data per penyetor (1-pass loop bersih dan reaktif)
  const summaryRows = useMemo<SetoranSummaryRow[]>(() => {
    const summaryMap = new Map<
      string,
      {
        namaPenyetor: string;
        totalKg: number;
        totalValue: number;
        setoranCount: number;
        types: Set<string>;
      }
    >();

    setoranList.forEach((s) => {
      if (!summaryMap.has(s.namaPenyetor)) {
        summaryMap.set(s.namaPenyetor, {
          namaPenyetor: s.namaPenyetor,
          totalKg: 0,
          totalValue: 0,
          setoranCount: 0,
          types: new Set(),
        });
      }
      const item = summaryMap.get(s.namaPenyetor)!;
      const kg = Number(s.jumlahKg) || 0;
      const val = kg * Number(s.hargaPerKg || 0);
      item.totalKg += kg;
      item.totalValue += val;
      item.setoranCount += 1;
      if (s.jenisSampah) item.types.add(s.jenisSampah);
    });

    return Array.from(summaryMap.values()).map(
      ({ namaPenyetor, totalKg, totalValue, setoranCount, types }) => ({
        id: namaPenyetor,
        name: namaPenyetor,
        wasteTypes: Array.from(types).join(", ") || "-",
        setoranCount,
        totalKg,
        totalValue,
      }),
    );
  }, [setoranList]);

  // Handler CRUD entri setoran
  const handleAddEntry = async (
    jenisSampahId: number,
    jumlahKg: number,
  ): Promise<boolean> => {
    if (!managePenyetor) return false;
    const defaultDate = new Date(selectedYear, selectedMonth - 1, 15);
    const res = await createSetoranMasyarakat({
      namaPenyetor: managePenyetor,
      tanggalSetoran: defaultDate,
      items: [{ jenisSampahId, jumlahKg }],
    });

    if (res.success) {
      toast({ title: "Sukses", description: "Setoran berhasil ditambahkan." });
      void fetchPenyetorEntries(managePenyetor);
      void refetchAllSetoran();
      return true;
    }

    toast({
      title: "Gagal",
      description: res.error || "Gagal menambah setoran.",
      variant: "destructive",
    });
    return false;
  };

  const handleUpdateEntry = async (
    id: number,
    jenisSampahId: number,
    jumlahKg: number,
  ): Promise<boolean> => {
    const res = await updateSetoranMasyarakat(id, { jenisSampahId, jumlahKg });
    if (res.success) {
      toast({
        title: "Sukses",
        description: res.message || "Setoran berhasil diperbarui.",
      });
      void refetchAllSetoran();
      if (managePenyetor) void fetchPenyetorEntries(managePenyetor);
      return true;
    }

    toast({
      title: "Gagal",
      description: res.error || "Gagal memperbarui setoran.",
      variant: "destructive",
    });
    return false;
  };

  const handleDeleteEntry = async (id: number): Promise<boolean> => {
    const res = await deleteSetoranMasyarakat(id);
    if (res.success) {
      toast({
        title: "Sukses",
        description: res.message || "Setoran berhasil dihapus.",
      });
      void refetchAllSetoran();
      if (managePenyetor) void fetchPenyetorEntries(managePenyetor);
      return true;
    }

    toast({
      title: "Gagal",
      description: res.error || "Gagal menghapus setoran.",
      variant: "destructive",
    });
    return false;
  };

  const handleDeletePenyetor = async () => {
    if (!deletingPenyetor) return;
    const res = await deleteSetoranMasyarakatByNama(
      deletingPenyetor,
      selectedMonth,
      selectedYear,
    );
    if (res.success) {
      toast({
        title: "Sukses",
        description:
          res.message || `Setoran ${deletingPenyetor} berhasil dihapus.`,
      });
      void refetchAllSetoran();
      if (managePenyetor === deletingPenyetor) setManagePenyetor(null);
    } else {
      toast({
        title: "Gagal",
        description: res.error || "Gagal menghapus setoran penyetor.",
        variant: "destructive",
      });
    }
    setDeletingPenyetor(null);
  };

  // Format entries untuk dialog
  const detailItems: SetoranDetailItem[] = useMemo(
    () =>
      entries.map((e) => ({
        id: e.id,
        jenisSampahId: e.jenisSampahId,
        jenisSampah: e.jenisSampah || "-",
        jumlahKg: e.jumlahKg,
        hargaPerKg: e.hargaPerKg,
        tanggal: e.tanggalSetoran,
      })),
    [entries],
  );

  return (
    <div>
      <Card className="relative print:border-0 print:shadow-none print:p-0">
        <SetoranHeader
          title="Riwayat Setoran Masyarakat"
          subtitle="Kelola data setoran dari setiap warga/masyarakat."
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
          addNewLabel="Tambah Penyetor"
          onAddNew={() => setAddModalOpen(true)}
          onPrint={() => window.print()}
          loading={loading}
        />

        <CardContent>
          <SetoranSummaryTable
            printTitle={`Laporan Setoran Masyarakat - ${MONTHS[selectedMonth - 1]} ${selectedYear}`}
            nameHeader="Nama Penyetor"
            emptyMessage="Belum ada data setoran masyarakat bulan ini."
            items={summaryRows}
            onManage={openManagePenyetor}
            onDelete={(row) => setDeletingPenyetor(row.name)}
          />
        </CardContent>
      </Card>

      {/* Modal Kelola Setoran Penyetor */}
      <KelolaSetoranDialog
        isOpen={!!managePenyetor}
        onClose={() => setManagePenyetor(null)}
        title={`Kelola Setoran: ${managePenyetor}`}
        subtitle={`Tambah atau edit setoran untuk warga ini di bulan ${MONTHS[selectedMonth - 1]} ${selectedYear}.`}
        jenisSampah={jenisSampah}
        entries={detailItems}
        loadingEntries={loadingEntries}
        onAddEntry={handleAddEntry}
        onUpdateEntry={handleUpdateEntry}
        onDeleteEntry={handleDeleteEntry}
      />

      {/* Modal Tambah Penyetor Baru */}
      <TambahPenyetorDialog
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        jenisSampah={jenisSampah}
        onSuccess={() => void refetchAllSetoran()}
      />

      {/* Konfirmasi Hapus Penyetor */}
      <ConfirmDeleteDialog
        isOpen={!!deletingPenyetor}
        onClose={() => setDeletingPenyetor(null)}
        onConfirm={handleDeletePenyetor}
        description={`Tindakan ini akan menghapus semua setoran untuk penyetor '${deletingPenyetor}' pada bulan ${MONTHS[selectedMonth - 1]} ${selectedYear} secara permanen.`}
      />
    </div>
  );
}
