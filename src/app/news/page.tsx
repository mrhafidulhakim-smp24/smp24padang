
"use server";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";

async function getAllNews() {
  return await prisma.news.findMany({
      orderBy: { date: 'desc' }
  });
}

async function getLatestAnnouncement() {
  return await prisma.announcement.findFirst({
    orderBy: { date: 'desc' }
  });
}

export default async function NewsPage() {
  const newsItems = await getAllNews();
  const announcement = await getLatestAnnouncement();

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">
          Berita & Pengumuman
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Ikuti terus berita, acara, dan pengumuman terbaru dari SMPN 24 Padang.
        </p>
      </div>

       {announcement && (
         <section className="mt-16">
            <Card className="w-full bg-primary/5 border-primary/20">
            <CardHeader>
                <div className="flex items-center gap-4">
                <Megaphone className="h-8 w-8 text-accent" />
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wider text-accent">
                    Pengumuman Penting
                    </p>
                    <CardTitle className="font-headline text-2xl text-primary">
                      {announcement.title}
                    </CardTitle>
                </div>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                {announcement.description}
                </p>
            </CardContent>
            </Card>
        </section>
       )}
      
      <section className="mt-12">
         <h2 className="font-headline text-3xl font-bold text-primary mb-8">
            Berita Lainnya
         </h2>
        {newsItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {newsItems.map((item) => (
                <Card key={item.id} className="overflow-hidden transition-shadow duration-300 hover:shadow-xl flex flex-col">
                <CardHeader className="p-0">
                    <Link href={`/articles/${item.id}`}>
                    <Image
                        src={item.imageUrl || "https://placehold.co/600x400.png"}
                        alt={item.title}
                        width={600}
                        height={400}
                        className="h-56 w-full object-cover"
                    />
                    </Link>
                </CardHeader>
                <CardContent className="flex flex-grow flex-col p-6">
                    <p className="mb-2 text-sm text-muted-foreground">{new Date(item.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <CardTitle className="font-headline text-xl font-bold text-primary">
                    <Link href={`/articles/${item.id}`} className="hover:underline">{item.title}</Link>
                    </CardTitle>
                    <p className="mt-2 flex-grow text-foreground/80 dark:text-foreground/70">{item.description.substring(0, 100)}...</p>
                    <Button variant="link" asChild className="mt-4 p-0 self-start text-accent hover:text-accent/80">
                    <Link href={`/articles/${item.id}`}>
                        Baca Lebih Lanjut <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                    </Button>
                </CardContent>
                </Card>
            ))}
            </div>
        ) : (
            <p className="text-center text-muted-foreground mt-8">Belum ada berita yang dipublikasikan.</p>
        )}
      </section>
    </div>
  );
}
