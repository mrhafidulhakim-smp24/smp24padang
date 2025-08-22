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
  SidebarInset,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Newspaper,
  Trophy,
  ImageIcon,
  Users,
  Wrench,
  Home,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/news", label: "Berita", icon: Newspaper },
  { href: "/achievements", label: "Prestasi", icon: Trophy },
  { href: "/gallery", label: "Galeri", icon: ImageIcon },
  { href: "/profile/faculty", label: "Fakultas", icon: Users },
  { href: "#", label: "Utilitas", icon: Wrench },
];

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
                alt="SMPN 24 Padang Logo"
                width={40}
                height={40}
                className="h-8 w-auto rounded-full"
              />
              <span className="font-headline text-lg font-bold text-primary whitespace-nowrap">
                Admin CMS
              </span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <Link href={item.href}>
                    <SidebarMenuButton>
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/">
                  <SidebarMenuButton>
                    <Home />
                    <span>Kembali ke Situs</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-1 flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
              <SidebarTrigger className="md:hidden"/>
              <div className="w-full flex-1">
                  {/* Bisa ditambahkan breadcrumbs atau judul halaman di sini */}
              </div>
          </header>
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}