'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function OrganizationAdminPage() {
    return (
        <div>
            <h1 className="font-headline text-3xl font-bold text-primary md:text-4xl">Kelola Struktur Organisasi</h1>
            <p className="mt-2 text-lg text-muted-foreground">
                Halaman ini dalam pengembangan.
            </p>
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Struktur Organisasi</CardTitle>
                    <CardDescription>
                        Fitur untuk mengelola struktur organisasi akan segera tersedia.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Data struktur organisasi akan ditampilkan di sini.</p>
                </CardContent>
            </Card>
        </div>
    );
}