// src/components/ui/sidebar.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion"; // Pastikan framer-motion sudah terinstal
import { ChevronDown, ChevronUp, LucideIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import * as Collapsible from "@radix-ui/react-collapsible";

// --- Context for Sidebar State ---
interface SidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(
  undefined
);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = React.useState(false); // You might want to persist this state or control it from parent

  const value = React.useMemo(
    () => ({ isCollapsed, setIsCollapsed }),
    [isCollapsed]
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

// --- Main Sidebar Components ---

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {}

export function Sidebar({ className, children, ...props }: SidebarProps) {
  const { isCollapsed } = useSidebar();
  return (
    <aside
      className={cn(
        "relative flex flex-col h-screen bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20 rounded-md" : "w-64 rounded-md",
        className
      )}
      data-state={isCollapsed ? "collapsed" : "expanded"}
      {...props}
    >
      {children}
    </aside>
  );
}

export function SidebarHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center p-4 border-b border-gray-200 dark:border-gray-700",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SidebarContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex-1 overflow-y-auto p-4", className)} {...props}>
      {children}
    </div>
  );
}

export function SidebarFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "p-4 border-t border-gray-200 dark:border-gray-700",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SidebarTrigger({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { isCollapsed, setIsCollapsed } = useSidebar();
  return (
    <button
      onClick={() => setIsCollapsed(!isCollapsed)}
      className={cn(
        "p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
        className
      )}
      {...props}
    >
      {isCollapsed ? (
        <ChevronRight className="h-5 w-5" />
      ) : (
        <ChevronLeft className="h-5 w-5" />
      )}
    </button>
  );
}

// --- Menu Components ---

export function SidebarMenu({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul className={cn("space-y-1", className)} {...props}>
      {children}
    </ul>
  );
}

interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLLIElement> {
  isActive?: boolean;
}

export function SidebarMenuItem({
  className,
  children,
  isActive,
  ...props
}: SidebarMenuItemProps) {
  return (
    <li
      className={cn(
        "relative",
        isActive && "text-primary", // Example active state styling
        className
      )}
      {...props}
    >
      {children}
    </li>
  );
}

interface CommonSidebarMenuButtonProps {
  icon?: LucideIcon;
  isActive?: boolean;
  className?: string;
  isCollapsibleTrigger?: boolean; // New prop
  isMenuOpen?: boolean; // New prop for icon rotation
}

interface SidebarMenuButtonAsLinkProps extends CommonSidebarMenuButtonProps, React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

interface SidebarMenuButtonAsButtonProps extends CommonSidebarMenuButtonProps, React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: never; // Ensures href is not present when it's a button
}

type SidebarMenuButtonProps = SidebarMenuButtonAsLinkProps | SidebarMenuButtonAsButtonProps;

export function SidebarMenuButton({
  href,
  icon: Icon,
  isActive,
  children,
  className,
  isCollapsibleTrigger,
  isMenuOpen,
  ...props
}: SidebarMenuButtonProps) {
  const { isCollapsed } = useSidebar();

  const commonContent = (
    <div className={cn("flex items-center", isCollapsed ? "gap-0" : "gap-2")}>
      {Icon && <Icon className={cn("h-5 w-5", isCollapsed && "mr-0")} />}
      <span className={cn(isCollapsed ? "hidden" : "block")}>
        {children}
      </span>
    </div>
  );

  const commonClassName = cn(
    "flex items-center w-full p-2 rounded-md transition-colors duration-200",
    "hover:bg-gray-100 dark:hover:bg-gray-700",
    isActive && "bg-gray-100 dark:bg-gray-700 font-bold",
    isCollapsed ? "justify-center" : (isCollapsibleTrigger ? "justify-between" : "justify-start"),
    className
  );

  if (href) {
    return (
      <Link
        href={href}
        className={commonClassName}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {commonContent}
      </Link>
    );
  } else {
    return (
      <button
        type="button"
        className={commonClassName}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {commonContent}
        {isCollapsibleTrigger && (
          <ChevronRight className={cn(
            "ml-auto h-4 w-4 shrink-0 transition-transform ease-in-out",
            isMenuOpen ? "rotate-90" : ""
          )} />
        )}
      </button>
    );
  }
}

export function SidebarMenuSub({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  // This component will be wrapped by AnimatePresence and motion.ul in layout.tsx
  // The animation logic is applied where Collapsible.Content is used.
  return (
    <ul className={cn("space-y-1", className)} {...props}>
      {children}
    </ul>
  );
}

interface SidebarMenuSubItemProps extends React.HTMLAttributes<HTMLLIElement> {}

export function SidebarMenuSubItem({
  className,
  children,
  ...props
}: SidebarMenuSubItemProps) {
  return (
    <li
      className={cn(
        "border-t border-gray-200 dark:border-gray-700 first:border-t-0", // Thin separator
        className
      )}
      {...props}
    >
      {children}
    </li>
  );
}

interface SidebarMenuSubButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  isActive?: boolean;
  children: React.ReactNode;
}

export function SidebarMenuSubButton({
  href,
  isActive,
  children,
  className,
  ...props
}: SidebarMenuSubButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "block p-2 pl-6 rounded-md transition-colors duration-200 text-sm",
        "hover:bg-gray-100 dark:hover:bg-gray-700",
        isActive && "bg-gray-100 dark:bg-gray-700",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
