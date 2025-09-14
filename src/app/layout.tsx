import type { Metadata, Viewport } from 'next';
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

const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://smpn24padang.sch.id';

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
};

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: 'SMPN 24 Padang',
        template: '%s | SMPN 24 Padang',
    },
    description:
        'Website resmi SMPN 24 Padang. Jelajahi profil, berita, prestasi, galeri, dan informasi lengkap seputar sekolah kami.',
    keywords: [
        'SMPN 24 Padang',
        'Sekolah Menengah Pertama',
        'Padang',
        'Pendidikan',
    ],
    authors: [{ name: 'SMPN 24 Padang', url: siteUrl }],
    creator: 'SMPN 24 Padang',
    icons: {
        icon: [
            { url: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
            { url: '/192.png', sizes: '192x192', type: 'image/png' },
            { url: '/512.png', sizes: '512x512', type: 'image/png' },
        ],
        shortcut: [`${siteUrl}/favicon.ico`],
        apple: [
            { url: '/apple-touch-icon.png', sizes: '180x180' },
            { url: '/167.png', sizes: '167x167' },
            { url: '/152.png', sizes: '152x152' },
        ],
    },
    manifest: `${siteUrl}/site.webmanifest`,
    openGraph: {
        type: 'website',
        locale: 'id_ID',
        url: siteUrl,
        siteName: 'SMP Negeri 24 Padang',
        title: 'SMPN 24 Padang',
        description:
            'Website resmi SMPN 24 Padang. Jelajahi profil, berita, prestasi, galeri, dan informasi lengkap seputar sekolah kami.',
        images: [
            {
                url: `${siteUrl}/1200.png`,
                width: 1200,
                height: 630,
                alt: 'Logo SMPN 24 Padang',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'SMPN 24 Padang',
        description:
            'Website resmi SMPN 24 Padang. Jelajahi profil, berita, prestasi, galeri, dan informasi lengkap seputar sekolah kami.',
        images: [`${siteUrl}/1200.png`],
        creator: '@smpn24padang', // Ganti dengan handle Twitter jika ada
    },
    verification: {
        google: ['IC4fbcspLvv_VgDWKukeriJmjSSYmUO246NoRlUXDAw'],
    },
};

import { getContactInfo } from '@/lib/data/contact';

export default async function RootLayout({
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

    const contactInfo = await getContactInfo();

    return (
        <html lang="id" className="!scroll-smooth" suppressHydrationWarning>
            <body
                className={`${roboto.variable} ${montserrat.variable} font-body antialiased overflow-x-hidden`}
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
                        <ConditionalLayout contactInfo={contactInfo}>
                            {children}
                        </ConditionalLayout>
                        <Toaster />
                        <BackToTopButton />
                        <SpeedInsights />
                    </ThemeProvider>
                </NextAuthSessionProvider>
            </body>
        </html>
    );
}
