
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import ConditionalLayout from '@/components/layout/conditional-layout';
import './globals.css';
import {ThemeProvider} from '@/components/theme-provider';

export const metadata: Metadata = {
  title: 'SMPN 24 Padang',
  description: 'Official Website of SMPN 24 Padang School',
};
 
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="id" className="!scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "SMPN 24 Padang",
            "url": "https://www.smpn24padang.sch.id",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://www.smpn24padang.sch.id/search?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          }) }}
        />
      </head>
      <body className="font-body antialiased">
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            disableTransitionOnChange
          >
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
            <Toaster />
          </ThemeProvider>
      </body>
    </html>
  );
}
