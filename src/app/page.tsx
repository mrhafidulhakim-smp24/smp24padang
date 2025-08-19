import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Building, GraduationCap, Users } from 'lucide-react';

const newsItems = [
  {
    title: "Annual Sports Day Gala",
    description: "A day of thrilling competitions and spectacular performances.",
    image: "https://placehold.co/600x400.png",
    hint: "sports students",
    date: "2024-03-15",
    link: "#"
  },
  {
    title: "Science Fair Innovations",
    description: "Our students showcase their groundbreaking science projects.",
    image: "https://placehold.co/600x400.png",
    hint: "science fair",
    date: "2024-03-10",
    link: "#"
  },
  {
    title: "Art Exhibition 'Creative Canvases'",
    description: "Explore the vibrant world of art created by our talented students.",
    image: "https://placehold.co/600x400.png",
    hint: "art exhibition",
    date: "2024-03-05",
    link: "#"
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[70vh] w-full bg-primary/10">
        <Image
          src="https://placehold.co/1920x1080.png"
          alt="School Campus"
          layout="fill"
          objectFit="cover"
          className="z-0 opacity-20"
          data-ai-hint="school campus"
        />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-primary">
          <h1 className="font-headline text-4xl font-bold drop-shadow-md md:text-6xl">
            Welcome to DUAPAT Empat Padang
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-primary/80 drop-shadow-sm">
            Nurturing Minds, Shaping Futures. Explore our world of learning and discovery.
          </p>
          <Button asChild className="mt-8 bg-accent text-accent-foreground shadow-lg transition-transform hover:scale-105 hover:bg-accent/90">
            <Link href="/contact">
              Enroll Today <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Welcome from Principal Section */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto grid grid-cols-1 items-center gap-12 px-4 md:grid-cols-2">
          <div className="relative h-96 w-full overflow-hidden rounded-lg shadow-xl">
            <Image 
              src="https://placehold.co/600x800.png" 
              alt="Principal" 
              layout="fill" 
              objectFit="cover" 
              data-ai-hint="professional portrait"
              className="transition-transform duration-500 hover:scale-110"
            />
          </div>
          <div>
            <h2 className="font-headline text-3xl font-bold text-primary">A Message from the Principal</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Welcome to DUAPAT Empat Padang! We are a community dedicated to fostering academic excellence, character development, and a lifelong love of learning. Our commitment is to provide a safe, nurturing, and stimulating environment where every student can thrive.
            </p>
            <Button asChild variant="link" className="mt-4 p-0 text-accent-foreground">
              <Link href="/profile">
                Read More <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="bg-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="font-headline text-3xl font-bold text-primary md:text-4xl">Our Pillars of Excellence</h2>
            <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
              Building a strong foundation for every student's future.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card className="transform text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <CardHeader className="items-center">
                <div className="rounded-full bg-accent/20 p-4">
                  <GraduationCap className="h-10 w-10 text-accent" />
                </div>
                <CardTitle className="font-headline pt-4 text-primary">Academics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">A rigorous and innovative curriculum designed to challenge and inspire.</p>
                <Button asChild variant="outline" className="mt-4">
                   <Link href="/academics">Learn More</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="transform text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <CardHeader className="items-center">
                <div className="rounded-full bg-accent/20 p-4">
                  <Users className="h-10 w-10 text-accent" />
                </div>
                <CardTitle className="font-headline pt-4 text-primary">Student Life</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">A vibrant community with diverse extracurricular activities and clubs.</p>
                 <Button asChild variant="outline" className="mt-4">
                   <Link href="/academics#activities">Explore Activities</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="transform text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <CardHeader className="items-center">
                <div className="rounded-full bg-accent/20 p-4">
                  <Building className="h-10 w-10 text-accent" />
                </div>
                <CardTitle className="font-headline pt-4 text-primary">Our Campus</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">State-of-the-art facilities that provide a world-class learning environment.</p>
                 <Button asChild variant="outline" className="mt-4">
                   <Link href="/profile">Visit Us</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16 md:py-24">
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
                    <Link href={item.link}>
                      Read More <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
           <div className="mt-12 text-center">
             <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/achievements">View All News</Link>
             </Button>
           </div>
        </div>
      </section>
    </div>
  );
}
