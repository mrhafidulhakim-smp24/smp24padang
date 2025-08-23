
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
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="text-center p-8">
            <h1 className="font-headline text-4xl font-bold text-primary">Admin CMS Dinonaktifkan</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Fitur CMS dinonaktifkan sementara untuk perbaikan.
            </p>
            <Button asChild className="mt-8">
              <Link href="/">Kembali ke Halaman Utama</Link>
            </Button>
          </div>
      </div>
  );
}
