'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
    Facebook,
    Twitter,
    Instagram,
    Mail,
    Phone,
    MapPin,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { getContactInfo } from '@/app/admin/contact/actions';

type ContactInfo = {
    address: string;
    phone: string;
    email: string;
    googleMapsUrl: string | null;
};

type FooterProps = {
    showMap?: boolean;
};

export default function Footer({ showMap = true }: FooterProps) {
    const currentYear = new Date().getFullYear();
    const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);

    useEffect(() => {
        async function fetchContactInfo() {
            const data = await getContactInfo();
            if (data) {
                setContactInfo(data);
            }
        }
        fetchContactInfo();
    }, []);

    return (
        <footer className="bg-primary/90 text-primary-foreground">
            <div className="container mx-auto grid grid-cols-1 gap-12 px-4 py-12 md:grid-cols-3">
                <div className="space-y-4">
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/logo.png"
                            alt="SMPN 24 Padang Logo"
                            width={40}
                            height={40}
                            className="h-8 w-auto"
                        />
                        <span className="font-headline text-xl font-bold text-white">
                            SMPN 24 Padang
                        </span>
                    </Link>
                    <p className="text-primary-foreground/80">
                        Membina Pikiran, Membentuk Masa Depan. Jelajahi dunia
                        pembelajaran dan penemuan kami.
                    </p>
                    <div className="flex space-x-4">
                        <Link
                            href="#"
                            className="text-primary-foreground/80 transition-colors hover:text-white"
                        >
                            <Facebook className="h-6 w-6" />
                        </Link>
                        <Link
                            href="#"
                            className="text-primary-foreground/80 transition-colors hover:text-white"
                        >
                            <Twitter className="h-6 w-6" />
                        </Link>
                        <Link
                            href="#"
                            className="text-primary-foreground/80 transition-colors hover:text-white"
                        >
                            <Instagram className="h-6 w-6" />
                        </Link>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-headline text-lg font-semibold text-white">
                        Hubungi Kami
                    </h3>
                    <ul className="space-y-2 text-primary-foreground/80">
                        <li className="flex items-start gap-3">
                            <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-accent" />
                            <span>{contactInfo?.address}</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Phone className="h-5 w-5 flex-shrink-0 text-accent" />
                            <span>{contactInfo?.phone}</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Mail className="h-5 w-5 flex-shrink-0 text-accent" />
                            <span>{contactInfo?.email}</span>
                        </li>
                    </ul>
                </div>

                {showMap && contactInfo?.googleMapsUrl && (
                    <div className="overflow-hidden rounded-lg">
                        <iframe
                            src={contactInfo.googleMapsUrl}
                            width="100%"
                            height="200"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Peta Lokasi Sekolah"
                        ></iframe>
                    </div>
                )}
            </div>
            <div className="bg-primary py-4">
                <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-center text-sm text-primary-foreground/70 sm:flex-row">
                    <div className="flex flex-col items-center sm:items-start">
                        <p>© {currentYear} SMPN 24 Padang.</p>
                    </div>
                    <Link
                        href="/admin"
                        className="transition-colors hover:text-white"
                    >
                        Login Admin
                    </Link>
                </div>
            </div>
        </footer>
    );
}
