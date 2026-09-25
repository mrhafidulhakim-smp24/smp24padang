"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Plus, Printer, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createSetoranMasyarakat,
  deleteSetoranMasyarakat,
  getSetoranMasyarakat,
  updateSetoranMasyarakat,
} from "../setoran-masyarakat-actions";
import { MONTHS } from "./constants";
import type { JenisSampah } from "./types";

type SetoranMasyarakat = {
  id: number;
  namaPenyetor: string;
  jenisSampahId: number;
  jenisSampah: string;
  kategori: string;
  jumlahKg: string | number;
  hargaPerKg: string | number;
  tanggalSetoran: Date | string;
};

type ItemForm = {
  key: number;
  jenisSampahId: string;
  jumlahKg: string;
};

let itemKey = 0;
const newItem = (): ItemForm => ({
  key: ++itemKey,
  jenisSampahId: "",
  jumlahKg: "",
});

const toDateInput = (value: Date | string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
};

export function TabSetoranMasyarakat({
  jenisSampah,
}: {
  jenisSampah: JenisSampah[];
}) {
  const { toast } = useToast();
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [rows, setRows] = useState<SetoranMasyarakat[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [namaPenyetor, setNamaPenyetor] = useState("");
  const [tanggalSetoran, setTanggalSetoran] = useState(toDateInput(today));
  const [items, setItems] = useState<ItemForm[]>([newItem()]);

  const years = useMemo(
    () =>
      Array.from(
        { length: 11 },
        (_, index) => new Date().getFullYear() - 5 + index,
      ),
    [],
  );

  const fetchRows = useCallback(async () => {
    setLoading(true);
    const result = await getSetoranMasyarakat(month, year);
    if (result.data) setRows(result.data as SetoranMasyarakat[]);
    else {
      setRows([]);
      if (result.error)
        toast({
          title: "Gagal memuat data",
          description: result.error,
          variant: "destructive",
        });
    }
    setLoading(false);
  }, [month, year, toast]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  // Form kosong: mulai penyetor baru. Nama & tanggal terakhir dipertahankan
  // agar penyetor berikutnya tinggal menambah item (alur input beruntun).
  const resetForm = () => {
    setEditingId(null);
    setNamaPenyetor("");
    setTanggalSetoran(toDateInput(today));
    setItems([newItem()]);
  };

  const setItem = (key: number, patch: Partial<ItemForm>) => {
    setItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, ...patch } : item)),
    );
  };

  const removeItem = (key: number) => {
    setItems((prev) =>
      prev.length > 1 ? prev.filter((item) => item.key !== key) : [newItem()],
    );
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (editingId) {
      // Edit satu baris daftar = satu jenis sampah.
      const first = items[0];
      if (!first.jenisSampahId || !Number(first.jumlahKg)) {
        toast({
          title: "Lengkapi isian",
          description: "Pilih jenis sampah dan isi jumlah (kg).",
          variant: "destructive",
        });
        return;
      }
      setSaving(true);
      const result = await updateSetoranMasyarakat(editingId, {
        jenisSampahId: Number(first.jenisSampahId),
        jumlahKg: Number(first.jumlahKg),
      });
      setSaving(false);
      if (!result.success) {
        toast({
          title: "Gagal menyimpan",
          description: result.error || "Periksa kembali isian.",
          variant: "destructive",
        });
        return;
      }
      toast({ title: "Berhasil", description: "Setoran diperbarui." });
      resetForm();
      await fetchRows();
      return;
    }

    const validItems = items
      .filter((item) => item.jenisSampahId && Number(item.jumlahKg) > 0)
      .map((item) => ({
        jenisSampahId: Number(item.jenisSampahId),
        jumlahKg: Number(item.jumlahKg),
      }));
    if (!namaPenyetor.trim() || validItems.length === 0) {
      toast({
        title: "Lengkapi isian",
        description:
          "Isi nama penyetor dan minimal satu jenis sampah dengan jumlah > 0.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    const result = await createSetoranMasyarakat({
      namaPenyetor: namaPenyetor.trim(),
      tanggalSetoran: new Date(`${tanggalSetoran}T12:00:00`),
      items: validItems,
    });
    setSaving(false);
    if (!result.success) {
      toast({
        title: "Gagal menyimpan",
        description: result.error || "Periksa kembali isian.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Berhasil",
      description:
        validItems.length > 1
          ? `${validItems.length} jenis sampah untuk ${namaPenyetor.trim()} ditambahkan.`
          : "Setoran masyarakat ditambahkan.",
    });
    // Nama & tanggal dipertahankan agar bisa langsung input jenis lain
    // untuk penyetor yang sama; item dikosongkan untuk penyetor baru.
    setNamaPenyetor("");
    setItems([newItem()]);
    await fetchRows();
  };

  const startEdit = (row: SetoranMasyarakat) => {
    setEditingId(row.id);
    setNamaPenyetor(row.namaPenyetor);
    setTanggalSetoran(toDateInput(row.tanggalSetoran));
    setItems([
      {
        key: ++itemKey,
        jenisSampahId: String(row.jenisSampahId),
        jumlahKg: String(row.jumlahKg),
      },
    ]);
  };

  const remove = async (id: number) => {
    if (!window.confirm("Hapus setoran masyarakat ini?")) return;
    const result = await deleteSetoranMasyarakat(id);
    if (!result.success) {
      toast({
        title: "Gagal menghapus",
        description: result.error,
        variant: "destructive",
      });
      return;
    }
    toast({ title: "Berhasil", description: "Setoran dihapus." });
    await fetchRows();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <Card className="print:hidden">
        <CardHeader>
          <CardTitle>
            {editingId ? "Edit Setoran Masyarakat" : "Input Setoran Masyarakat"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label>Nama penyetor</Label>
                <Input
                  value={namaPenyetor}
                  onChange={(e) => setNamaPenyetor(e.target.value)}
                  placeholder="Nama penyetor"
                  required
                />
              </div>
              <div>
                <Label>Tanggal setoran</Label>
                <Input
                  type="date"
                  value={tanggalSetoran}
                  onChange={(e) => setTanggalSetoran(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>
                Jenis sampah{" "}
                <span className="text-muted-foreground">
                  (satu penyetor bisa membawa beberapa jenis)
                </span>
              </Label>
              {items.map((item, index) => (
                <div key={item.key} className="flex items-end gap-2">
                  <div className="flex-1">
                    <Select
                      value={item.jenisSampahId}
                      onValueChange={(value) =>
                        setItem(item.key, { jenisSampahId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={`Jenis sampah ${index + 1}`}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {jenisSampah.map((jenis) => (
                          <SelectItem key={jenis.id} value={String(jenis.id)}>
                            {jenis.namaSampah} ({jenis.kategori})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-32">
                    <Input
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="Kg"
                      value={item.jumlahKg}
                      onChange={(e) =>
                        setItem(item.key, { jumlahKg: e.target.value })
                      }
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    title="Hapus baris"
                    onClick={() => removeItem(item.key)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {!editingId && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setItems((prev) => [...prev, newItem()])}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Tambah jenis sampah
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>
                <Plus className="mr-1 h-4 w-4" />
                {saving
                  ? "Menyimpan…"
                  : editingId
                    ? "Simpan"
                    : items.filter(
                          (item) =>
                            item.jenisSampahId && Number(item.jumlahKg) > 0,
                        ).length > 1
                      ? "Simpan Semua"
                      : "Tambah"}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="print:border-0 print:shadow-none print:p-0">
        <CardHeader className="flex flex-wrap items-center justify-between gap-3 print:hidden">
          <CardTitle>Daftar Setoran Masyarakat</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={String(month)}
              onValueChange={(value) => setMonth(Number(value))}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((name, index) => (
                  <SelectItem key={name} value={String(index + 1)}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={String(year)}
              onValueChange={(value) => setYear(Number(value))}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((item) => (
                  <SelectItem key={item} value={String(item)}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              onClick={handlePrint}
              className="print:hidden"
            >
              <Printer className="mr-2 h-4 w-4" />
              Cetak
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="hidden print:block mb-4">
            <h3 className="text-lg font-semibold">Daftar Setoran Masyarakat</h3>
            <p className="text-sm text-muted-foreground">
              Bulan {MONTHS[month - 1]} {year}
            </p>
          </div>
          <div className="hidden md:block overflow-x-auto rounded border print:block print:overflow-visible print:rounded-none print:border-0">
            <Table className="min-w-full print:min-w-0">
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Penyetor</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead className="text-right">Kg</TableHead>
                  <TableHead className="text-right">Nilai</TableHead>
                  <TableHead className="print:hidden">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-6 text-center">
                      Memuat…
                    </TableCell>
                  </TableRow>
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-6 text-center">
                      Belum ada setoran.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        {new Date(row.tanggalSetoran).toLocaleDateString(
                          "id-ID",
                        )}
                      </TableCell>
                      <TableCell>{row.namaPenyetor}</TableCell>
                      <TableCell>{row.jenisSampah}</TableCell>
                      <TableCell className="capitalize">
                        {row.kategori}
                      </TableCell>
                      <TableCell className="text-right">
                        {Number(row.jumlahKg).toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell className="text-right">
                        Rp{" "}
                        {(
                          Number(row.jumlahKg) * Number(row.hargaPerKg)
                        ).toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell className="print:hidden">
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => startEdit(row)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => remove(row.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="space-y-4 md:hidden print:hidden">
            {loading ? (
              <div className="rounded-lg border p-4 text-center">Memuat…</div>
            ) : rows.length === 0 ? (
              <div className="rounded-lg border p-4 text-center">
                Belum ada setoran.
              </div>
            ) : (
              rows.map((row) => (
                <Card key={row.id} className="border">
                  <CardContent className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">
                          {row.namaPenyetor}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(row.tanggalSetoran).toLocaleDateString(
                            "id-ID",
                          )}
                        </p>
                      </div>
                      <p className="text-sm font-semibold">
                        Rp{" "}
                        {(
                          Number(row.jumlahKg) * Number(row.hargaPerKg)
                        ).toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div className="grid gap-2 text-sm">
                      <div className="flex justify-between gap-2">
                        <span className="text-muted-foreground">Jenis</span>
                        <span>{row.jenisSampah}</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-muted-foreground">Kategori</span>
                        <span className="capitalize">{row.kategori}</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-muted-foreground">Kg</span>
                        <span>
                          {Number(row.jumlahKg).toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        size="sm"
                        variant="outline"
                        onClick={() => startEdit(row)}
                      >
                        Edit
                      </Button>
                      <Button
                        className="flex-1"
                        size="sm"
                        variant="destructive"
                        onClick={() => remove(row.id)}
                      >
                        Hapus
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
