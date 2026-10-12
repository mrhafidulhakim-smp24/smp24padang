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
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus } from "lucide-react";
import { createSetoranMasyarakat } from "../setoran-masyarakat-actions";
import type { JenisSampah } from "./types";

interface TambahPenyetorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  jenisSampah: JenisSampah[];
  onSuccess: () => void;
}

export function TambahPenyetorDialog({
  isOpen,
  onClose,
  jenisSampah,
  onSuccess,
}: TambahPenyetorDialogProps) {
  const { toast } = useToast();
  const [nama, setNama] = useState("");
  const [tanggal, setTanggal] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [jenisId, setJenisId] = useState("");
  const [jumlahKg, setJumlahKg] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setNama("");
    setJenisId("");
    setJumlahKg("");
    setTanggal(new Date().toISOString().slice(0, 10));
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedNama = nama.trim();
    const parsedJenis = parseInt(jenisId);
    const parsedJumlah = parseFloat(jumlahKg);

    if (!trimmedNama) {
      toast({
        title: "Validasi Gagal",
        description: "Nama penyetor harus diisi.",
        variant: "destructive",
      });
      return;
    }

    if (!parsedJenis || isNaN(parsedJumlah) || parsedJumlah <= 0) {
      toast({
        title: "Validasi Gagal",
        description: "Pilih jenis sampah dan masukkan jumlah yang valid.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const res = await createSetoranMasyarakat({
      namaPenyetor: trimmedNama,
      tanggalSetoran: new Date(tanggal),
      items: [{ jenisSampahId: parsedJenis, jumlahKg: parsedJumlah }],
    });

    if (res.success) {
      toast({
        title: "Sukses",
        description: "Setoran masyarakat berhasil ditambahkan.",
      });
      handleClose();
      onSuccess();
    } else {
      toast({
        title: "Gagal",
        description: res.error || "Gagal menyimpan setoran.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Penyetor Baru</DialogTitle>
          <DialogDescription>
            Tambahkan warga penyetor dan setoran sampah pertamanya.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nama-penyetor">Nama Penyetor</Label>
            <Input
              id="nama-penyetor"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              required
            />
          </div>

          <div>
            <Label htmlFor="tanggal-setoran">Tanggal Setoran</Label>
            <Input
              id="tanggal-setoran"
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Jenis Sampah</Label>
            <Select value={jenisId} onValueChange={setJenisId} required>
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis sampah" />
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

          <div>
            <Label htmlFor="jumlah-kg">Jumlah (Kg)</Label>
            <Input
              id="jumlah-kg"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="Contoh: 2.5"
              value={jumlahKg}
              onChange={(e) => setJumlahKg(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Tambah Penyetor
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
