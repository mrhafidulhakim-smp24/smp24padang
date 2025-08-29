"use client";

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');
  const isContactPage = pathname === '/contact';

  return (
    <div className="flex min-h-screen flex-col">
      {!isAdminPage && <Header />}
      <main className="flex-grow">
        {children}
      </main>
      {!isAdminPage && <Footer showMap={!isContactPage} />}
    </div>
  );
}