import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const newsItems = [
  {
    title: "Annual Sports Day Gala",
    description: "A day of thrilling competitions and spectacular performances.",
    image: "https://placehold.co/600x400.png",
    hint: "sports students",
    date: "2024-03-15",
  },
  {
    title: "Science Fair Innovations",
    description: "Our students showcase their groundbreaking science projects.",
    image: "https://placehold.co/600x400.png",
    hint: "science fair",
    date: "2024-03-10",
  },
  {
    title: "Art Exhibition 'Creative Canvases'",
    description: "Explore the vibrant world of art created by our talented students.",
    image: "https://placehold.co/600x400.png",
    hint: "art exhibition",
    date: "2024-03-05",
  },
   {
    title: "Community Service Initiative",
    description: "Students participate in a local clean-up drive, making a positive impact.",
    image: "https://placehold.co/600x400.png",
    hint: "community service",
    date: "2024-02-28",
  },
  {
    title: "Music Festival Hits a High Note",
    description: "A harmonious evening of musical performances by school bands and choirs.",
    image: "https://placehold.co/600x400.png",
    hint: "music festival",
    date: "2024-02-20",
  },
  {
    title: "Principal's Honor Roll Ceremony",
    description: "Celebrating the academic excellence of our top-performing students.",
    image: "https://placehold.co/600x400.png",
    hint: "academic ceremony",
    date: "2024-02-15",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="relative h-[60vh] bg-primary/10">
        <Image
          src="https://placehold.co/1920x1080.png"
          alt="School Campus"
          layout="fill"
          objectFit="cover"
          className="z-0 opacity-20"
          data-ai-hint="school campus"
        />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-primary">
          <h1 className="font-headline text-4xl font-bold md:text-6xl">
            Welcome to DUAPAT Empat Padang
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-primary/80">
            Nurturing Minds, Shaping Futures. Explore our world of learning and discovery.
          </p>
          <Button asChild className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/profile">
              Learn More <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="py-12 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="font-headline mb-8 text-center text-3xl font-bold text-primary md:text-4xl">
            Latest News & Announcements
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {newsItems.map((item, index) => (
              <Card key={index} className="overflow-hidden transition-shadow duration-300 hover:shadow-xl">
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
                <CardContent className="p-6">
                  <p className="mb-2 text-sm text-muted-foreground">{item.date}</p>
                  <CardTitle className="font-headline text-xl font-bold text-primary">
                    {item.title}
                  </CardTitle>
                  <p className="mt-2 text-foreground/80">{item.description}</p>
                  <Button variant="link" asChild className="mt-4 p-0 text-accent-foreground">
                    <Link href="#">
                      Read More <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
