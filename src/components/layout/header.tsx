'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';

import {
    Home,
    User,
    BookOpen,
    Trophy,
    Camera,
    Menu,
    Phone,
    Mail,
    ChevronDown,
    Target,
    Users,
    Award,
    Network,
    Wrench,
    MapPin,
    Newspaper,
    Shirt,
    Swords,
    GraduationCap,
    ShieldCheck,
    Megaphone,
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';
import { getContactInfo } from '@/app/admin/contact/actions';

type ContactInfo = {
    address: string;
    phone: string;
    email: string;
};

export default function Header() {
    const [isSheetOpen, setSheetOpen] = useState(false);
    const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        async function fetchContactInfo() {
            const data = await getContactInfo();
            if (data) {
                setContactInfo(data);
            }
        }
        fetchContactInfo();
    }, []);

    const navLinks = [
        { href: '/', label: 'Beranda', icon: Home },
        {
            href: '/profile',
            label: 'Profil',
            icon: User,
            subLinks: [
                { href: '/profile', label: 'Profil Sekolah', icon: User },
                {
                    href: '/profile/vision-mission',
                    label: 'Visi & Misi',
                    icon: Target,
                },
                {
                    href: '/profile/organization-structure',
                    label: 'Struktur Organisasi',
                    icon: Network,
                },
                {
                    href: '/profile/accreditation',
                    label: 'Sertifikasi & Penghargaan',
                    icon: Award,
                },
                {
                    href: '/profile/uniform',
                    label: 'Seragam Sekolah',
                    icon: Shirt,
                },
            ],
        },
        { href: '/profile/faculty', label: 'Guru & Staf', icon: Users },
        {
            href: '/publications',
            label: 'Publikasi',
            icon: Newspaper,
            subLinks: [
                { href: '/news', label: 'Berita', icon: Newspaper },
                { href: '/pengumuman', label: 'Pengumuman', icon: Megaphone },
            ],
        },
        { href: '/achievements', label: 'Prestasi', icon: Trophy },
        { href: '/gallery', label: 'Galeri', icon: Camera },
        { href: '/contact', label: 'Kontak', icon: Phone },
    ];

    const cleanPathname = pathname;

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background">
            {/* Top Bar for Contact Info */}
            <div className="hidden bg-primary/90 text-primary-foreground lg:block">
                <div className="container mx-auto flex h-8 items-center justify-between px-4 text-sm">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4" />
                        <span className="font-semibold">
                            CERDAS, TERAMPIL, DAN BERBUDAYA LINGKUNGAN
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <a
                            href={`tel:${contactInfo?.phone}`}
                            className="flex items-center gap-2 transition-colors hover:text-white/80"
                        >
                            <Phone className="h-4 w-4" />
                            <span>{contactInfo?.phone}</span>
                        </a>
                        <a
                            href={`mailto:${contactInfo?.email}`}
                            className="flex items-center gap-2 transition-colors hover:text-white/80"
                        >
                            <Mail className="h-4 w-4" />
                            <span>{contactInfo?.email}</span>
                        </a>
                    </div>
                </div>
            </div>

            <div className="container mx-auto flex h-16 items-center px-4">
                <Link
                    href="/"
                    className="mr-6 flex flex-shrink-0 items-center gap-2"
                >
                    <Image
                        src="/logo.png"
                        alt="SMPN 24 Padang Logo"
                        width={40}
                        height={40}
                        className="h-8 w-auto"
                    />
                    <span className="font-headline text-xl font-bold text-primary whitespace-nowrap">
                        SMPN 24 Padang
                    </span>
                </Link>

                <div className="flex w-full items-center justify-end">
                    {/* Desktop Navigation */}
                    <nav className="items-center justify-end gap-8 hidden md:flex">
                        {navLinks.map((link) => {
                            const isDropdownActive =
                                link.subLinks &&
                                link.subLinks.some(
                                    (sub) => pathname === sub.href,
                                );
                            const isLinkActive =
                                (link.href === '/' && pathname === '/') ||
                                (link.href !== '/' &&
                                    pathname.startsWith(link.href) &&
                                    !link.subLinks) ||
                                (link.href === '/news' &&
                                    pathname.startsWith('/articles'));

                            return link.subLinks ? (
                                <DropdownMenu key={link.href}>
                                    <DropdownMenuTrigger
                                        className={cn(
                                            'relative flex items-center text-base font-semibold text-muted-foreground transition-colors hover:text-primary focus:outline-none after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-full after:bg-primary after:transition-transform after:duration-300 after:ease-in-out',
                                            isDropdownActive
                                                ? 'text-primary after:scale-x-100'
                                                : 'after:scale-x-0',
                                        )}
                                    >
                                        {link.label}{' '}
                                        <ChevronDown className="ml-1 h-4 w-4" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-64">
                                        {link.subLinks.map((subLink) => {
                                            const isSubLinkActive =
                                                pathname === subLink.href;
                                            return (
                                                <DropdownMenuItem
                                                    key={subLink.href}
                                                    asChild
                                                >
                                                    <Link
                                                        href={subLink.href}
                                                        className={cn(
                                                            'flex items-center gap-3 p-2 text-lg font-semibold text-muted-foreground transition-colors hover:text-primary',
                                                            isSubLinkActive &&
                                                                'text-primary',
                                                        )}
                                                    >
                                                        <subLink.icon className="h-5 w-5" />
                                                        {subLink.label}
                                                    </Link>
                                                </DropdownMenuItem>
                                            );
                                        })}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        'relative text-base font-semibold text-muted-foreground transition-colors hover:text-primary after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-full after:origin-bottom-left after:bg-primary after:transition-transform after:duration-300 after:ease-in-out',
                                        isLinkActive
                                            ? 'text-primary after:scale-x-100'
                                            : 'after:scale-x-0 hover:after:scale-x-100',
                                    )}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="ml-4">
                        <ThemeToggle />
                    </div>

                    {/* Mobile Menu */}
                    <div className="md:hidden">
                        <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-6 w-6" />
                                    <span className="sr-only">
                                        Open navigation menu
                                    </span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right">
                                <div className="flex flex-col gap-4 py-6">
                                    <Link
                                        href="/"
                                        className="mb-4 flex items-center gap-2"
                                    >
                                        <Image
                                            src="/logo.png"
                                            alt="SMPN 24 Padang Logo"
                                            width={40}
                                            height={40}
                                            className="h-8 w-auto"
                                        />
                                        <span className="font-headline text-xl font-bold text-primary whitespace-nowrap">
                                            SMPN 24 Padang
                                        </span>
                                    </Link>
                                    {navLinks.map((link) =>
                                        !link.subLinks ? (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                onClick={() =>
                                                    setSheetOpen(false)
                                                }
                                                className={cn(
                                                    'flex items-center gap-3 rounded-md p-2 text-lg font-medium text-foreground hover:bg-accent hover:text-accent-foreground',
                                                    (cleanPathname.startsWith(
                                                        link.href,
                                                    ) ||
                                                        (link.href ===
                                                            '/news' &&
                                                            cleanPathname.startsWith(
                                                                '/articles',
                                                            ))) &&
                                                        'bg-accent text-accent-foreground',
                                                )}
                                            >
                                                <link.icon className="h-5 w-5" />
                                                {link.label}
                                            </Link>
                                        ) : (
                                            <div
                                                key={link.href}
                                                className="flex flex-col"
                                            >
                                                <p
                                                    className={cn(
                                                        'flex items-center gap-3 p-2 text-lg font-medium text-muted-foreground',
                                                        cleanPathname.startsWith(
                                                            link.href,
                                                        ) &&
                                                            'text-accent-foreground',
                                                    )}
                                                >
                                                    <link.icon className="h-5 w-5" />
                                                    {link.label}
                                                </p>
                                                <div className="flex flex-col pl-8">
                                                    {link.subLinks.map(
                                                        (subLink) => (
                                                            <Link
                                                                key={
                                                                    subLink.href
                                                                }
                                                                href={
                                                                    subLink.href
                                                                }
                                                                onClick={() =>
                                                                    setSheetOpen(
                                                                        false,
                                                                    )
                                                                }
                                                                className={cn(
                                                                    'flex items-center gap-3 rounded-md p-2 text-lg font-medium text-foreground hover:bg-accent hover:text-accent-foreground',
                                                                    cleanPathname ===
                                                                        subLink.href &&
                                                                        'bg-accent text-accent-foreground',
                                                                )}
                                                            >
                                                                <subLink.icon className="h-5 w-5" />
                                                                {subLink.label}
                                                            </Link>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        ),
                                    )}
                                    <div className="mt-4 flex flex-col gap-4 border-t pt-4">
                                        <div className="flex items-center gap-3 rounded-md p-2 text-base font-medium text-foreground">
                                            <MapPin className="h-5 w-5" />
                                            <span>{contactInfo?.address}</span>
                                        </div>
                                        <a
                                            href={`tel:${contactInfo?.phone}`}
                                            className="flex items-center gap-3 rounded-md p-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                                        >
                                            <Phone className="h-5 w-5" />
                                            <span>{contactInfo?.phone}</span>
                                        </a>
                                        <a
                                            href={`mailto:${contactInfo?.email}`}
                                            className="flex items-center gap-3 rounded-md p-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                                        >
                                            <Mail className="h-5 w-5" />
                                            <span>{contactInfo?.email}</span>
                                        </a>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}
