'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Settings, LogOut } from 'lucide-react';

export default function AdminHeader() {
    const { data: session } = useSession();
    const { toast } = useToast();

    const handleLogout = async () => {
        try {
            await signOut({ redirect: false });
            toast({ title: 'Sukses', description: 'Anda telah keluar.' });
            window.location.href = '/login';
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Gagal untuk keluar.'
            });
        }
    };

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background px-4 py-2 flex items-center justify-end">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full [&>svg]:hidden">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || 'User'} />
                            <AvatarFallback>{session?.user?.name?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {session?.user?.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href="/admin/profile">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Profil Admin</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}
