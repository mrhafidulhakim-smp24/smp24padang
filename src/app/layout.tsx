import type { Metadata } from 'next';
import { Roboto, Montserrat } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import ConditionalLayout from '@/components/layout/conditional-layout';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import AOSInit from '@/components/aos-init';
import { SpeedInsights } from '@vercel/speed-insights/next';
import NextAuthSessionProvider from '@/components/session-provider';
import BackToTopButton from '@/components/ui/back-to-top-button';

const roboto = Roboto({
    subsets: ['latin'],
    weight: ['400', '700'],
    variable: '--font-roboto',
    display: 'swap',
});

const montserrat = Montserrat({
    subsets: ['latin'],
    weight: ['700', '800'],
    variable: '--font-montserrat',
    display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://smpn24padang.vercel.app';

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: 'SMPN 24 Padang',
        template: '%s | SMPN 24 Padang',
    },
    description:
        'Situs resmi SMPN 24 Padang. Temukan informasi lengkap tentang profil sekolah, berita terbaru, prestasi, galeri, dan kontak kami.',
    keywords: ['SMPN 24 Padang', 'Sekolah Menengah Pertama', 'Padang', 'Pendidikan'],
    authors: [{ name: 'SMPN 24 Padang', url: siteUrl }],
    creator: 'SMPN 24 Padang',
    openGraph: {
        type: 'website',
        locale: 'id_ID',
        url: siteUrl,
        title: 'SMPN 24 Padang',
        description:
            'Situs resmi SMPN 24 Padang. Temukan informasi lengkap tentang profil sekolah, berita terbaru, prestasi, galeri, dan kontak kami.',
        images: [
            {
                url: `${siteUrl}/logo.png`,
                width: 512,
                height: 512,
                alt: 'Logo SMPN 24 Padang',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'SMPN 24 Padang',
        description:
            'Situs resmi SMPN 24 Padang. Temukan informasi lengkap tentang profil sekolah, berita terbaru, prestasi, galeri, dan kontak kami.',
        images: [`${siteUrl}/logo.png`],
        creator: '@smpn24padang', // Ganti dengan handle Twitter jika ada
    },
    verification: {
        google: '8_L5etzjXCER5UwPiTRLuqTchwoHMb3zj_Bt6e6e0DE',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'EducationalOrganization',
        name: 'SMPN 24 Padang',
        url: siteUrl,
        logo: `${siteUrl}/logo.png`,
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+62-XXX-XXXX-XXXX', // Ganti dengan nomor telepon sekolah
            contactType: 'Customer Service',
        },
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Jalan Raya Padang', // Ganti dengan alamat sekolah
            addressLocality: 'Padang',
            addressRegion: 'Sumatera Barat',
            postalCode: '25000', // Ganti dengan kode pos
            addressCountry: 'ID',
        },
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${siteUrl}/search?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    };

    return (
        <html lang="id" className="!scroll-smooth" suppressHydrationWarning>
            <body
                className={`${roboto.variable} ${montserrat.variable} font-body antialiased`}
            >
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                <NextAuthSessionProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="light"
                        disableTransitionOnChange
                    >
                        <AOSInit />
                        <ConditionalLayout>{children}</ConditionalLayout>
                        <Toaster />
                        <BackToTopButton />
                        <SpeedInsights />
                    </ThemeProvider>
                </NextAuthSessionProvider>
            </body>
        </html>
    );
}