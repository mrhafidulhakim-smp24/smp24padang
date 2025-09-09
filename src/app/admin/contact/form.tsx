'use client';

import { useState, useTransition } from 'react';
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
import { updateContactInfo } from './actions';

type ContactInfo = {
    address: string;
    phone: string;
    email: string;
    googleMapsUrl: string | null;
};

interface ContactFormProps {
    initialData: ContactInfo | null;
}

export default function ContactForm({ initialData }: ContactFormProps) {
    const [contactInfo, setContactInfo] = useState<ContactInfo>(
        initialData || {
            address: '',
            phone: '',
            email: '',
            googleMapsUrl: null,
        }
    );
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

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

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                        Kelola Informasi Kontak
                    </CardTitle>
                    <CardDescription className="mt-2 text-lg">
                        Perbarui alamat, telepon, dan email yang ditampilkan di
                        seluruh situs.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <div className="space-y-2">
                        <Label
                            htmlFor="address"
                            className="text-base flex items-center gap-2"
                        >
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
                        <Label
                            htmlFor="phone"
                            className="text-base flex items-center gap-2"
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
                            className="text-base"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label
                            htmlFor="email"
                            className="text-base flex items-center gap-2"
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
                            className="text-base"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label
                            htmlFor="googleMapsUrl"
                            className="text-base flex items-center gap-2"
                        >
                            <MapPin className="h-4 w-4" /> URL Google Maps
                        </Label>
                        <Input
                            id="googleMapsUrl"
                            name="googleMapsUrl"
                            value={contactInfo.googleMapsUrl || ''}
                            onChange={handleChange}
                            className="text-base"
                        />
                        {contactInfo.googleMapsUrl && (
                            <div className="mt-4">
                                <Label className="text-base">Pratinjau Peta</Label>
                                <div className="aspect-video w-full overflow-hidden rounded-lg border mt-2">
                                    <iframe
                                        key={contactInfo.googleMapsUrl}
                                        src={contactInfo.googleMapsUrl}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen={true}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    ></iframe>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Pastikan URL yang dimasukkan adalah URL sematan Google Maps.
                                </p>
                            </div>
                        )}
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
