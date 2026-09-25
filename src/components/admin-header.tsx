import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import type { SidebarMenuItem } from "@/components/admin/admin-sidebar";
import {
  ExternalLink,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  UserCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import React from "react";

interface AdminHeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileOpen: boolean;
  setIsMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  menuItems: SidebarMenuItem[];
  pathname: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  isMobileOpen,
  setIsMobileOpen,
  menuItems,
  pathname,
}) => {
  const handleToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const currentLabel =
    menuItems
      .flatMap((i) => (i.subItems ? i.subItems : i))
      .find((i) => i.href === pathname)?.label || "Dashboard";

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border/80 bg-background/95 px-3 sm:px-5 backdrop-blur shadow-xs print:hidden">
      {/* Sisi Kiri: Tombol Toggle Sidebar & Judul Halaman */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        {/* Toggle button — plain button to avoid Shadcn/btn-3d style conflicts */}
        <button
          type="button"
          onClick={handleToggle}
          aria-label={isMobileOpen || isSidebarOpen ? 'Sembunyikan sidebar' : 'Tampilkan sidebar'}
          title={isMobileOpen || isSidebarOpen ? 'Sembunyikan sidebar' : 'Tampilkan sidebar'}
          className="h-9 w-9 shrink-0 flex items-center justify-center rounded-md border border-border text-foreground bg-background hover:bg-muted transition-colors"
        >
          {/* Desktop ≥1024px: panel collapse/expand icon */}
          <span className="hidden lg:flex items-center justify-center">
            {isSidebarOpen
              ? <PanelLeftClose className="h-5 w-5" />
              : <PanelLeftOpen className="h-5 w-5" />}
          </span>
          {/* Mobile & Tablet <1024px: hamburger/close icon */}
          <span className="flex lg:hidden items-center justify-center">
            {isMobileOpen
              ? <X className="h-5 w-5" />
              : <Menu className="h-5 w-5" />}
          </span>
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <h1 className="text-sm sm:text-base font-bold text-foreground truncate">
            {currentLabel}
          </h1>
        </div>
      </div>

      {/* Sisi Kanan: Quick Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="hidden sm:inline-flex text-xs h-8 gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <Link href="/" target="_blank" rel="noopener noreferrer">
            <span>Website</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </Button>

        <Link
          href="/admin/profile"
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center justify-center h-8 w-8"
          title="Profil Admin"
        >
          <UserCircle className="h-5 w-5" />
          <span className="sr-only">Profil</span>
        </Link>

        <ThemeToggle className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted" />
      </div>
    </header>
  );
};

export default AdminHeader;
