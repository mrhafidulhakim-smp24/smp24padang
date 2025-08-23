
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
        <h1 className="mt-4 font-headline text-3xl font-bold text-primary md:text-4xl">
          Admin CMS Dinonaktifkan
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Fitur CMS dinonaktifkan sementara untuk perbaikan.
        </p>
        <Button asChild className="mt-8">
          <Link href="/">Kembali ke Halaman Utama</Link>
        </Button>
      </div>
    </div>
  );
}
