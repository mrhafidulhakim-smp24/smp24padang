"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Home,
  User,
  BookOpen,
  Trophy,
  Mail,
  Menu,
  MapPin,
  Phone,
} from "lucide-react";
import { Logo } from "@/components/icons";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/academics", label: "Academics", icon: BookOpen },
  { href: "/achievements", label: "Achievements", icon: Trophy },
  { href: "/contact", label: "Contact", icon: Mail },
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
          <Logo className="h-8 w-8 text-primary" />
          <span className="font-headline text-xl font-bold text-primary">
            DUAPAT
          </span>
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-6">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {label}
            </Link>
          ))}
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
                  <Logo className="h-8 w-8 text-primary" />
                  <span className="font-headline text-xl font-bold text-primary">
                    DUAPAT
                  </span>
                </Link>
                {navLinks.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setSheetOpen(false)}
                    className="flex items-center gap-3 rounded-md p-2 text-lg font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    <Icon className="h-5 w-5" />
                    {label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
