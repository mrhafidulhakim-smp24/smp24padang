
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-background text-center">
      <div className="rounded-lg border bg-card p-8 shadow-lg">
        <h1 className="font-headline text-3xl font-bold text-primary">
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
