'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    SidebarProvider,
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarTrigger,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import Image from 'next/image';
import {
    LayoutDashboard,
    Newspaper,
    Trophy,
    Landmark,
    Image as ImageIcon,
    ChevronDown,
    GraduationCap,
    Users,
    GalleryHorizontal,
    FileBadge,
    Network,
    Home,
    Phone,
    UserCircle,
    Target,
    Swords,
    Shirt,
    Settings,
    Award,
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import * as Collapsible from '@radix-ui/react-collapsible';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const menuItems = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/homepage', label: 'Beranda', icon: Home },
        {
            label: 'Profil',
            icon: UserCircle,
            subItems: [
                {
                    href: '/admin/profile/principal',
                    label: 'Profil Sekolah',
                    icon: UserCircle,
                },
                {
                    href: '/admin/profile/vision-mission',
                    label: 'Visi & Misi',
                    icon: Target,
                },
                {
                    href: '/admin/organization',
                    label: 'Struktur Organisasi',
                    icon: Network,
                },
                {
                    href: '/admin/accreditation',
                    label: 'Sertifikasi & Penghargaan',
                    icon: Award,
                },
                {
                    href: '/admin/profile/uniform',
                    label: 'Seragam',
                    icon: Shirt,
                },
                {
                    href: '/admin/profile/extracurricular',
                    label: 'Ekskul',
                    icon: Swords,
                },
            ],
        },
        { href: '/admin/staff', label: 'Guru & Staf', icon: Users },
        { href: '/admin/news', label: 'Berita', icon: Newspaper },
        
        { href: '/admin/achievements', label: 'Prestasi', icon: Trophy },
        { href: '/admin/gallery', label: 'Galeri', icon: ImageIcon },
        { href: '/admin/contact', label: 'Kontak', icon: Phone },
    ];

    return (
        <SidebarProvider>
            <div className="flex min-h-screen">
                <Sidebar>
                    <SidebarHeader>
                        <div className="flex items-center gap-2">
                            <Image
                                src="/logo.png"
                                alt="Logo"
                                width={32}
                                height={32}
                                className=""
                            />
                            <span className="text-lg font-semibold text-primary group-data-[state=collapsed]:hidden">
                                Admin CMS
                            </span>
                        </div>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarMenu>
                            {menuItems.map((item, index) =>
                                item.subItems ? (
                                    <Collapsible.Root asChild key={index}>
                                        <SidebarMenuItem>
                                            <Collapsible.Trigger asChild>
                                                <SidebarMenuButton
                                                    icon={
                                                        item.icon && (
                                                            <item.icon />
                                                        )
                                                    }
                                                    isActive={item.subItems.some(
                                                        (sub) =>
                                                            pathname.startsWith(
                                                                sub.href,
                                                            ),
                                                    )}
                                                    className="group/sub-trigger"
                                                >
                                                    {item.label}
                                                    <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform ease-in-out group-data-[state=open]:rotate-180 group-data-[state=collapsed]:hidden" />
                                                </SidebarMenuButton>
                                            </Collapsible.Trigger>
                                            <SidebarMenuSub>
                                                {item.subItems.map(
                                                    (subItem) => (
                                                        <SidebarMenuSubItem
                                                            key={subItem.href}
                                                        >
                                                            <SidebarMenuSubButton
                                                                href={
                                                                    subItem.href
                                                                }
                                                                isActive={
                                                                    pathname ===
                                                                    subItem.href
                                                                }
                                                            >
                                                                {subItem.label}
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    ),
                                                )}
                                            </SidebarMenuSub>
                                        </SidebarMenuItem>
                                    </Collapsible.Root>
                                ) : (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton
                                            href={item.href}
                                            icon={item.icon && <item.icon />}
                                            isActive={pathname === item.href}
                                        >
                                            {item.label}
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ),
                            )}
                        </SidebarMenu>
                    </SidebarContent>
                    <SidebarFooter>
                        <div className="flex items-center justify-between group-data-[state=collapsed]:justify-center">
                            <Button
                                variant="outline"
                                asChild
                                className="group-data-[state=collapsed]:hidden"
                            >
                                <Link href="/">Halaman Utama</Link>
                            </Button>
                            <ThemeToggle />
                        </div>
                    </SidebarFooter>
                </Sidebar>
                <main className="flex-1 p-4 md:p-8">
                    <div className="mb-4 flex items-center gap-4">
                        <SidebarTrigger className="md:hidden" />
                        <h1 className="text-2xl font-bold">
                            {menuItems
                                .flatMap((i) =>
                                    i.subItems
                                        ? i.subItems.map((s) => ({
                                              ...s,
                                              icon: i.icon,
                                          }))
                                        : i,
                                )
                                .find((i) => i.href === pathname)?.label ||
                                'Dashboard'}
                        </h1>
                    </div>
                    {children}
                </main>
            </div>
        </SidebarProvider>
    );
}
