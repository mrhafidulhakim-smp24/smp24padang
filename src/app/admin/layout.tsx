
"use client";

import Link from "next/link";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Home,
  Newspaper,
  Trophy,
  Camera,
  User,
  Building,
  GraduationCap,
  Shield,
} from "lucide-react";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const pathname = usePathname();
    const menuItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dasbor" },
    { href: "/admin/banner", icon: Camera, label: "Banner" },
    { href: "/admin/news", icon: Newspaper, label: "Berita" },
    { href: "/admin/achievements", icon: Trophy, label: "Prestasi" },
    { href: "/admin/profile", icon: User, label: "Profil" },
    { href: "/admin/academics", icon: GraduationCap, label: "Akademik" },
    { href: "/admin/staff", icon: Shield, label: "Guru & Staf" },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <Image
                src="/logo.jpg"
                width={32}
                height={32}
                alt="Logo"
                className="rounded-full"
              />
              <span className="text-lg font-semibold text-foreground">
                Admin CMS
              </span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
               {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    href={item.href}
                    icon={item.icon}
                    isActive={pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))}
                  >
                    {item.label}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton href="/" icon={<Home />}>
                  Lihat Situs
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
