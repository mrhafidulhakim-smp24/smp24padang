
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";

async function getNews() {
  const newsItems = await prisma.newsArticle.findMany({
    orderBy: {
      date: 'desc'
    }
  });
  return newsItems;
}

export default async function NewsPage() {
  const newsItems = await getNews();

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

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {newsItems.map((item) => (
          <Card key={item.id} className="overflow-hidden transition-shadow duration-300 hover:shadow-xl">
            <CardHeader className="p-0">
              <Image
                src={item.image}
                alt={item.title}
                width={600}
                height={400}
                className="h-56 w-full object-cover"
                data-ai-hint={item.hint}
              />
            </CardHeader>
            <CardContent className="flex flex-col p-6">
              <p className="mb-2 text-sm text-muted-foreground">{new Date(item.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <CardTitle className="font-headline text-xl font-bold text-primary">
                {item.title}
              </CardTitle>
              <p className="mt-2 flex-grow text-foreground/80">{item.description}</p>
              <Button variant="link" asChild className="mt-4 p-0 self-start text-accent-foreground">
                <Link href={`/news/${item.id}`}>
                  Baca Lebih Lanjut <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
