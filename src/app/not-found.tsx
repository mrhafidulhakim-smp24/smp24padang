'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Home, AlertTriangle } from 'lucide-react';

// Komponen untuk animasi daun SVG
const Leaf = ({
    className,
    ...props
}: React.ComponentProps<typeof motion.svg>) => (
    <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
    >
        <path d="M11 20A7 7 0 0 1 4 13H2a9 9 0 0 0 18 0h-2a7 7 0 0 1-7 7zM12 4c-5.523 0-10 4.477-10 10h2c0-4.418 3.582-8 8-8s8 3.582 8 8h2c0-5.523-4.477-10-10-10z" />
        <path d="M12 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
    </motion.svg>
);

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-green-50 dark:bg-gray-900 p-4 text-center">
            {/* Kontainer utama dengan animasi stagger */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.2,
                        },
                    },
                }}
                className="relative w-full max-w-lg"
            >
                {/* Ilustrasi Daun Beranimasi */}
                <motion.div
                    className="absolute -top-20 -left-10 text-green-300 dark:text-green-700"
                    animate={{ rotate: [0, 5, 0], y: [0, -10, 0] }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                >
                    <Leaf style={{ width: 80, height: 80 }} />
                </motion.div>
                <motion.div
                    className="absolute -bottom-20 -right-10 text-green-300 dark:text-green-700"
                    animate={{ rotate: [0, -5, 0], y: [0, 10, 0] }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 0.5,
                    }}
                >
                    <Leaf style={{ width: 100, height: 100 }} />
                </motion.div>

                {/* Konten Teks */}
                <motion.div
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                    }}
                    className="relative rounded-lg bg-white/50 dark:bg-gray-800/50 p-8 shadow-xl backdrop-blur-sm"
                >
                    <motion.h1
                        className="text-6xl md:text-8xl font-bold text-green-600 dark:text-green-400"
                        variants={{
                            hidden: { opacity: 0, y: -30 },
                            visible: {
                                opacity: 1,
                                y: 0,
                                transition: { duration: 0.5 },
                            },
                        }}
                    >
                        404
                    </motion.h1>

                    <motion.h2
                        className="mt-4 text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-100"
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: {
                                opacity: 1,
                                y: 0,
                                transition: { duration: 0.5, delay: 0.2 },
                            },
                        }}
                    >
                        Halaman Tidak Ditemukan
                    </motion.h2>

                    <motion.p
                        className="mt-4 text-base text-gray-600 dark:text-gray-300"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { duration: 0.5, delay: 0.4 },
                            },
                        }}
                    >
                        Ups! Sepertinya Anda tersesat. Mari kita kembali ke
                        jalan yang benar dan terus merawat lingkungan kita.
                    </motion.p>

                    {/* Tombol Aksi */}
                    <motion.div
                        className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: {
                                opacity: 1,
                                y: 0,
                                transition: { duration: 0.5, delay: 0.6 },
                            },
                        }}
                    >
                        <Button
                            asChild
                            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white dark:bg-green-500 dark:hover:bg-green-600 transition-transform transform hover:scale-105 hover:shadow-lg"
                            aria-label="Kembali ke Beranda"
                        >
                            <Link href="/">
                                <Home className="mr-2 h-4 w-4" />
                                Kembali ke Beranda
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full sm:w-auto transition-transform transform hover:scale-105"
                            aria-label="Laporkan Masalah"
                            onClick={() =>
                                alert(
                                    'Fitur pelaporan masalah sedang dalam pengembangan.',
                                )
                            }
                        >
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            Laporkan Masalah
                        </Button>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
}
