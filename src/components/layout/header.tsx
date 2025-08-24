
"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

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
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isSheetOpen, setSheetOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Beranda", icon: Home },
    { 
      href: "/profile", 
      label: "Profil", 
      icon: User,
      subLinks: [
        { href: "/profile", label: "Profil Sekolah", icon: User },
        { href: "/profile/vision-mission", label: "Visi & Misi", icon: Target },
        { href: "/profile/faculty", label: "Guru & Staf", icon: Users },
        { href: "/profile/organization-structure", label: "Struktur Organisasi", icon: Network },
        { href: "/profile/accreditation", label: "Sertifikasi & Penghargaan", icon: Award },
        { href: "/profile/uniform", label: "Seragam Sekolah", icon: Shirt },
        { href: "/profile/extracurricular", label: "Ekstrakurikuler", icon: Swords },
      ]
    },
    { 
      href: "/academics", 
      label: "Akademik", 
      icon: GraduationCap
    },
    { href: "/achievements", label: "Prestasi", icon: Trophy },
    { href: "/news", label: "Berita", icon: Newspaper },
    { href: "/gallery", label: "Galeri", icon: Camera },
    { href: "/contact", label: "Kontak", icon: Phone },
  ];

  const cleanPathname = pathname;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      {/* Top Bar for Contact Info */}
      <div className="hidden bg-primary/90 text-primary-foreground lg:block">
        <div className="container mx-auto flex h-8 items-center justify-between px-4 text-sm">
            <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <span className="font-semibold">CERDAS, TERAMPIL, DAN BERBUDAYA LINGKUNGAN</span>
            </div>
            <div className="flex items-center gap-6">
                <a href="tel:+621234567890" className="flex items-center gap-2 transition-colors hover:text-white/80">
                    <Phone className="h-4 w-4" />
                    <span>+62 123 456 7890</span>
                </a>
                <a href="mailto:info@smpn24padang.sch.id" className="flex items-center gap-2 transition-colors hover:text-white/80">
                    <Mail className="h-4 w-4" />
                    <span>info@smpn24padang.sch.id</span>
                </a>
            </div>
        </div>
      </div>

       <div className="container mx-auto flex h-16 items-center px-4">
            <Link href="/" className="mr-6 flex flex-shrink-0 items-center gap-2">
                <Image src="/logo.jpg" alt="SMPN 24 Padang Logo" width={40} height={40} className="h-8 w-auto rounded-full" />
                <span className="font-headline text-xl font-bold text-primary whitespace-nowrap">
                    SMPN 24 Padang
                </span>
            </Link>
            
        <div className="flex w-full items-center justify-end">
            {/* Desktop Navigation */}
            <nav className="items-center justify-end gap-6 hidden md:flex">
            {navLinks.map((link) => 
                link.subLinks ? (
                <DropdownMenu key={link.href}>
                    <DropdownMenuTrigger className={cn(
                        "flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus:outline-none",
                        cleanPathname.startsWith(link.href) && "text-primary"
                    )}>
                    {link.label} <ChevronDown className="ml-1 h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                    {link.subLinks.map(subLink => (
                        <DropdownMenuItem key={subLink.href} asChild>
                        <Link href={subLink.href} className={cn(
                            "flex items-center gap-2",
                            cleanPathname === subLink.href && "font-semibold text-primary"
                        )}>
                            <subLink.icon className="h-4 w-4 text-muted-foreground" />
                            {subLink.label}
                        </Link>
                        </DropdownMenuItem>
                    ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                ) : (
                <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                        "text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
                        (cleanPathname === link.href) && "text-primary font-semibold"
                    )}
                >
                    {link.label}
                </Link>
                )
            )}
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
                        <span className="sr-only">Open navigation menu</span>
                    </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                    <div className="flex flex-col gap-4 py-6">
                        <Link href="/" className="mb-4 flex items-center gap-2">
                            <Image src="/logo.jpg" alt="SMPN 24 Padang Logo" width={40} height={40} className="h-8 w-auto rounded-full" />
                            <span className="font-headline text-xl font-bold text-primary whitespace-nowrap">
                                SMPN 24 Padang
                            </span>
                        </Link>
                        {navLinks.map((link) => 
                            !link.subLinks ? (
                                <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setSheetOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 rounded-md p-2 text-lg font-medium text-foreground hover:bg-accent hover:text-accent-foreground",
                                    cleanPathname === link.href && "bg-accent text-accent-foreground"
                                )}
                                >
                                <link.icon className="h-5 w-5" />
                                {link.label}
                                </Link>
                            ) : (
                                <div key={link.href} className="flex flex-col">
                                    <p className={cn(
                                        "flex items-center gap-3 p-2 text-lg font-medium text-muted-foreground",
                                        cleanPathname.startsWith(link.href) && "text-accent-foreground"
                                    )}>
                                        <link.icon className="h-5 w-5" />
                                        {link.label}
                                    </p>
                                    <div className="flex flex-col pl-8">
                                        {link.subLinks.map(subLink => (
                                            <Link
                                                key={subLink.href}
                                                href={subLink.href}
                                                onClick={() => setSheetOpen(false)}
                                                className={cn(
                                                    "flex items-center gap-3 rounded-md p-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground",
                                                    cleanPathname === subLink.href && "bg-accent text-accent-foreground"
                                                )}
                                            >
                                                <subLink.icon className="h-4 w-4" />
                                                {subLink.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )
                        )}
                        <div className="mt-4 flex flex-col gap-4 border-t pt-4">
                             <div className="flex items-center gap-3 rounded-md p-2 text-base font-medium text-foreground">
                                <MapPin className="h-5 w-5" />
                                <span>Jl. Bypass, Lubuk Begalung, Padang</span>
                            </div>
                            <a href="tel:+62 123 456 7890" className="flex items-center gap-3 rounded-md p-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground">
                                <Phone className="h-5 w-5" />
                                <span>+62 123 456 7890</span>
                            </a>
                            <a href="mailto:info@smpn24padang.sch.id" className="flex items-center gap-3 rounded-md p-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground">
                                <Mail className="h-5 w-5" />
                                <span>info@smpn24padang.sch.id</span>
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

    