
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  LayoutDashboard,
  Newspaper,
  Trophy,
  ImageIcon,
  Users,
  Home,
  Building,
  Award,
  Network,
  Image as ImageIconLucide,
  BookOpen,
  User,
  Target,
  ChevronRight,
  Shirt,
  Swords,
} from "lucide-react";
import Image from "next/image";

const adminNavItems = [
  { href: "/admin", label: "Dasbor", icon: LayoutDashboard },
  { 
    href: "/admin/profile", 
    label: "Profil", 
    icon: User,
    subLinks: [
      { href: "/admin/profile", label: "Profil Sekolah", icon: Building },
      { href: "/admin/profile/vision-mission", label: "Visi & Misi", icon: Target },
      { href: "/admin/staff", label: "Guru & Staf", icon: Users },
      { href: "/admin/organization", label: "Struktur Organisasi", icon: Network },
      { href: "/admin/accreditation", label: "Akreditasi", icon: Award },
      { href: "/admin/profile/uniform", label: "Seragam Sekolah", icon: Shirt },
      { href: "/admin/profile/extracurricular", label: "Ekstrakurikuler", icon: Swords },
    ]
  },
  { 
    href: "/admin/academics", 
    label: "Akademik", 
    icon: BookOpen
  },
  { href: "/admin/achievements", label: "Prestasi", icon: Trophy },
  { href: "/admin/gallery", label: "Galeri", icon: ImageIcon },
  { href: "/admin/news", label: "Berita", icon: Newspaper },
  { href: "/admin/banner", label: "Banner Beranda", icon: ImageIconLucide },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
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
                   {!item.subLinks ? (
                    <Link href={item.href}>
                      <SidebarMenuButton>
                        <item.icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </Link>
                  ) : (
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="group justify-between">
                          <div className="flex items-center gap-2">
                            <item.icon />
                            <span>{item.label}</span>
                          </div>
                          <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenu className="ml-4 mt-2 border-l border-border pl-4">
                          {item.subLinks.map(subLink => (
                            <SidebarMenuItem key={subLink.label}>
                              <Link href={subLink.href}>
                                <SidebarMenuButton variant="ghost" className="h-8 justify-start">
                                  <subLink.icon />
                                  <span>{subLink.label}</span>
                                </SidebarMenuButton>
                              </Link>
                            </SidebarMenuItem>
                          ))}
                        </SidebarMenu>
                      </CollapsibleContent>
                    </Collapsible>
                  )}
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
                  <h1 className="text-lg font-semibold">Manajemen Konten</h1>
              </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 bg-muted/40">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
