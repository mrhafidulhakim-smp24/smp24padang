'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import BackToTopButton from '@/components/ui/back-to-top-button';

export default function ConditionalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAdminPage = pathname.startsWith('/admin');
    const isLoginPage = pathname === '/login';
    const isContactPage = pathname === '/contact';

    return (
        <div className="flex min-h-screen flex-col">
            {!isAdminPage && !isLoginPage && <Header />}
            <main className="flex-grow">{children}</main>
            {!isAdminPage && !isLoginPage && <Footer showMap={!isContactPage} />}
            {!isAdminPage && !isLoginPage && <BackToTopButton />}
        </div>
    );
}
