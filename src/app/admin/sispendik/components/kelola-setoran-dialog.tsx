"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Loader2, Pencil, Plus, Save, Trash2 } from "lucide-react";
import { ConfirmDeleteDialog } from "./confirm-delete-dialog";
import type { JenisSampah } from "./types";

export interface SetoranDetailItem {
  id: number;
  jenisSampahId: number;
  jenisSampah: string;
  jumlahKg: string | number;
  hargaPerKg?: string | number | null;
  tanggal: Date | string;
}

interface KelolaSetoranDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  jenisSampah: JenisSampah[];
  entries: SetoranDetailItem[];
  loadingEntries: boolean;
  onAddEntry: (jenisSampahId: number, jumlahKg: number) => Promise<boolean>;
  onUpdateEntry: (
    id: number,
    jenisSampahId: number,
    jumlahKg: number,
  ) => Promise<boolean>;
  onDeleteEntry: (id: number) => Promise<boolean>;
}

export function KelolaSetoranDialog({
  isOpen,
  onClose,
  title,
  subtitle,
  jenisSampah,
  entries,
  loadingEntries,
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry,
}: KelolaSetoranDialogProps) {
  const { toast } = useToast();

  // State untuk form penambahan entry baru di atas tabel
  const [newJenisId, setNewJenisId] = useState("");
  const [newJumlahKg, setNewJumlahKg] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // State untuk inline edit
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editJenisId, setEditJenisId] = useState<number | null>(null);
  const [editJumlahKg, setEditJumlahKg] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  // State untuk konfirmasi hapus entry
  const [deletingEntryId, setDeletingEntryId] = useState<number | null>(null);

  const resetForm = () => {
    setNewJenisId("");
    setNewJumlahKg("");
    setEditingId(null);
    setDeletingEntryId(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const jenisId = parseInt(newJenisId);
    const jumlah = parseFloat(newJumlahKg);

    if (!jenisId || isNaN(jumlah) || jumlah <= 0) {
      toast({
        title: "Validasi Gagal",
        description: "Pilih jenis sampah dan masukkan jumlah yang valid.",
        variant: "destructive",
      });
      return;
    }

    setIsAdding(true);
    const success = await onAddEntry(jenisId, jumlah);
    if (success) {
      setNewJenisId("");
      setNewJumlahKg("");
    }
    setIsAdding(false);
  };

  const startEdit = (item: SetoranDetailItem) => {
    setEditingId(item.id);
    setEditJenisId(item.jenisSampahId);
    setEditJumlahKg(String(item.jumlahKg));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditJenisId(null);
    setEditJumlahKg("");
  };

  const handleSaveEdit = async (id: number) => {
    if (!editJenisId) return;
    const jumlah = parseFloat(editJumlahKg);
    if (isNaN(jumlah) || jumlah <= 0) {
      toast({
        title: "Validasi Gagal",
        description: "Jumlah (kg) harus lebih dari 0.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    const success = await onUpdateEntry(id, editJenisId, jumlah);
    if (success) {
      cancelEdit();
    }
    setIsSaving(false);
  };

  const handleConfirmDelete = async () => {
    if (!deletingEntryId) return;
    await onDeleteEntry(deletingEntryId);
    setDeletingEntryId(null);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{subtitle}</DialogDescription>
          </DialogHeader>

          {/* Form Tambah Setoran Baru */}
          <form
            onSubmit={handleAddSubmit}
            className="grid grid-cols-1 sm:grid-cols-5 gap-2 border-b pb-4"
          >
            <div className="sm:col-span-2">
              <Label>Jenis Sampah</Label>
              <Select
                value={newJenisId}
                onValueChange={setNewJenisId}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis" />
                </SelectTrigger>
                <SelectContent>
                  {jenisSampah.map((j) => (
                    <SelectItem key={j.id} value={String(j.id)}>
                      {j.namaSampah}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Label>Jumlah (Kg)</Label>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="Kg"
                value={newJumlahKg}
                onChange={(e) => setNewJumlahKg(e.target.value)}
                required
              />
            </div>
            <div className="sm:col-span-1 flex items-end">
              <Button type="submit" disabled={isAdding} className="w-full">
                {isAdding ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                ) : (
                  <Plus className="h-4 w-4 mr-1" />
                )}
                Tambah
              </Button>
            </div>
          </form>

          {/* Tabel Riwayat Entri */}
          <div className="overflow-x-auto rounded border mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Jumlah (Kg)</TableHead>
                  <TableHead>Total (Rp)</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="w-[120px]">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingEntries ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : entries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      Belum ada setoran
                    </TableCell>
                  </TableRow>
                ) : (
                  entries.map((item) => {
                    const isEditing = editingId === item.id;
                    const totalRp =
                      Number(item.jumlahKg) * Number(item.hargaPerKg || 0);

                    return (
                      <TableRow key={item.id}>
                        {isEditing ? (
                          <>
                            <TableCell>
                              <Select
                                value={editJenisId?.toString()}
                                onValueChange={(v) =>
                                  setEditJenisId(parseInt(v))
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {jenisSampah.map((j) => (
                                    <SelectItem
                                      key={j.id}
                                      value={String(j.id)}
                                    >
                                      {j.namaSampah}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={editJumlahKg}
                                onChange={(e) =>
                                  setEditJumlahKg(e.target.value)
                                }
                              />
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell>{item.jenisSampah}</TableCell>
                            <TableCell>
                              {Number(item.jumlahKg).toLocaleString("id-ID")}
                            </TableCell>
                          </>
                        )}
                        <TableCell>
                          Rp {Number(totalRp).toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell>
                          {new Date(item.tanggal).toLocaleDateString("id-ID")}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {isEditing ? (
                              <>
                                <Button
                                  size="icon"
                                  disabled={isSaving}
                                  onClick={() => handleSaveEdit(item.id)}
                                >
                                  {isSaving ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Save className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  onClick={cancelEdit}
                                >
                                  Batal
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  title="Edit"
                                  onClick={() => startEdit(item)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="destructive"
                                  title="Hapus"
                                  onClick={() => setDeletingEntryId(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Konfirmasi Hapus Entry */}
      <ConfirmDeleteDialog
        isOpen={!!deletingEntryId}
        onClose={() => setDeletingEntryId(null)}
        onConfirm={handleConfirmDelete}
        description="Tindakan ini akan menghapus data setoran ini secara permanen."
      />
    </>
  );
}
