'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Save } from 'lucide-react';
import { createGuru, updateGuru } from '../setoran-guru-actions';
import type { Guru } from './types';

interface GuruDialogProps {
  isOpen: boolean;
  onClose: () => void;
  guru: Guru | null;
  onSuccess: () => void;
}

export function GuruDialog({
  isOpen,
  onClose,
  guru,
  onSuccess,
}: GuruDialogProps) {
  const { toast } = useToast();
  const [namaGuru, setNamaGuru] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNamaGuru(guru?.namaGuru || '');
    } else {
      setNamaGuru('');
    }
  }, [isOpen, guru]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = namaGuru.trim();
    if (!trimmed || trimmed.length < 3) {
      toast({
        title: 'Validasi Gagal',
        description: 'Nama guru minimal 3 karakter.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    const res = guru
      ? await updateGuru(guru.id, { namaGuru: trimmed })
      : await createGuru({ namaGuru: trimmed });

    if (res.success) {
      toast({ title: 'Sukses', description: res.message });
      onSuccess();
      onClose();
    } else {
      toast({
        title: 'Gagal',
        description: res.message || 'Terjadi kesalahan.',
        variant: 'destructive',
      });
    }
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{guru ? 'Edit Guru' : 'Tambah Guru'}</DialogTitle>
          <DialogDescription>
            {guru ? 'Edit data nama guru.' : 'Tambah guru baru ke dalam sistem.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="namaGuru">Nama Guru</Label>
            <Input
              id="namaGuru"
              value={namaGuru}
              onChange={(e) => setNamaGuru(e.target.value)}
              placeholder="Contoh: Budi Santoso, S.Pd."
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : guru ? (
                <Save className="mr-2 h-4 w-4" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              {guru ? 'Simpan Perubahan' : 'Tambah Guru'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
