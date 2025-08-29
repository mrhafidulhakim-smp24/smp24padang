'use client';

import { useState, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin } from 'lucide-react';
import { getContactInfo, updateContactInfo } from './actions';

export default function ContactAdminPage() {
    const [contactInfo, setContactInfo] = useState<{
        address: string;
        phone: string;
        email: string;
        googleMapsUrl: string | null;
    }>({
        address: '',
        phone: '',
        email: '',
        googleMapsUrl: null,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    useEffect(() => {
        async function fetchContactInfo() {
            const data = await getContactInfo();
            if (data) {
                setContactInfo(data);
            }
            setIsLoading(false);
        }
        fetchContactInfo();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setContactInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            const result = await updateContactInfo(contactInfo);
            if (result.success) {
                toast({
                    title: 'Sukses!',
                    description: result.message,
                });
            } else {
                toast({
                    title: 'Gagal!',
                    description: result.message,
                    variant: 'destructive',
                });
            }
        });
    };

    if (isLoading) {
        return (
            <div className="flex flex-col gap-8">
                <h1 className="font-headline text-3xl font-bold text-primary md:text-4xl">
                    Kelola Informasi Kontak
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Memuat data...
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div>
                <h1 className="font-headline text-3xl font-bold text-primary md:text-4xl">
                    Kelola Informasi Kontak
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Perbarui alamat, telepon, dan email yang ditampilkan di
                    seluruh situs.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Detail Kontak</CardTitle>
                    <CardDescription>
                        Informasi ini akan muncul di header, footer, dan halaman
                        kontak.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label
                            htmlFor="address"
                            className="flex items-center gap-2"
                        >
                            <MapPin className="h-4 w-4" /> Alamat
                        </Label>
                        <Input
                            id="address"
                            name="address"
                            value={contactInfo.address}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label
                            htmlFor="phone"
                            className="flex items-center gap-2"
                        >
                            <Phone className="h-4 w-4" /> Nomor Telepon
                        </Label>
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={contactInfo.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label
                            htmlFor="email"
                            className="flex items-center gap-2"
                        >
                            <Mail className="h-4 w-4" /> Alamat Email
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={contactInfo.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label
                            htmlFor="googleMapsUrl"
                            className="flex items-center gap-2"
                        >
                            <MapPin className="h-4 w-4" /> URL Google Maps
                        </Label>
                        <Input
                            id="googleMapsUrl"
                            name="googleMapsUrl"
                            value={contactInfo.googleMapsUrl || ''}
                            onChange={handleChange}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button type="submit" size="lg" disabled={isPending}>
                    {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
                </Button>
            </div>
        </form>
    );
}
