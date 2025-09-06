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

export const metadata: Metadata = {
    title: 'SMPN 24 Padang',
    description:
        'Situs resmi SMPN 24 Padang. Temukan informasi lengkap, berita terbaru, dan profil sekolah kami.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="id" className="!scroll-smooth" suppressHydrationWarning>
            <head>
                <meta name="google-site-verification" content="Vt6vpu5L1mLSG2YNct6fLIHbFueG3nhiF-dP4la96vE" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'WebSite',
                            name: 'SMPN 24 Padang',
                            url: 'https://www.smpn24padang.sch.id',
                            potentialAction: {
                                '@type': 'SearchAction',
                                target: {
                                    '@type': 'EntryPoint',
                                    urlTemplate:
                                        'https://www.smpn24padang.sch.id/search?q={search_term_string}',
                                },
                                'query-input':
                                    'required name=search_term_string',
                            },
                        }),
                    }}
                />
            </head>
            <body
                className={`${roboto.variable} ${montserrat.variable} font-body antialiased`}
            >
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
