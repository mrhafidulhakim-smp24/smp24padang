import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

const achievements = [
  {
    title: "National Science Olympiad Winner",
    student: "Andi Pratama",
    description: "Secured the gold medal in the National Science Olympiad, showcasing exceptional talent in Physics.",
    image: "https://placehold.co/600x400.png",
    hint: "science award",
  },
  {
    title: "Regional Basketball Champions",
    student: "School Team",
    description: "Our basketball team clinched the regional championship title after an undefeated season.",
    image: "https://placehold.co/600x400.png",
    hint: "basketball team",
  },
  {
    title: "International Art Competition Finalist",
    student: "Citra Lestari",
    description: "Recognized for her outstanding painting in the 'Future Visions' international art competition.",
    image: "https://placehold.co/600x400.png",
    hint: "art painting",
  },
  {
    title: "Top School Award for Eco-Initiatives",
    student: "School Achievement",
    description: "Awarded for our commitment to sustainability and environmental education programs.",
    image: "https://placehold.co/600x400.png",
    hint: "eco award",
  },
  {
    title: "National Debate Tournament Runner-Up",
    student: "Debate Club",
    description: "Our debate team demonstrated exceptional critical thinking and oratory skills, securing the second position nationally.",
    image: "https://placehold.co/600x400.png",
    hint: "debate trophy",
  },
];

export default function AchievementsPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">
          Hall of Fame
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Celebrating the remarkable achievements of our students and faculty.
        </p>
      </div>

      <div className="mt-12">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {achievements.map((achievement, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="h-full overflow-hidden transition-shadow duration-300 hover:shadow-xl">
                    <CardHeader className="p-0">
                       <Image
                        src={achievement.image}
                        alt={achievement.title}
                        width={600}
                        height={400}
                        className="h-56 w-full object-cover"
                        data-ai-hint={achievement.hint}
                      />
                    </CardHeader>
                    <CardContent className="flex h-[14rem] flex-col p-6">
                      <p className="text-sm font-semibold text-accent-foreground">{achievement.student}</p>
                      <CardTitle className="font-headline mt-1 text-xl text-primary">
                        {achievement.title}
                      </CardTitle>
                      <p className="mt-2 flex-grow text-foreground/80">{achievement.description}</p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="ml-12 hidden sm:flex" />
          <CarouselNext className="mr-12 hidden sm:flex" />
        </Carousel>
      </div>
    </div>
  );
}
