
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const newsItems = [
  {
    id: "1",
    title: "Annual Sports Day Gala",
    date: "2024-03-15",
    description: "A day of thrilling competitions and spectacular performances, celebrating sportsmanship and teamwork.",
    image: "https://placehold.co/600x400.png",
    hint: "sports day",
    link: "#"
  },
  {
    id: "2",
    title: "Science Fair Innovations",
    date: "2024-03-10",
    description: "Our students showcase their groundbreaking science projects, pushing the boundaries of creativity and knowledge.",
    image: "https://placehold.co/600x400.png",
    hint: "science fair",
    link: "#"
  },
  {
    id: "3",
    title: "Art Exhibition 'Creative Canvases'",
    date: "2024-03-05",
    description: "Explore the vibrant world of art created by our talented students, featuring a diverse range of styles and mediums.",
    image: "https://placehold.co/600x400.png",
    hint: "art exhibition",
    link: "#"
  },
   {
    id: "4",
    title: "Community Service Day",
    date: "2024-02-20",
    description: "Students participated in various community service activities, making a positive impact on the local environment.",
    image: "https://placehold.co/600x400.png",
    hint: "community service",
    link: "#"
  },
  {
    id: "5",
    title: "New School Library Opening",
    date: "2024-02-15",
    description: "We are excited to announce the opening of our new state-of-the-art library, a hub for learning and discovery.",
    image: "https://placehold.co/600x400.png",
    hint: "school library",
    link: "#"
  },
    {
    id: "6",
    title: "Parent-Teacher Conference",
    date: "2024-02-10",
    description: "A successful parent-teacher conference was held to discuss student progress and collaboration.",
    image: "https://placehold.co/600x400.png",
    hint: "teacher meeting",
    link: "#"
  },
];

export default function NewsPage() {
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
                <Link href={item.link}>
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
