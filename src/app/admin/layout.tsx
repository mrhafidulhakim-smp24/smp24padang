
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "@/components/ui/sidebar";
import Image from "next/image";
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
  Network
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/banner", label: "Banner", icon: ImageIcon },
    { href: "/admin/news", label: "Berita", icon: Newspaper },
    { href: "/admin/achievements", label: "Prestasi", icon: Trophy },
    {
      label: "Profil",
      icon: Landmark,
      subItems: [
        { href: "/admin/profile", label: "Sekolah" },
        { href: "/admin/profile/vision-mission", label: "Visi & Misi" },
        { href: "/admin/profile/extracurricular", label: "Ekskul" },
        { href: "/admin/profile/uniform", label: "Seragam" },
      ],
    },
    { href: "/admin/academics", label: "Akademik", icon: GraduationCap },
    { href: "/admin/staff", label: "Guru & Staf", icon: Users },
    { href: "/admin/gallery", label: "Galeri", icon: GalleryHorizontal },
    { href: "/admin/accreditation", label: "Akreditasi", icon: FileBadge },
    { href: "/admin/organization", label: "Struktur Organisasi", icon: Network },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <Image
                src="/logo.jpg"
                alt="Logo"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="text-lg font-semibold text-primary">
                Admin CMS
              </span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item, index) =>
                item.subItems ? (
                  <SidebarMenuItem key={index}>
                     <SidebarMenuButton
                        icon={item.icon && <item.icon />}
                        isActive={item.subItems.some(sub => pathname.startsWith(sub.href))}
                      >
                       {item.label}
                       <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform ease-in-out group-data-[state=open]:rotate-180" />
                     </SidebarMenuButton>
                    <SidebarMenuSub>
                      {item.subItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.href}>
                          <SidebarMenuSubButton
                            href={subItem.href}
                            isActive={pathname === subItem.href}
                          >
                            {subItem.label}
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </SidebarMenuItem>
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
                )
              )}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <div className="flex items-center justify-between">
              <Button variant="outline" asChild>
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
               {menuItems.flatMap(i => i.subItems ? i.subItems.map(s => ({...s, icon: i.icon})) : i).find(i => i.href === pathname)?.label || 'Dashboard'}
             </h1>
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
