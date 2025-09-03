'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { VariantProps, cva } from 'class-variance-authority';
import { PanelLeft } from 'lucide-react';

import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Tooltip,
    TooltipContent,
    TooltipContentProps,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import Link, { type LinkProps } from 'next/link';
import * as Collapsible from '@radix-ui/react-collapsible';

const SIDEBAR_COOKIE_NAME = 'sidebar_state';
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = '16rem';
const SIDEBAR_WIDTH_MOBILE = '18rem';
const SIDEBAR_WIDTH_ICON = '3rem';
const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

type SidebarContext = {
    state: 'expanded' | 'collapsed';
    open: boolean;
    setOpen: (open: boolean) => void;
    openMobile: boolean;
    setOpenMobile: (open: boolean) => void;
    isMobile: boolean;
    toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContext | null>(null);

function useSidebar() {
    const context = React.useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider.');
    }

    return context;
}

const SidebarProvider = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<'div'> & {
        defaultOpen?: boolean;
        open?: boolean;
        onOpenChange?: (open: boolean) => void;
    }
>(
    (
        {
            defaultOpen = true,
            open: openProp,
            onOpenChange: setOpenProp,
            className,
            style,
            children,
            ...props
        },
        ref,
    ) => {
        const isMobile = useIsMobile();
        const [openMobile, setOpenMobile] = React.useState(false);

        // This is the internal state of the sidebar.
        // We use openProp and setOpenProp for control from outside the component.
        const [_open, _setOpen] = React.useState(defaultOpen);
        const open = openProp ?? _open;
        const setOpen = React.useCallback(
            (value: boolean | ((value: boolean) => boolean)) => {
                const openState =
                    typeof value === 'function' ? value(open) : value;
                if (setOpenProp) {
                    setOpenProp(openState);
                } else {
                    _setOpen(openState);
                }

                // This sets the cookie to keep the sidebar state.
                document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
            },
            [setOpenProp, open],
        );

        // Helper to toggle the sidebar.
        const toggleSidebar = React.useCallback(() => {
            return isMobile
                ? setOpenMobile((open) => !open)
                : setOpen((open) => !open);
        }, [isMobile, setOpen, setOpenMobile]);

        // Adds a keyboard shortcut to toggle the sidebar.
        React.useEffect(() => {
            const handleKeyDown = (event: KeyboardEvent) => {
                if (
                    event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
                    (event.metaKey || event.ctrlKey)
                ) {
                    event.preventDefault();
                    toggleSidebar();
                }
            };

            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }, [toggleSidebar]);

        // We add a state so that we can do data-state="expanded" or "collapsed".
        // This makes it easier to style the sidebar with Tailwind classes.
        const state = open ? 'expanded' : 'collapsed';

        const contextValue = React.useMemo<SidebarContext>(
            () => ({
                state,
                open,
                setOpen,
                isMobile,
                openMobile,
                setOpenMobile,
                toggleSidebar,
            }),
            [
                state,
                open,
                setOpen,
                isMobile,
                openMobile,
                setOpenMobile,
                toggleSidebar,
            ],
        );

        return (
            <SidebarContext.Provider value={contextValue}>
                <TooltipProvider delayDuration={0}>
                    <div
                        style={
                            {
                                '--sidebar-width': SIDEBAR_WIDTH,
                                '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
                                ...style,
                            } as React.CSSProperties
                        }
                        className={cn(
                            'group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar',
                            className,
                        )}
                        ref={ref}
                        {...props}
                    >
                        {children}
                    </div>
                </TooltipProvider>
            </SidebarContext.Provider>
        );
    },
);
SidebarProvider.displayName = 'SidebarProvider';

const Sidebar = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<'div'> & {
        side?: 'left' | 'right';
        variant?: 'sidebar' | 'floating' | 'inset';
        collapsible?: 'offcanvas' | 'icon' | 'none';
    }
>(
    (
        {
            side = 'left',
            variant = 'sidebar',
            collapsible = 'offcanvas',
            className,
            children,
            ...props
        },
        ref,
    ) => {
        const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

        if (collapsible === 'none') {
            return (
                <div
                    className={cn(
                        'flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground',
                        className,
                    )}
                    ref={ref}
                    {...props}
                >
                    {children}
                </div>
            );
        }

        if (isMobile) {
            return (
                <Sheet
                    open={openMobile}
                    onOpenChange={setOpenMobile}
                    {...props}
                >
                    <SheetContent
                        data-sidebar="sidebar"
                        data-mobile="true"
                        className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
                        style={
                            {
                                '--sidebar-width': SIDEBAR_WIDTH_MOBILE,
                            } as React.CSSProperties
                        }
                        side={side}
                    >
                        <div className="flex h-full w-full flex-col">
                            {children}
                        </div>
                    </SheetContent>
                </Sheet>
            );
        }

        return (
            <div
                ref={ref}
                className={cn(
                    'group peer hidden md:flex flex-col h-screen sticky top-0',
                    'text-sidebar-foreground',
                    state === 'expanded'
                        ? 'w-[--sidebar-width]'
                        : 'w-[--sidebar-width-icon]',
                    variant === 'sidebar' &&
                        (side === 'left' ? 'border-r' : 'border-l'),
                    className,
                )}
                data-state={state}
                {...props}
            >
                <div
                    data-sidebar="sidebar"
                    className={cn(
                        'flex h-full w-full flex-col bg-sidebar',
                        variant === 'floating' &&
                            'm-2 rounded-lg border shadow',
                        variant === 'inset' && 'm-2 rounded-lg',
                    )}
                >
                    {children}
                </div>
            </div>
        );
    },
);
Sidebar.displayName = 'Sidebar';

const SidebarTrigger = React.forwardRef<
    React.ElementRef<typeof Button>,
    React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
    const { toggleSidebar } = useSidebar();

    return (
        <Button
            ref={ref}
            data-sidebar="trigger"
            variant="ghost"
            size="icon"
            className={cn('h-7 w-7', className)}
            onClick={(event) => {
                onClick?.(event);
                toggleSidebar();
            }}
            {...props}
        >
            <PanelLeft />
            <span className="sr-only">Toggle Sidebar</span>
        </Button>
    );
});
SidebarTrigger.displayName = 'SidebarTrigger';

const SidebarHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            data-sidebar="header"
            className={cn('flex flex-col gap-2 p-2', className)}
            {...props}
        />
    );
});
SidebarHeader.displayName = 'SidebarHeader';

const SidebarFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            data-sidebar="footer"
            className={cn('flex flex-col gap-2 p-2 mt-auto', className)}
            {...props}
        />
    );
});
SidebarFooter.displayName = 'SidebarFooter';

const SidebarContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    const { state } = useSidebar();
    return (
        <div
            ref={ref}
            data-sidebar="content"
            className={cn(
                'flex min-h-0 flex-1 flex-col gap-2 overflow-auto',
                state === 'collapsed' && 'overflow-hidden',
                className,
            )}
            {...props}
        />
    );
});
SidebarContent.displayName = 'SidebarContent';

const SidebarMenu = React.forwardRef<
    HTMLUListElement,
    React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
    <ul
        ref={ref}
        data-sidebar="menu"
        className={cn('flex w-full min-w-0 flex-col gap-1 p-2', className)}
        {...props}
    />
));
SidebarMenu.displayName = 'SidebarMenu';

const SidebarMenuItem = React.forwardRef<
    HTMLLIElement,
    React.HTMLAttributes<HTMLLIElement> & { asChild?: boolean }
>(({ className, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : 'li';
    return (
        <Comp
            ref={ref}
            data-sidebar="menu-item"
            className={cn('group/menu-item relative', className)}
            {...props}
        />
    );
});
SidebarMenuItem.displayName = 'SidebarMenuItem';

const sidebarMenuButtonVariants = cva(
    'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
    {
        variants: {
            variant: {
                default:
                    'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                outline:
                    'bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]',
            },
            size: {
                default: 'h-8 text-sm',
                sm: 'h-7 text-xs',
                lg: 'h-12 text-sm group-data-[collapsible=icon]:!p-0',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

type SidebarMenuButtonProps = (
    | (React.ComponentPropsWithoutRef<'button'> & { href?: never })
    | (React.ComponentPropsWithoutRef<typeof Link> & {
          href: LinkProps['href'];
      })
) & {
    asChild?: boolean;
    isActive?: boolean;
    tooltip?: React.ReactNode | TooltipContentProps;
    icon?: React.ReactNode;
    variant?: VariantProps<typeof sidebarMenuButtonVariants>['variant'];
    size?: VariantProps<typeof sidebarMenuButtonVariants>['size'];
};

const SidebarMenuButton = React.forwardRef<
    HTMLButtonElement | HTMLAnchorElement,
    SidebarMenuButtonProps
>(
    (
        {
            asChild = false,
            isActive = false,
            variant = 'default',
            size = 'default',
            tooltip: tooltipProp,
            className,
            href,
            icon,
            children,
            ...props
        },
        ref,
    ) => {
        const { isMobile, state } = useSidebar();

        const commonProps = {
            'data-sidebar': 'menu-button',
            'data-size': size,
            'data-active': isActive,
            className: cn(
                sidebarMenuButtonVariants({ variant, size, className }),
            ),
        };

        const buttonContent = (
            <>
                {icon}
                <span className="group-data-[state=collapsed]:hidden">
                    {children}
                </span>
            </>
        );

        const buttonElement = href ? (
            <Link
                href={href}
                {...commonProps}
                {...(() => {
                    const { href: _, ...rest } = props as React.ComponentPropsWithoutRef<typeof Link>;
                    return rest;
                })()}
                ref={ref as React.ForwardedRef<HTMLAnchorElement>}
            >
                {buttonContent}
            </Link>
        ) : (
            <button
                {...commonProps}
                {...(props as React.ComponentPropsWithoutRef<'button'>)}
                ref={ref as React.ForwardedRef<HTMLButtonElement>}
            >
                {buttonContent}
            </button>
        );

        let tooltipContent: React.ReactNode;
        let tooltipProps: Omit<TooltipContentProps, 'children'> = {};

        // Check if tooltipProp is an object and not a React element
        if (
            typeof tooltipProp === 'object' &&
            tooltipProp !== null &&
            !React.isValidElement(tooltipProp)
        ) {
            // Assume it's a TooltipContentProps object
            const { children: extractedChildren, ...rest } = tooltipProp as TooltipContentProps;
            tooltipContent = extractedChildren;
            tooltipProps = rest;
        } else {
            // Otherwise, it's a ReactNode (or undefined/null)
            tooltipContent = tooltipProp;
        }

        if (!tooltipProp && state === 'expanded') {
            return buttonElement;
        }

        if (state === 'expanded' && !isMobile) {
            return buttonElement;
        }

        return (
            <Tooltip>
                <TooltipTrigger asChild>{buttonElement}</TooltipTrigger>
                <TooltipContent side="right" align="center" {...tooltipProps}>
                    {tooltipContent || children}
                </TooltipContent>
            </Tooltip>
        );
    },
);
SidebarMenuButton.displayName = 'SidebarMenuButton';

const SidebarMenuSub = React.forwardRef<
    React.ElementRef<typeof Collapsible.Content>,
    React.ComponentPropsWithoutRef<typeof Collapsible.Content>
>(({ className, ...props }, ref) => {
    const { state } = useSidebar();

    if (state === 'collapsed') {
        return null;
    }

    return (
        <Collapsible.Content
            ref={ref}
            data-sidebar="menu-sub"
            className={cn(
                'mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border py-1 pl-4 pr-0',
                'overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down',
                className,
            )}
            {...props}
        />
    );
});
SidebarMenuSub.displayName = 'SidebarMenuSub';

const SidebarMenuSubItem = React.forwardRef<
    HTMLLIElement,
    React.ComponentProps<'li'>
>(({ ...props }, ref) => (
    <li ref={ref} data-sidebar="menu-sub-item" {...props} />
));
SidebarMenuSubItem.displayName = 'SidebarMenuSubItem';

const SidebarMenuSubButton = React.forwardRef<
    HTMLAnchorElement,
    React.ComponentProps<typeof Link> & {
        asChild?: boolean;
        size?: 'sm' | 'md';
        isActive?: boolean;
    }
>(({ asChild = false, size = 'md', isActive, className, href, ...props }, ref) => {
    const Comp = asChild ? Slot : 'a';

    return (
        <Link
            href={href || '#'}
            ref={ref}
            data-sidebar="menu-sub-button"
            data-size={size}
            data-active={isActive}
            className={cn(
                'flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground',
                'data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground',
                size === 'sm' && 'text-xs',
                size === 'md' && 'text-sm',
                'group-data-[collapsible=icon]:hidden',
                className,
            )}
            {...props}
        />
    );
});
SidebarMenuSubButton.displayName = 'SidebarMenuSubButton';

export {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
    SidebarTrigger,
    useSidebar,
};
