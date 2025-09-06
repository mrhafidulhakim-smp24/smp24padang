'use client';

import React from 'react';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';

interface Banner {
    id: string;
    title: string;
    description: string;
    imageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
}

interface ClientCarouselProps {
    banners: Banner[];
}

export function ClientCarousel({ banners }: ClientCarouselProps) {
    return (
        <Carousel opts={{ loop: true }} plugins={[Autoplay({ delay: 2000 })]} className="w-full">
            <CarouselContent>
                {banners.map((banner, index) => (
                    <CarouselItem key={index}>
                        <div className="relative h-[40vh] w-full sm:h-[60vh] lg:h-[70vh]">
                            <div className="absolute inset-0 bg-black/50 z-10"></div>
                            <Image
                                src={
                                    banner.imageUrl ||
                                    'https://placehold.co/1920x1080.png'
                                }
                                alt={banner.title}
                                fill
                                style={{ objectFit: 'cover' }}
                                data-ai-hint="school students"
                                className="z-0"
                                priority={index === 0}
                            />
                            <div className="relative z-20 flex h-full flex-col items-center justify-center text-center text-white p-4">
                                <h1 className="font-headline text-4xl font-bold drop-shadow-md md:text-6xl">
                                    {banner.title}
                                </h1>
                                <p className="mt-4 max-w-2xl text-lg text-white/90 drop-shadow-sm">
                                    {banner.description}
                                </p>
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-30 hidden md:flex" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-30 hidden md:flex" />
        </Carousel>
    );
}
