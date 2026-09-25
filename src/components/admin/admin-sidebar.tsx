'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
    Archive,
    Award,
    ChevronRight,
    GalleryHorizontal,
    Home,
    Image as ImageIcon,
    LayoutDashboard,
    LogOut,
    Megaphone,
    MessageCircleQuestion,
    MessageSquareTextIcon,
    Network,
    Newspaper,
    Phone,
    Recycle,
    Shirt,
    Target,
    Trophy,
    UserCircle,
    Users,
    X,
    Youtube,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface SidebarMenuItem {
    href?: string;
    label: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    subItems?: SidebarMenuItem[];
}

interface AdminSidebarProps {
    collapsed: boolean;
    mobileOpen: boolean;
    onMobileClose: () => void;
}

// ─── Menu Items ──────────────────────────────────────────────────────────────

export const ADMIN_MENU_ITEMS: SidebarMenuItem[] = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/homepage',  label: 'Beranda',   icon: Home },
    {
        label: 'Profil', icon: UserCircle,
        subItems: [
            { href: '/admin/profile/principal',    label: 'Profil Sekolah',      icon: UserCircle },
            { href: '/admin/profile/vision-mission', label: 'Visi & Misi',       icon: Target },
            { href: '/admin/organization',         label: 'Struktur Organisasi', icon: Network },
            { href: '/admin/curriculum',           label: 'Kurikulum',           icon: Target },
            { href: '/admin/accreditation',        label: 'Akreditasi',          icon: Award },
            { href: '/admin/profile/uniform',      label: 'Seragam',             icon: Shirt },
        ],
    },
    { href: '/admin/staff', label: 'Guru & Staf', icon: Users },
    {
        label: 'Artikel', icon: Newspaper,
        subItems: [
            { href: '/admin/news',          label: 'Berita',      icon: Newspaper },
            { href: '/admin/announcements', label: 'Pengumuman',  icon: Megaphone },
            { href: '/admin/sispendik',     label: 'Sispendik',   icon: Recycle },
            { href: '/admin/banksampah',    label: 'Bank Sampah', icon: Archive },
        ],
    },
    { href: '/admin/achievements', label: 'Prestasi', icon: Trophy },
    {
        label: 'Galeri', icon: GalleryHorizontal,
        subItems: [
            { href: '/admin/gallery', label: 'Galeri Foto',  icon: ImageIcon },
            { href: '/admin/videos',  label: 'Galeri Video', icon: Youtube },
        ],
    },
    { href: '/admin/contact',  label: 'Kontak',   icon: Phone },
    { href: '/admin/faq',      label: 'FAQ',       icon: MessageCircleQuestion },
    { href: '/admin/comments', label: 'Komentar', icon: MessageSquareTextIcon },
];

// ─── NavItem ────────────────────────────────────────────────────────────────

function NavItem({
    item,
    collapsed,
    onMobileClose,
    index,
    isExpandedOpen,
    isFlyoutOpen,
    onToggle,
    onCloseFlyout,
}: {
    item: SidebarMenuItem;
    collapsed: boolean;
    onMobileClose: () => void;
    index: number;
    isExpandedOpen: boolean;
    isFlyoutOpen: boolean;
    onToggle: (index: number) => void;
    onCloseFlyout: () => void;
}) {
    const pathname = usePathname();

    // ── Simple link (no sub-items) ──
    if (!item.subItems) {
        const isActive = pathname === item.href;
        return (
            <Link
                href={item.href!}
                onClick={() => {
                    onCloseFlyout();
                    onMobileClose();
                }}
                title={item.label}
                className={cn('sidebar-nav-btn', isActive && 'active')}
            >
                <item.icon className="sidebar-nav-icon" />
                <span className="sidebar-nav-label">{item.label}</span>
            </Link>
        );
    }

    // ── Group item with children ──
    const isGroupActive = item.subItems.some((s) => pathname.startsWith(s.href!));

    return (
        <div className="relative">
            {/* Trigger button */}
            <button
                type="button"
                title={collapsed ? item.label : undefined}
                onClick={() => onToggle(index)}
                className={cn(
                    'sidebar-nav-btn',
                    isGroupActive && 'active',
                    collapsed && isFlyoutOpen && 'bg-white/20 text-white'
                )}
            >
                <item.icon className="sidebar-nav-icon" />
                <span className="sidebar-nav-label">{item.label}</span>
                <ChevronRight className={cn('sidebar-nav-chevron', isExpandedOpen && 'open')} />
            </button>

            {/* ── Accordion: expanded mode (pure CSS zero-runtime) ── */}
            <div className={cn('sidebar-accordion', isExpandedOpen && !collapsed && 'open')}>
                <div className="sidebar-accordion-inner">
                    <ul className="space-y-0.5 pt-0.5">
                        {item.subItems.map((sub) => {
                            const isSubActive = pathname === sub.href;
                            return (
                                <li key={sub.href}>
                                    <Link
                                        href={sub.href!}
                                        onClick={onMobileClose}
                                        className={cn('sidebar-sub-btn', isSubActive && 'active')}
                                    >
                                        {sub.icon && <sub.icon className="h-4 w-4 shrink-0 opacity-70" />}
                                        <span>{sub.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>

            {/* ── Flyout: collapsed mode (desktop popup) ── */}
            {collapsed && isFlyoutOpen && (
                <div className="sidebar-flyout" role="menu">
                    <div className="sidebar-flyout-header">
                        <item.icon className="h-4 w-4 shrink-0 opacity-90" />
                        <span className="sidebar-flyout-title">{item.label}</span>
                    </div>
                    <ul className="space-y-0.5">
                        {item.subItems.map((sub) => {
                            const isSubActive = pathname === sub.href;
                            return (
                                <li key={sub.href}>
                                    <Link
                                        href={sub.href!}
                                        onClick={() => {
                                            onCloseFlyout();
                                            onMobileClose();
                                        }}
                                        className={cn('sidebar-sub-btn', isSubActive && 'active')}
                                    >
                                        {sub.icon && <sub.icon className="h-4 w-4 shrink-0 opacity-70" />}
                                        <span>{sub.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}

// ─── AdminSidebar ────────────────────────────────────────────────────────────

export default function AdminSidebar({ collapsed, mobileOpen, onMobileClose }: AdminSidebarProps) {
    const { toast } = useToast();
    const pathname = usePathname();
    const sidebarRef = useRef<HTMLElement>(null);

    // Track open state for expandable accordion items in expanded mode
    const [expandedOpenStates, setExpandedOpenStates] = useState<boolean[]>(() =>
        ADMIN_MENU_ITEMS.map((item) =>
            item.subItems ? item.subItems.some((s) => pathname.startsWith(s.href!)) : false
        )
    );

    // Track which flyout is active when in collapsed desktop mode (only 1 can be open at a time)
    const [activeFlyoutIndex, setActiveFlyoutIndex] = useState<number | null>(null);

    // When collapsed changes or route changes, close any active flyout
    useEffect(() => {
        setActiveFlyoutIndex(null);
    }, [collapsed, pathname]);

    // Close flyout on outside click (only active when a flyout is open in collapsed mode)
    useEffect(() => {
        if (!collapsed || activeFlyoutIndex === null) return;

        const handleOutsideClick = (e: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
                setActiveFlyoutIndex(null);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [collapsed, activeFlyoutIndex]);

    const handleToggleGroup = (index: number) => {
        if (collapsed) {
            // In collapsed mode: toggle active flyout index
            setActiveFlyoutIndex((prev) => (prev === index ? null : index));
        } else {
            // In expanded mode: toggle accordion
            setExpandedOpenStates((prev) => {
                const next = [...prev];
                next[index] = !next[index];
                return next;
            });
        }
    };

    const handleLogout = useCallback(async () => {
        try {
            await signOut({ redirect: false });
            toast({ title: 'Sukses', description: 'Anda telah keluar.' });
            window.location.href = '/login';
        } catch {
            toast({ variant: 'destructive', title: 'Error', description: 'Gagal untuk keluar.' });
        }
    }, [toast]);

    return (
        <aside
            ref={sidebarRef}
            data-collapsed={collapsed ? 'true' : 'false'}
            data-mobile-open={mobileOpen ? 'true' : 'false'}
            className="admin-sidebar"
        >
            {/* ── Header ── */}
            <div className="sidebar-header">
                <div className="flex items-center gap-2 min-w-0">
                    <Image src="/logo.png" alt="Logo" width={32} height={32} className="rounded-sm shrink-0" />
                    <span className="sidebar-collapse-hide text-base font-semibold text-white truncate">Admin</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                    <Link
                        href="/admin/profile"
                        title="Profil Admin"
                        className="sidebar-collapse-hide lg:flex hidden items-center justify-center"
                    >
                        <UserCircle className="h-5 w-5 text-white/70 hover:text-white transition-colors" />
                    </Link>
                    <button
                        type="button"
                        aria-label="Tutup sidebar"
                        onClick={onMobileClose}
                        className="lg:hidden flex h-7 w-7 items-center justify-center rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* ── Nav ── */}
            <nav className="sidebar-content" aria-label="Admin navigation">
                <ul className="space-y-0.5">
                    {ADMIN_MENU_ITEMS.map((item, index) => (
                        <li key={item.href ?? item.label}>
                            <NavItem
                                item={item}
                                collapsed={collapsed}
                                onMobileClose={onMobileClose}
                                index={index}
                                isExpandedOpen={expandedOpenStates[index] ?? false}
                                isFlyoutOpen={activeFlyoutIndex === index}
                                onToggle={handleToggleGroup}
                                onCloseFlyout={() => setActiveFlyoutIndex(null)}
                            />
                        </li>
                    ))}
                </ul>
            </nav>

            {/* ── Footer ── */}
            <div className="sidebar-footer">
                {/* Icon-only — visible when collapsed */}
                <div className="sidebar-footer-icon">
                    <ThemeToggle className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10" />
                    <button
                        type="button"
                        onClick={handleLogout}
                        title="Keluar"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-red-300 hover:text-red-100 hover:bg-red-500/20 transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                    </button>
                </div>

                {/* Full footer — visible when expanded */}
                <div className="sidebar-footer-full">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-white/50">Tema</span>
                        <ThemeToggle className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10" />
                    </div>
                    <Button
                        variant="destructive"
                        className="w-full justify-start bg-red-500/80 hover:bg-red-500 text-white border-0 h-9"
                        onClick={handleLogout}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Keluar
                    </Button>
                    <Button variant="outline" asChild
                        className="w-full justify-start border-white/30 text-white hover:bg-white/10 hover:text-white bg-transparent h-9"
                    >
                        <Link href="/">Halaman Utama</Link>
                    </Button>
                </div>
            </div>
        </aside>
    );
}
