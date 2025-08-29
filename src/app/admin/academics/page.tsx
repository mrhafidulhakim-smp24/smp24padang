import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Swords, Shirt } from 'lucide-react';

export default function AcademicsAdminPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold text-primary md:text-4xl">
          Kelola Akademik
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Pilih kategori akademik yang ingin Anda kelola.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/profile/extracurricular">
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Swords className="h-5 w-5 text-primary" />
                Ekstrakurikuler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Kelola data kegiatan ekstrakurikuler.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/profile/uniform">
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shirt className="h-5 w-5 text-primary" />
                Seragam
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Kelola panduan seragam sekolah.</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}