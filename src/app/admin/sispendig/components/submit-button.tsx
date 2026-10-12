'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';

export function SubmitButton({
    pendingText = 'Menyimpan...',
    children = 'Simpan',
}: {
    pendingText?: string;
    children?: React.ReactNode;
}) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? pendingText : children}
        </Button>
    );
}
