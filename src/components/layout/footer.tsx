'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    Mail,
    Phone,
    MapPin,
} from 'lucide-react';
import { getContactInfo } from '@/lib/data/contact';

type ContactInfo = {
    address: string;
    phone: string;
    email: string;
    googleMapsUrl: string | null;
};

type FooterProps = {
    showMap?: boolean;
    contactInfo: ContactInfo | null;
};

export default function Footer({ showMap = true, contactInfo }: FooterProps) {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-primary/90 text-primary-foreground">
            <div className="container mx-auto grid grid-cols-1 gap-6 px-2 py-12 md:grid-cols-4">
                <div className="space-y-4 md:col-span-1">
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/logo.png"
                            alt="SMP Negeri 24 Padang Logo"
                            width={40}
                            height={40}
                            className="h-8 w-auto"
                        />
                        <span className="font-headline text-xl font-bold text-white">
                            SMP Negeri 24 Padang
                        </span>
                    </Link>
                    <p className="text-primary-foreground/80">
                        Membina Pikiran, Membentuk Masa Depan. Jelajahi dunia
                        pembelajaran dan penemuan kami.
                    </p>
                </div>

                <div className="space-y-4 md:col-span-1">
                    <h3 className="font-headline text-lg font-semibold text-white">
                        Hubungi Kami
                    </h3>
                    <ul className="space-y-2 text-primary-foreground/80">
                        <li className="flex items-start gap-3">
                            <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-accent" />
                            <span className="flex-grow">
                                {contactInfo?.address}
                            </span>
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
                    <div className="flex space-x-4">
                        <Link
                            href="https://www.instagram.com/smp24padang?igsh=MWx5NWM1bXZtd2E1"
                            className="text-primary-foreground/80 transition-colors hover:text-white"
                        >
                            <Instagram className="h-6 w-6" />
                        </Link>
                        <Link
                            href="https://youtube.com/@ssk_spendupat?si=O8iKzbAxsGsuedXm"
                            className="text-primary-foreground/80 transition-colors hover:text-white"
                        >
                            <Youtube className="h-6 w-6" />
                        </Link>
                    </div>
                </div>

                {showMap && contactInfo?.googleMapsUrl && (
                    <div className="overflow-hidden rounded-lg md:col-span-2">
                        <iframe
                            src={contactInfo.googleMapsUrl}
                            width="100%"
                            height="300"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Peta Lokasi Sekolah"
                        ></iframe>
                        <div className="flex flex-col items-start text-sm text-primary-foreground/70 mt-2">
                            <Link
                                href="https://github.com/Informatics-2025"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white text-xs font-light text-left"
                            >
                                Dikembangkan oleh Mahasiswa Kerja Praktek Teknik
                                Informatika UPI &quot;YPTK&quot; Padang (2025)
                            </Link>
                        </div>
                    </div>
                )}
            </div>
            <div className="bg-primary py-4">
                <div className="container mx-auto flex items-center justify-center px-4 text-center text-sm text-primary-foreground/70">
                    <Link
                        href="/login"
                        className="transition-colors hover:text-white"
                    >
                        <p>© {currentYear} SMP Negeri 24 Padang.</p>
                    </Link>
                </div>
            </div>
        </footer>
    );
}
