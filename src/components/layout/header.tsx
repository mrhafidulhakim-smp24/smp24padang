"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Home,
  User,
  BookOpen,
  Trophy,
  Camera,
  Menu,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
  Target,
  Users,
  Award,
  Network,
} from "lucide-react";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { 
    href: "/profile", 
    label: "Profile", 
    icon: User,
    subLinks: [
      { href: "/profile", label: "Profil Sekolah", icon: User },
      { href: "/profile/vision-mission", label: "Visi & Misi", icon: Target },
      { href: "/profile/faculty", label: "Guru & Staf", icon: Users },
      { href: "/profile/organization-structure", label: "Struktur Organisasi", icon: Network },
      { href: "/profile/accreditation", label: "Sertifikat Akreditasi", icon: Award },
    ]
  },
  { href: "/academics", label: "Academics", icon: BookOpen },
  { href: "/achievements", label: "Achievements", icon: Trophy },
  { href: "/gallery", label: "Gallery", icon: Camera },
];

export default function Header() {
  const [isSheetOpen, setSheetOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="bg-primary/5">
        <div className="container mx-auto flex h-10 items-center justify-end px-4">
            <div className="flex items-center gap-6 text-sm">
                 <Link href="https://www.google.com/maps/search/?api=1&query=123+Education+Lane,+Padang,+Indonesia" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary">
                    <MapPin className="h-4 w-4" />
                    <span className="hidden md:inline">123 Education Lane, Padang, Indonesia</span>
                 </Link>
                 <a href="tel:+621234567890" className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary">
                    <Phone className="h-4 w-4" />
                     <span className="hidden md:inline">+62 123 456 7890</span>
                 </a>
                 <a href="mailto:info@duapat.edu" className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary">
                    <Mail className="h-4 w-4" />
                     <span className="hidden md:inline">info@duapat.edu</span>
                </a>
            </div>
        </div>
      </div>
       <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.jpg" alt="SMPN 24 Padang Logo" width={40} height={40} className="h-8 w-auto" />
          <span className="font-headline text-xl font-bold text-primary">
            SMPN 24 Padang
          </span>
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-6">
          {navLinks.map((link) => 
            link.subLinks ? (
              <DropdownMenu key={link.href}>
                <DropdownMenuTrigger className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus:outline-none">
                  {link.label} <ChevronDown className="ml-1 h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {link.subLinks.map(subLink => (
                    <DropdownMenuItem key={subLink.href} asChild>
                       <Link href={subLink.href} className="flex items-center gap-2">
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
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

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
                   <Image src="/logo.jpg" alt="SMPN 24 Padang Logo" width={40} height={40} className="h-8 w-auto" />
                  <span className="font-headline text-xl font-bold text-primary">
                    SMPN 24 Padang
                  </span>
                </Link>
                {navLinks.map((link) => 
                   !link.subLinks ? (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setSheetOpen(false)}
                      className="flex items-center gap-3 rounded-md p-2 text-lg font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      <link.icon className="h-5 w-5" />
                      {link.label}
                    </Link>
                   ) : (
                    <div key={link.href} className="flex flex-col">
                       <p className="flex items-center gap-3 p-2 text-lg font-medium text-muted-foreground">
                        <link.icon className="h-5 w-5" />
                        {link.label}
                       </p>
                       <div className="flex flex-col pl-8">
                        {link.subLinks.map(subLink => (
                            <Link
                                key={subLink.href}
                                href={subLink.href}
                                onClick={() => setSheetOpen(false)}
                                className="flex items-center gap-3 rounded-md p-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                            >
                                <subLink.icon className="h-4 w-4" />
                                {subLink.label}
                            </Link>
                        ))}
                       </div>
                    </div>
                   )
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
