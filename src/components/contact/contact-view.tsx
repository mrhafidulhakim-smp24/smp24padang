'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { getContactInfo } from '@/app/admin/contact/actions';

type ContactInfo = {
    address: string;
    phone: string;
    email: string;
    googleMapsUrl: string | null;
};

export default function ContactView() {
    const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchContactInfo() {
            const data = await getContactInfo();
            if (data) {
                setContactInfo(data);
            }
            setLoading(false);
        }
        fetchContactInfo();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 md:py-24">
                <div className="text-center">
                    <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">
                        Hubungi Kami
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                        Memuat data...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 md:py-24">
            <div className="text-center">
                <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">
                    Hubungi Kami
                </h1>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                    Kami siap membantu. Hubungi kami jika ada pertanyaan atau
                    keperluan lainnya.
                </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2">
                <div className="space-y-6">
                    <h2 className="font-headline text-2xl font-bold text-primary">
                        Informasi Kontak
                    </h2>
                    <div className="flex items-start gap-4">
                        <MapPin className="mt-1 h-6 w-6 text-accent" />
                        <div>
                            <h3 className="font-semibold">Alamat</h3>
                            <p className="text-muted-foreground">
                                {contactInfo?.address}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <Phone className="mt-1 h-6 w-6 text-accent" />
                        <div>
                            <h3 className="font-semibold">Telepon</h3>
                            <p className="text-muted-foreground">
                                {contactInfo?.phone}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <Mail className="mt-1 h-6 w-6 text-accent" />
                        <div>
                            <h3 className="font-semibold">Email</h3>
                            <p className="text-muted-foreground">
                                {contactInfo?.email}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg">
                    {contactInfo?.googleMapsUrl && (
                        <iframe
                            src={contactInfo.googleMapsUrl}
                            width="100%"
                            height="450"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Peta Lokasi Sekolah"
                        ></iframe>
                    )}
                </div>
            </div>
        </div>
    );
}
