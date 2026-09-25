"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getAllGurus } from "../actions";
import {
  createSetoranGuru,
  deleteGuru,
  deleteSetoranGuru,
  getSetoranGuru,
  getSetoranGuruByGuru,
  updateSetoranGuru,
} from "../setoran-guru-actions";
import { MONTHS } from "./constants";
import { GuruDialog } from "./guru-dialog";
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
import type { Guru, JenisSampah, SetoranGuruEntry } from "./types";

interface TabSetoranGuruProps {
  jenisSampah: JenisSampah[];
  gurus: Guru[];
  initialSetoranGuru: SetoranGuruEntry[];
}

export function TabSetoranGuru({
  jenisSampah,
  gurus: initialGurus,
  initialSetoranGuru,
}: TabSetoranGuruProps) {
  const { toast } = useToast();
  const [gurus, setGurus] = useState<Guru[]>(initialGurus);
  const [setoranList, setSetoranList] =
    useState<SetoranGuruEntry[]>(initialSetoranGuru);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  // Modal kelola setoran guru
  const [manageGuru, setManageGuru] = useState<Guru | null>(null);
  const [entries, setEntries] = useState<SetoranGuruEntry[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(false);

  // Modal tambah/edit guru
  const [guruModalOpen, setGuruModalOpen] = useState(false);
  const [editingGuru, setEditingGuru] = useState<Guru | null>(null);

  // Modal hapus guru
  const [deletingGuru, setDeletingGuru] = useState<Guru | null>(null);

  const refetchGurus = async () => {
    const res = await getAllGurus();
    if (res.data) setGurus(res.data);
  };

  const refetchAllSetoran = useCallback(async () => {
    setLoading(true);
    const res = await getSetoranGuru(selectedMonth, selectedYear);
    if (res.data) setSetoranList(res.data);
    setLoading(false);
  }, [selectedMonth, selectedYear]);

  const hasUsedInitialData = useRef(false);
  useEffect(() => {
    if (!hasUsedInitialData.current) {
      hasUsedInitialData.current = true;
      return;
    }
    void refetchAllSetoran();
  }, [refetchAllSetoran]);

  const fetchGuruEntries = useCallback(
    async (guruId: number) => {
      setLoadingEntries(true);
      setEntries([]);
      const res = await getSetoranGuruByGuru(
        guruId,
        selectedMonth,
        selectedYear,
      );
      if (res.data) {
        setEntries(res.data);
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

  const openManageGuru = (row: SetoranSummaryRow) => {
    const guru = gurus.find((g) => g.id === Number(row.id));
    if (!guru) return;
    setManageGuru(guru);
    void fetchGuruEntries(guru.id);
  };

  // Ringkasan data per guru (1-pass loop bersih dan reaktif)
  const summaryRows = useMemo<SetoranSummaryRow[]>(() => {
    const summaryMap = new Map<
      number,
      {
        guru: Guru;
        totalKg: number;
        totalValue: number;
        setoranCount: number;
        types: Set<string>;
      }
    >();

    gurus.forEach((guru) => {
      summaryMap.set(guru.id, {
        guru,
        totalKg: 0,
        totalValue: 0,
        setoranCount: 0,
        types: new Set(),
      });
    });

    setoranList.forEach((s) => {
      if (s.guruId && summaryMap.has(s.guruId)) {
        const item = summaryMap.get(s.guruId)!;
        const kg = Number(s.jumlahKg) || 0;
        const val = kg * Number(s.hargaPerKg || 0);
        item.totalKg += kg;
        item.totalValue += val;
        item.setoranCount += 1;
        if (s.jenisSampah) item.types.add(s.jenisSampah);
      }
    });

    return Array.from(summaryMap.values()).map(
      ({ guru, totalKg, totalValue, setoranCount, types }) => ({
        id: guru.id,
        name: guru.namaGuru,
        wasteTypes: Array.from(types).join(", ") || "-",
        setoranCount,
        totalKg,
        totalValue,
      }),
    );
  }, [gurus, setoranList]);

  // Handler CRUD entri setoran
  const handleAddEntry = async (
    jenisSampahId: number,
    jumlahKg: number,
  ): Promise<boolean> => {
    if (!manageGuru) return false;
    const res = await createSetoranGuru({
      guruId: manageGuru.id,
      jenisSampahId,
      jumlahKg,
      createdAt: new Date(selectedYear, selectedMonth - 1, 15),
    });

    if (res.success) {
      toast({ title: "Sukses", description: res.message });
      void fetchGuruEntries(manageGuru.id);
      void refetchAllSetoran();
      return true;
    }

    toast({
      title: "Gagal",
      description: res.message || "Gagal menambah setoran.",
      variant: "destructive",
    });
    return false;
  };

  const handleUpdateEntry = async (
    id: number,
    jenisSampahId: number,
    jumlahKg: number,
  ): Promise<boolean> => {
    const res = await updateSetoranGuru(id, { jenisSampahId, jumlahKg });
    if (res.success) {
      toast({ title: "Sukses", description: res.message });
      void refetchAllSetoran();
      if (manageGuru) void fetchGuruEntries(manageGuru.id);
      return true;
    }

    toast({
      title: "Gagal",
      description: res.message,
      variant: "destructive",
    });
    return false;
  };

  const handleDeleteEntry = async (id: number): Promise<boolean> => {
    const res = await deleteSetoranGuru(id);
    if (res.success) {
      toast({ title: "Sukses", description: res.message });
      void refetchAllSetoran();
      if (manageGuru) void fetchGuruEntries(manageGuru.id);
      return true;
    }

    toast({
      title: "Gagal",
      description: res.message,
      variant: "destructive",
    });
    return false;
  };

  const handleDeleteGuru = async () => {
    if (!deletingGuru) return;
    const res = await deleteGuru(deletingGuru.id);
    if (res.success) {
      toast({ title: "Sukses", description: res.message });
      void refetchGurus();
      void refetchAllSetoran();
      if (manageGuru?.id === deletingGuru.id) setManageGuru(null);
    } else {
      toast({
        title: "Gagal",
        description: res.message,
        variant: "destructive",
      });
    }
    setDeletingGuru(null);
  };

  // Format entries untuk dialog
  const detailItems: SetoranDetailItem[] = useMemo(
    () =>
      entries.map((e) => ({
        id: e.id,
        jenisSampahId: e.jenisSampahId ?? 0,
        jenisSampah: e.jenisSampah || "-",
        jumlahKg: e.jumlahKg,
        hargaPerKg: e.hargaPerKg,
        tanggal: e.createdAt,
      })),
    [entries],
  );

  return (
    <div>
      <Card className="relative print:border-0 print:shadow-none print:p-0">
        <SetoranHeader
          title="Riwayat Setoran Guru"
          subtitle="Kelola data setoran dari setiap guru."
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
          addNewLabel="Tambah Guru"
          onAddNew={() => {
            setEditingGuru(null);
            setGuruModalOpen(true);
          }}
          onPrint={() => window.print()}
          loading={loading}
        />

        <CardContent>
          <SetoranSummaryTable
            printTitle={`Laporan Setoran Guru - ${MONTHS[selectedMonth - 1]} ${selectedYear}`}
            nameHeader="Nama Guru"
            emptyMessage="Belum ada data guru."
            items={summaryRows}
            onManage={openManageGuru}
            onDelete={(row) => {
              const guru = gurus.find((g) => g.id === Number(row.id));
              if (guru) setDeletingGuru(guru);
            }}
          />
        </CardContent>
      </Card>

      {/* Modal Kelola Setoran Guru */}
      <KelolaSetoranDialog
        isOpen={!!manageGuru}
        onClose={() => setManageGuru(null)}
        title={`Kelola Setoran: ${manageGuru?.namaGuru}`}
        subtitle={`Tambah atau edit setoran untuk guru ini di bulan ${MONTHS[selectedMonth - 1]} ${selectedYear}.`}
        jenisSampah={jenisSampah}
        entries={detailItems}
        loadingEntries={loadingEntries}
        onAddEntry={handleAddEntry}
        onUpdateEntry={handleUpdateEntry}
        onDeleteEntry={handleDeleteEntry}
      />

      {/* Modal Tambah/Edit Guru */}
      <GuruDialog
        isOpen={guruModalOpen}
        onClose={() => {
          setGuruModalOpen(false);
          setEditingGuru(null);
        }}
        guru={editingGuru}
        onSuccess={() => {
          void refetchGurus();
          void refetchAllSetoran();
        }}
      />

      {/* Konfirmasi Hapus Guru */}
      <ConfirmDeleteDialog
        isOpen={!!deletingGuru}
        onClose={() => setDeletingGuru(null)}
        onConfirm={handleDeleteGuru}
        description={`Tindakan ini akan menghapus guru '${deletingGuru?.namaGuru}' secara permanen. Semua data setoran terkait juga akan terhapus.`}
      />
    </div>
  );
}
