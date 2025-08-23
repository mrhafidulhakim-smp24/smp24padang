
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  return (
     <div className="flex flex-col gap-8 items-center justify-center h-full">
        <h1 className="font-headline text-3xl font-bold text-primary md:text-4xl text-center">
          Dasbor Admin Dinonaktifkan
        </h1>
        <p className="mt-2 text-lg text-muted-foreground text-center">
          Silakan kembali ke halaman utama.
        </p>
         <Button asChild className="mt-4">
            <Link href="/">Kembali ke Situs</Link>
        </Button>
      </div>
  );
}
