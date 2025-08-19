"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslations, useLocale } from 'next-intl';

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
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const t = useTranslations('Header');
  const locale = useLocale();

  const navLinks = [
    { href: "/", label: t('nav.home'), icon: Home },
    { 
      href: "/profile", 
      label: t('nav.profile'), 
      icon: User,
      subLinks: [
        { href: "/profile", label: t('nav.schoolProfile'), icon: User },
        { href: "/profile/vision-mission", label: t('nav.visionMission'), icon: Target },
        { href: "/profile/faculty", label: t('nav.facultyStaff'), icon: Users },
        { href: "/profile/organization-structure", label: t('nav.organizationStructure'), icon: Network },
        { href: "/profile/accreditation", label: t('nav.accreditation'), icon: Award },
      ]
    },
    { href: "/academics", label: t('nav.academics'), icon: BookOpen },
    { href: "/achievements", label: t('nav.achievements'), icon: Trophy },
    { href: "/gallery", label: t('nav.gallery'), icon: Camera },
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const getCleanPathname = (path: string) => {
    const localePattern = /^\/(en|id)/;
    return path.replace(localePattern, '') || '/';
  }
  
  const cleanPathname = getCleanPathname(pathname);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top Bar */}
      <div className="hidden bg-primary/90 text-primary-foreground lg:block clip-path-diagonal">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 text-sm">
            <div className="flex items-center gap-4">
                 <p className="text-primary-foreground/80">{t('slogan')}</p>
            </div>
            <div className="flex items-center gap-6">
                <a href={`tel:${t('phone')}`} className="flex items-center gap-2 text-primary-foreground/80 transition-colors hover:text-white">
                    <Phone className="h-4 w-4" />
                    <span>{t('phone')}</span>
                </a>
                <a href={`mailto:${t('email')}`} className="flex items-center gap-2 text-primary-foreground/80 transition-colors hover:text-white">
                    <Mail className="h-4 w-4" />
                    <span>{t('email')}</span>
                </a>
            </div>
        </div>
      </div>
      
      {/* Main Navigation */}
       <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex flex-shrink-0 items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
            {locale.toUpperCase()}
          </div>
          <span className="font-headline text-xl font-bold text-primary whitespace-nowrap">
            {t('schoolName')}
          </span>
        </Link>
        
        <div className="flex items-center gap-2">
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
            <ThemeToggle />
            <LanguageSwitcher />
        </div>


        {/* Mobile Menu Trigger */}
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
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {locale.toUpperCase()}
                  </div>
                  <span className="font-headline text-xl font-bold text-primary whitespace-nowrap">
                    {t('schoolName')}
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
                     <a href={`tel:${t('phone')}`} className="flex items-center gap-3 rounded-md p-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground">
                        <Phone className="h-5 w-5" />
                         <span>{t('phone')}</span>
                     </a>
                     <a href={`mailto:${t('email')}`} className="flex items-center gap-3 rounded-md p-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground">
                        <Mail className="h-5 w-5" />
                         <span>{t('email')}</span>
                    </a>
                 </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
