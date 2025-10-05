'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

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
                    <div className="flex flex-col space-y-2">
                        <Link
                            href="https://www.instagram.com/smp24padang?igsh=MWx5NWM1bXZtd2E1"
                            className="flex items-center gap-2 text-primary-foreground/80 transition-colors hover:text-white"
                        >
                            <Instagram className="h-6 w-6" />
                            <span>Instagram</span>
                        </Link>
                        <Link
                            href="https://youtube.com/@ssk_spendupat?si=O8iKzbAxsGsuedXm"
                            className="flex items-center gap-2 text-primary-foreground/80 transition-colors hover:text-white"
                        >
                            <Youtube className="h-6 w-6" />
                            <span>YouTube</span>
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
                        <div className="flex flex-col items-start mt-2 text-sm">
                            <Link
                                href="https://github.com/Informatics-2025/Website-SMPN24padang/blob/main/README.md"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
                            >
                                {/* Ikon GitHub */}
                                <svg
                                    className="w-4 h-4 text-gray-400 hover:text-white transition-colors duration-200"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M12 2C6.48 2 2 6.58 2 12.14c0 4.46 2.87 8.24 6.84 9.58.5.1.68-.22.68-.48v-1.68c-2.78.61-3.37-1.37-3.37-1.37-.45-1.17-1.1-1.48-1.1-1.48-.9-.63.07-.62.07-.62 1 .07 1.52 1.04 1.52 1.04.88 1.54 2.32 1.1 2.89.84.09-.66.35-1.1.63-1.35-2.22-.26-4.56-1.13-4.56-5 0-1.1.39-1.99 1.03-2.7-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.03A9.3 9.3 0 0112 6.8c.85 0 1.71.12 2.51.35 1.91-1.3 2.75-1.03 2.75-1.03.55 1.4.2 2.44.1 2.7.64.71 1.03 1.6 1.03 2.7 0 3.88-2.35 4.73-4.58 4.98.36.32.68.95.68 1.92v2.84c0 .26.18.58.68.48A10.14 10.14 0 0022 12.14C22 6.58 17.52 2 12 2z"
                                        clipRule="evenodd"
                                    />
                                </svg>

                                <span className="underline underline-offset-2 decoration-dotted hover:decoration-solid">
                                    Dikembangkan oleh Mahasiswa Magang Teknik
                                    Informatika UPI &quot;YPTK&quot; Padang
                                    (Aira, Aldi, Ikhwan, Habib, Rafi)
                                </span>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
            <div className="bg-primary py-4">
                <div className="container mx-auto flex items-center justify-center px-4 text-center text-sm text-primary-foreground/70">
                    <Link href="/login">
                        <p>
                            Copyright © {currentYear} SMP Negeri 24 Padang. All
                            Rights Reserved.
                        </p>
                    </Link>
                </div>
            </div>
        </footer>
    );
}
