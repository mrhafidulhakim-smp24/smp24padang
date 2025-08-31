'use client';

import { useState, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
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
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Kelola Informasi Kontak</CardTitle>
                    <CardDescription className="mt-2 text-lg">Memuat data...</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Kelola Informasi Kontak</CardTitle>
                    <CardDescription className="mt-2 text-lg">
                        Perbarui alamat, telepon, dan email yang ditampilkan di seluruh situs.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <div className="space-y-2">
                        <Label htmlFor="address" className="text-base flex items-center gap-2">
                            <MapPin className="h-4 w-4" /> Alamat
                        </Label>
                        <Input
                            id="address"
                            name="address"
                            value={contactInfo.address}
                            onChange={handleChange}
                            required
                            className="text-base"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-base flex items-center gap-2">
                            <Phone className="h-4 w-4" /> Nomor Telepon
                        </Label>
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={contactInfo.phone}
                            onChange={handleChange}
                            required
                            className="text-base"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-base flex items-center gap-2">
                            <Mail className="h-4 w-4" /> Alamat Email
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={contactInfo.email}
                            onChange={handleChange}
                            required
                            className="text-base"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="googleMapsUrl" className="text-base flex items-center gap-2">
                            <MapPin className="h-4 w-4" /> URL Google Maps
                        </Label>
                        <Input
                            id="googleMapsUrl"
                            name="googleMapsUrl"
                            value={contactInfo.googleMapsUrl || ''}
                            onChange={handleChange}
                            className="text-base"
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button type="submit" size="lg" disabled={isPending}>
                        {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}