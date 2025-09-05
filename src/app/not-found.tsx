import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <Card className="w-full max-w-md text-center shadow-2xl">
                <CardHeader>
                    <div className="mx-auto bg-secondary p-4 rounded-full w-fit">
                        <h1 className="text-4xl font-bold text-primary">404</h1>
                    </div>
                    <CardTitle className="mt-4 text-3xl font-bold">Halaman Tidak Ditemukan</CardTitle>
                    <CardDescription className="mt-2 text-lg text-muted-foreground">
                        Maaf, halaman yang Anda cari tidak ada atau mungkin telah dipindahkan.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" />
                            Kembali ke Beranda
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
