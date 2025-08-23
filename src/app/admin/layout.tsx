
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
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Home,
  Newspaper,
  Trophy,
  Camera,
  User,
  Settings,
  Building,
  GraduationCap,
  Shield,
  LifeBuoy,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
              <SidebarMenuItem>
                <SidebarMenuButton href="/admin" icon={<LayoutDashboard />}>
                  Dasbor
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/admin/banner" icon={<Camera />}>
                  Banner
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/admin/news" icon={<Newspaper />}>
                  Berita
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/admin/achievements" icon={<Trophy />}>
                  Prestasi
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/admin/gallery" icon={<Camera />}>
                  Galeri
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  href="/admin/profile"
                  icon={<User />}
                  subItems={[
                    { href: "/admin/profile/vision-mission", label: "Visi & Misi" },
                    { href: "/admin/profile/extracurricular", label: "Ekstrakurikuler" },
                    { href: "/admin/profile/uniform", label: "Seragam" },
                  ]}
                >
                  Profil Sekolah
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/admin/academics" icon={<GraduationCap />}>
                  Akademik
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton href="/admin/organization" icon={<Building />}>
                  Organisasi
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton href="/admin/staff" icon={<Shield />}>
                  Guru & Staf
                </SidebarMenuButton>
              </SidebarMenuItem>
                 <SidebarMenuItem>
                <SidebarMenuButton href="/admin/accreditation" icon={<LifeBuoy />}>
                  Akreditasi
                </SidebarMenuButton>
              </SidebarMenuItem>
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
