'use client';

import { useEffect, useRef } from 'react';
import { useFormState } from 'react-dom';
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
import { createGuru, updateGuru } from '../guru-actions';
import { SubmitButton } from './submit-button';
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
    const formRef = useRef<HTMLFormElement>(null);
    const [state, action] = useFormState(guru ? updateGuru.bind(null, guru.id) : createGuru, {
        message: null,
        errors: {},
        success: false,
    });

    useEffect(() => {
        if (state.message) {
            if (state.success) {
                toast({ title: 'Sukses', description: state.message });
                onSuccess();
                onClose();
            } else {
                toast({
                    title: 'Gagal',
                    description: state.message,
                    variant: 'destructive',
                });
            }
        }
    }, [state, toast, onSuccess, onClose]);

    useEffect(() => {
        if (!isOpen) {
            formRef.current?.reset();
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{guru ? 'Edit Guru' : 'Tambah Guru'}</DialogTitle>
                    <DialogDescription>
                        {guru ? 'Edit data guru.' : 'Tambah guru baru ke dalam sistem.'}
                    </DialogDescription>
                </DialogHeader>
                <form action={action} ref={formRef} className="space-y-4">
                    <div>
                        <Label htmlFor="namaGuru">Nama Guru</Label>
                        <Input
                            id="namaGuru"
                            name="namaGuru"
                            defaultValue={guru?.namaGuru || ''}
                            required
                        />
                        {state.errors?.namaGuru && (
                            <p className="text-sm text-destructive mt-1">
                                {state.errors.namaGuru[0]}
                            </p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Batal
                        </Button>
                        <SubmitButton>
                            {guru ? 'Simpan Perubahan' : 'Tambah Guru'}
                        </SubmitButton>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
