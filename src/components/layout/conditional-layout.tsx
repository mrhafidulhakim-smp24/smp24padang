'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import BackToTopButton from '@/components/ui/back-to-top-button';

type ContactInfo = {
    address: string;
    phone: string;
    email: string;
    googleMapsUrl: string | null;
};

export default function ConditionalLayout({
    children,
    contactInfo,
}: {
    children: React.ReactNode;
    contactInfo: ContactInfo | null;
}) {
    const pathname = usePathname();
    const isAdminPage = pathname.startsWith('/admin');
    const isLoginPage = pathname === '/login';
    const isContactPage = pathname === '/contact';

    return (
        <div className="flex min-h-screen flex-col">
            {!isAdminPage && !isLoginPage && <Header contactInfo={contactInfo} />}
            <main className="flex-grow">{children}</main>
            {!isAdminPage && !isLoginPage && <Footer showMap={!isContactPage} contactInfo={contactInfo} />}
            {!isAdminPage && !isLoginPage && <BackToTopButton />}
        </div>
    );
}
