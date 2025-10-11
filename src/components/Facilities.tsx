'use client';

import React, {
    useEffect,
    useRef,
    useState,
    useCallback,
    ReactNode,
} from 'react';
import Link from 'next/link';

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

// Skeleton Loading Component
function SkeletonLoader(): ReactNode {
    return (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 animate-pulse" />
    );
}

// Image Card Component with Optimized Loading - Mobile
interface FacilityCardProps {
    facility: Facility;
    placeholder?: Placeholder;
}

function FacilityCard({ facility, placeholder }: FacilityCardProps): ReactNode {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const imgRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const src: string = facility.imageUrl ?? 'https://placehold.co/300x200.png';

    // Use Intersection Observer for lazy loading
    useEffect((): (() => void) => {
        if (!containerRef.current) return () => {};

        const observer = new IntersectionObserver(
            (entries: IntersectionObserverEntry[]): void => {
                entries.forEach((entry: IntersectionObserverEntry): void => {
                    if (
                        entry.isIntersecting &&
                        imgRef.current &&
                        !imgRef.current.src
                    ) {
                        imgRef.current.src = src;
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                rootMargin: '50px',
                threshold: 0.01,
            },
        );

        observer.observe(containerRef.current);

        return (): void => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, [src]);

    const handleImageLoad = useCallback((): void => {
        setIsLoading(false);
        setError(false);
        if (imgRef.current) {
            imgRef.current.style.opacity = '1';
        }
    }, []);

    const handleImageError = useCallback((): void => {
        setIsLoading(false);
        setError(true);
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative overflow-hidden rounded-lg h-40 bg-slate-100 dark:bg-slate-800"
        >
            <Link href="/gallery" className="absolute inset-0 block">
                {/* Loading Skeleton */}
                {isLoading && <SkeletonLoader />}

                {/* Blur Placeholder */}
                {placeholder && isLoading && (
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url('${placeholder.base64}')`,
                            filter: 'blur(10px)',
                        }}
                    />
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Actual Image - Optimized */}
                {!error && (
                    <img
                        ref={imgRef}
                        alt={facility.name}
                        width={300}
                        height={200}
                        className="w-full h-full object-cover transition-all duration-300 ease-out opacity-0 active:scale-105"
                        loading="lazy"
                        decoding="async"
                        srcSet={`${src}?w=300 300w, ${src}?w=400 400w`}
                        sizes="(max-width: 640px) 300px, 400px"
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                    />
                )}

                {error && (
                    <div className="w-full h-full flex items-center justify-center bg-slate-300 dark:bg-slate-700">
                        <span className="text-sm text-slate-600 dark:text-slate-300">
                            Gagal memuat
                        </span>
                    </div>
                )}

                {/* Text Content */}
                <div className="absolute inset-0 z-20 flex items-end p-2 pointer-events-none">
                    <h3 className="font-headline text-sm font-bold text-white drop-shadow-lg line-clamp-2">
                        {facility.name}
                    </h3>
                </div>
            </Link>
        </div>
    );
}

// Desktop Card Component
function FacilityCardDesktop({
    facility,
    placeholder,
}: FacilityCardProps): ReactNode {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const imgRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const src: string = facility.imageUrl ?? 'https://placehold.co/600x400.png';

    useEffect((): (() => void) => {
        if (!containerRef.current) return () => {};

        const observer = new IntersectionObserver(
            (entries: IntersectionObserverEntry[]): void => {
                entries.forEach((entry: IntersectionObserverEntry): void => {
                    if (
                        entry.isIntersecting &&
                        imgRef.current &&
                        !imgRef.current.src
                    ) {
                        imgRef.current.src = src;
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                rootMargin: '100px',
                threshold: 0.01,
            },
        );

        observer.observe(containerRef.current);

        return (): void => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, [src]);

    const handleImageLoad = useCallback((): void => {
        setIsLoading(false);
        setError(false);
        if (imgRef.current) {
            imgRef.current.style.opacity = '1';
        }
    }, []);

    const handleImageError = useCallback((): void => {
        setIsLoading(false);
        setError(true);
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative overflow-hidden rounded-lg shadow-sm bg-slate-100 dark:bg-slate-800"
        >
            <Link
                href="/gallery"
                className="group relative overflow-hidden rounded-lg block"
            >
                {/* Loading Skeleton */}
                {isLoading && (
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 animate-pulse z-0" />
                )}

                {/* Blur Placeholder */}
                {placeholder && isLoading && (
                    <div
                        className="absolute inset-0 bg-cover bg-center z-0"
                        style={{
                            backgroundImage: `url('${placeholder.base64}')`,
                            filter: 'blur(20px)',
                        }}
                    />
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/50 to-transparent" />

                {/* Actual Image */}
                {!error && (
                    <img
                        ref={imgRef}
                        alt={facility.name}
                        width={600}
                        height={400}
                        className="h-48 sm:h-56 md:h-40 lg:h-48 w-full object-cover transition-all duration-300 ease-out opacity-0 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                        srcSet={`${src}?w=600 600w, ${src}?w=800 800w, ${src}?w=1000 1000w`}
                        sizes="(max-width: 768px) 600px, (max-width: 1024px) 800px, 1000px"
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                    />
                )}

                {error && (
                    <div className="h-48 sm:h-56 md:h-40 lg:h-48 w-full flex items-center justify-center bg-slate-300 dark:bg-slate-700">
                        <span className="text-sm text-slate-600 dark:text-slate-300">
                            Gagal memuat
                        </span>
                    </div>
                )}

                {/* Text Content */}
                <div className="absolute inset-0 z-20 flex items-end p-4 pointer-events-none">
                    <h3 className="font-headline text-sm sm:text-base md:text-sm lg:text-base font-bold text-white drop-shadow-lg">
                        {facility.name}
                    </h3>
                </div>
            </Link>
        </div>
    );
}

export default function Facilities({
    facilities,
    placeholders,
}: Props): ReactNode {
    const containerRef = useRef<HTMLDivElement>(null);

    // Reduce layout thrashing with requestAnimationFrame
    useEffect((): (() => void) => {
        const container = containerRef.current;
        if (!container) return () => {};

        let isScrolling: boolean = false;
        let scrollTimeout: ReturnType<typeof setTimeout>;

        const handleScroll = (): void => {
            if (!isScrolling) {
                isScrolling = true;
                container.style.willChange = 'scroll-position';
            }

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout((): void => {
                isScrolling = false;
                container.style.willChange = 'auto';
            }, 150);
        };

        container.addEventListener('scroll', handleScroll, { passive: true });

        return (): void => {
            container.removeEventListener('scroll', handleScroll);
            clearTimeout(scrollTimeout);
        };
    }, []);

    // Limit items for mobile
    const items: Facility[] = facilities.slice(0, 10);

    return (
        <section className="py-16 md:py-24 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h2 className="font-headline text-3xl font-bold text-primary md:text-4xl">
                        Fasilitas Sekolah
                    </h2>
                    <p className="mx-auto mt-2 max-w-2xl text-foreground">
                        Lingkungan belajar yang lengkap dan modern untuk
                        mendukung potensi siswa.
                    </p>
                </div>

                {/* DESKTOP grid */}
                <div className="hidden md:grid md:grid-cols-4 sm:grid-cols-2 gap-4 mt-8">
                    {facilities.map((facility: Facility): ReactNode => {
                        const placeholder: Placeholder | undefined =
                            placeholders.find(
                                (p: Placeholder): boolean =>
                                    p.src === facility.imageUrl,
                            );
                        return (
                            <FacilityCardDesktop
                                key={facility.id}
                                facility={facility}
                                placeholder={placeholder}
                            />
                        );
                    })}
                </div>

                {/* MOBILE grid 2 kolom */}
                <div className="md:hidden mt-6">
                    <div
                        ref={containerRef}
                        className="grid grid-cols-2 gap-3"
                        style={{
                            contain: 'layout style paint',
                        }}
                    >
                        {items.map((facility: Facility): ReactNode => {
                            const placeholder: Placeholder | undefined =
                                placeholders.find(
                                    (p: Placeholder): boolean =>
                                        p.src === facility.imageUrl,
                                );
                            return (
                                <FacilityCard
                                    key={facility.id}
                                    facility={facility}
                                    placeholder={placeholder}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* View All Button */}
                <div className="mt-8 text-center">
                    <Link
                        href="/gallery"
                        className="inline-block rounded-md border px-4 py-2 text-sm font-medium bg-white/90 backdrop-blur-sm hover:bg-white transition-colors"
                    >
                        Lihat Semua Fasilitas
                    </Link>
                </div>
            </div>
        </section>
    );
}
