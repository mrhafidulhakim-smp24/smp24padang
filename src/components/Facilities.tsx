'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BlurImage } from '@/components/blur-image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Facility = {
    id: string;
    name: string;
    imageUrl?: string;
    description?: string;
};

type Placeholder = {
    src: string;
    base64: string;
};

type Props = {
    facilities: Facility[];
    placeholders: Placeholder[];
};

export default function Facilities({ facilities, placeholders }: Props) {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const [index, setIndex] = useState(0);

    // batasi 10 item pertama untuk mobile
    const items = facilities.slice(0, 10);
    const total = items.length;

    const handlePan = (dir: 'left' | 'right') => {
        setIndex((prev) =>
            dir === 'right' ? (prev + 2) % total : (prev - 2 + total) % total,
        );
    };

    // auto scroll
    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 2) % total);
        }, 5000);
        return () => clearInterval(timer);
    }, [total]);

    return (
        <section className="py-16 md:py-24 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <h2 className="font-headline text-3xl font-bold text-primary md:text-4xl">
                        Fasilitas Sekolah
                    </h2>
                    <p className="mx-auto mt-2 max-w-2xl text-foreground">
                        Lingkungan belajar yang lengkap dan modern untuk
                        mendukung potensi siswa.
                    </p>
                </div>

                {/* DESKTOP grid */}
                <div className="mt-8 hidden md:grid md:grid-cols-4 sm:grid-cols-2 gap-4">
                    {facilities.map((facility) => {
                        const placeholder = placeholders.find(
                            (p) => p.src === facility.imageUrl,
                        );
                        const src =
                            facility.imageUrl ??
                            'https://placehold.co/600x400.png';
                        return (
                            <Link
                                key={facility.id}
                                href="/gallery"
                                className="group relative overflow-hidden rounded-lg shadow-sm"
                            >
                                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/50 to-transparent" />
                                {placeholder ? (
                                    <BlurImage
                                        src={src}
                                        alt={facility.name}
                                        width={600}
                                        height={400}
                                        placeholder={placeholder.base64}
                                        className="h-48 sm:h-56 md:h-40 lg:h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <Image
                                        src={src}
                                        alt={facility.name}
                                        width={600}
                                        height={400}
                                        loading="lazy"
                                        className="h-48 sm:h-56 md:h-40 lg:h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                )}
                                <div className="absolute inset-0 z-20 flex items-end p-4">
                                    <h3 className="font-headline text-sm sm:text-base md:text-sm lg:text-base font-bold text-white drop-shadow-lg">
                                        {facility.name}
                                    </h3>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* MOBILE carousel 2 kolom */}
                <div className="mt-6 md:hidden relative overflow-hidden">
                    <div
                        ref={scrollRef}
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{
                            transform: `translateX(-${(index / 2) * 100}%)`,
                            width: `${Math.ceil(total / 2) * 100}%`,
                        }}
                    >
                        {Array.from({ length: Math.ceil(total / 2) }).map(
                            (_, i) => {
                                const first = items[i * 2];
                                const second = items[i * 2 + 1];
                                return (
                                    <div
                                        key={i}
                                        className="flex w-full flex-shrink-0 gap-3 px-1"
                                    >
                                        {[first, second].map(
                                            (facility) =>
                                                facility && (
                                                    <div
                                                        key={facility.id}
                                                        className="flex-1 relative rounded-xl overflow-hidden"
                                                    >
                                                        {placeholders.find(
                                                            (p) =>
                                                                p.src ===
                                                                facility.imageUrl,
                                                        ) ? (
                                                            <BlurImage
                                                                src={
                                                                    facility.imageUrl ??
                                                                    'https://placehold.co/300x200.png'
                                                                }
                                                                alt={
                                                                    facility.name
                                                                }
                                                                width={400}
                                                                height={300}
                                                                placeholder={
                                                                    placeholders.find(
                                                                        (p) =>
                                                                            p.src ===
                                                                            facility.imageUrl,
                                                                    )?.base64 ||
                                                                    ''
                                                                }
                                                                className="h-48 w-full object-cover"
                                                            />
                                                        ) : (
                                                            <Image
                                                                src={
                                                                    facility.imageUrl ??
                                                                    'https://placehold.co/300x200.png'
                                                                }
                                                                alt={
                                                                    facility.name
                                                                }
                                                                width={400}
                                                                height={300}
                                                                className="h-48 w-full object-cover"
                                                            />
                                                        )}
                                                        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-2">
                                                            <h3 className="text-white font-semibold text-sm">
                                                                {facility.name}
                                                            </h3>
                                                        </div>
                                                    </div>
                                                ),
                                        )}
                                    </div>
                                );
                            },
                        )}
                    </div>

                    {/* tombol panah */}
                    <button
                        onClick={() => handlePan('left')}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-30 rounded-full bg-gray-200/90 p-2 shadow hover:bg-gray-300 transition"
                    >
                        <ChevronLeft className="h-5 w-5 text-gray-700" />
                    </button>
                    <button
                        onClick={() => handlePan('right')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-30 rounded-full bg-gray-200/90 p-2 shadow hover:bg-gray-300 transition"
                    >
                        <ChevronRight className="h-5 w-5 text-gray-700" />
                    </button>
                </div>

                {/* tombol lihat semua */}
                <div className="mt-6 text-center">
                    <Link
                        href="/gallery"
                        className="inline-block rounded-md border px-4 py-2 text-sm font-medium bg-white/90 backdrop-blur-sm hover:bg-white"
                    >
                        Lihat Semua Fasilitas
                    </Link>
                </div>
            </div>
        </section>
    );
}
