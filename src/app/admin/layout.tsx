'use client';

import AdminHeader from '@/components/admin-header';
import AdminSidebar, { ADMIN_MENU_ITEMS } from '@/components/admin/admin-sidebar';
import { AdaptiveBreadcrumb } from '@/components/ui/adaptive-breadcrumb';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

// ─── Breadcrumb label map ────────────────────────────────────────────────────

const BREADCRUMB_LABELS: Record<string, string> = {
    admin: 'Admin',
    dashboard: 'Dashboard',
    homepage: 'Beranda',
    profile: 'Profil',
    principal: 'Profil Sekolah',
    'vision-mission': 'Visi & Misi',
    organization: 'Struktur Organisasi',
    curriculum: 'Kurikulum',
    accreditation: 'Akreditasi',
    faculty: 'Guru & Tenaga Kependidikan',
    'past-principals': 'Kepala Sekolah Terdahulu',
    uniform: 'Aturan Seragam',
    achievements: 'Prestasi',
    news: 'Berita & Pengumuman',
    announcements: 'Pengumuman',
    articles: 'Artikel',
    gallery: 'Galeri',
    sispendik: 'Sispendik',
    'master-data': 'Master Data',
    faq: 'FAQ',
    contact: 'Pesan & Kontak',
    videos: 'Video Kegiatan',
    users: 'Manajemen Pengguna',
    comments: 'Komentar',
    banksampah: 'Bank Sampah',
    staff: 'Tenaga Kependidikan',
};

// ─── Layout ──────────────────────────────────────────────────────────────────

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Desktop: sidebar collapsed to icon-only
    const [collapsed, setCollapsed] = useState(false);
    // Mobile/tablet: drawer open
    const [mobileOpen, setMobileOpen] = useState(false);

    // Close drawer on route change
    useEffect(() => { setMobileOpen(false); }, [pathname]);

    // Close drawer on Escape / desktop resize
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false); };
        const onResize = () => { if (window.innerWidth >= 1024) setMobileOpen(false); };
        window.addEventListener('keydown', onKey);
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('keydown', onKey);
            window.removeEventListener('resize', onResize);
        };
    }, []);

    return (
        <div className="flex min-h-screen bg-background">
            {/* Mobile/tablet backdrop overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <div className="print:hidden relative z-40">
                <AdminSidebar
                    collapsed={collapsed}
                    mobileOpen={mobileOpen}
                    onMobileClose={() => setMobileOpen(false)}
                />
            </div>

            {/* Main content — grows to fill remaining width */}
            <div className="flex min-w-0 flex-1 flex-col">
                <AdminHeader
                    isSidebarOpen={!collapsed}
                    setIsSidebarOpen={(v) => setCollapsed(!v)}
                    isMobileOpen={mobileOpen}
                    setIsMobileOpen={setMobileOpen}
                    menuItems={ADMIN_MENU_ITEMS}
                    pathname={pathname}
                />
                <main className="flex-1 p-3 sm:p-5 md:p-6 lg:p-8 w-full min-w-0">
                    <div className="w-full min-w-0 max-w-screen-2xl mx-auto space-y-6">
                        <AdaptiveBreadcrumb
                            labels={BREADCRUMB_LABELS}
                            hideOnHome={false}
                            className="mb-3 sm:mb-4"
                        />
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
