'use client';

import { Mail, Phone, MapPin } from 'lucide-react';
import type { ReactNode } from 'react';

type ContactInfo = {
    address: string;
    phone: string;
    email: string;
    googleMapsUrl: string | null;
};

type ContactViewProps = {
    contactInfo: ContactInfo | null;
    faqSection: ReactNode;
};

export default function ContactView({ contactInfo, faqSection }: ContactViewProps) {
    return (
        <div className="container mx-auto px-4 py-12 md:py-24">
            <div className="text-center mb-16">
                <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">
                    Pertanyaan Umum (FAQ)
                </h1>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                    Temukan jawaban atas pertanyaan yang sering diajukan.
                </p>
                <div className="mt-8 max-w-3xl mx-auto">
                    {faqSection}
                </div>
            </div>

            <div className="mt-16 text-center">
                <h2 className="font-headline text-3xl font-bold text-primary md:text-4xl">
                    Hubungi Kami
                </h2>
                <p className="mx-auto mt-2 max-w-2xl text-lg text-muted-foreground">
                    Kami siap membantu. Hubungi kami jika ada pertanyaan atau
                    keperluan lainnya.
                </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-12 md:grid-cols-2">
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
