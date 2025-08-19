import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Target, Users } from "lucide-react";

const faculty = [
  { name: "Dr. Budi Santoso", role: "Principal", initials: "BS" },
  { name: "Siti Rahayu", role: "Head of Academics", initials: "SR" },
  { name: "Agus Wijaya", role: "Science Department Head", initials: "AW" },
  { name: "Dewi Lestari", role: "Arts & Culture Coordinator", initials: "DL" },
  { name: "Eko Prasetyo", role: "Sports Director", initials: "EP" },
  { name: "Fitriani", role: "Student Counselor", initials: "F" },
];

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">
          About Our School
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          A place where tradition meets innovation to create a dynamic learning environment.
        </p>
      </div>

      <section className="mt-16">
        <Card className="overflow-hidden md:grid md:grid-cols-3">
          <div className="relative h-64 md:h-full">
            <Image
              src="https://placehold.co/600x800.png"
              alt="Principal"
              layout="fill"
              objectFit="cover"
              data-ai-hint="professional portrait"
            />
          </div>
          <div className="p-8 md:col-span-2">
            <h2 className="font-headline text-3xl font-bold text-primary">
              A Message from the Principal
            </h2>
            <p className="mt-4 text-foreground/80">
              Welcome to DUAPAT Empat Padang! We are a community dedicated to fostering academic excellence, character development, and a lifelong love of learning. Our commitment is to provide a safe, nurturing, and stimulating environment where every student can thrive and reach their full potential.
            </p>
            <p className="mt-4 text-foreground/80">
              We believe in a holistic approach to education, one that balances academic rigor with artistic expression, athletic achievement, and community service. Our talented and dedicated faculty are here to guide and inspire our students on their educational journey.
            </p>
            <p className="mt-6 font-semibold text-primary">
              Dr. Budi Santoso, Principal
            </p>
          </div>
        </Card>
      </section>

      <section className="mt-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="font-headline text-3xl font-bold text-primary">
              Vision & Mission
            </h2>
            <p className="text-muted-foreground">
              Our guiding principles shape every aspect of life at DUAPAT.
            </p>
          </div>
          <Accordion type="single" collapsible defaultValue="item-1">
            <AccordionItem value="item-1">
              <AccordionTrigger className="font-headline text-xl">
                <Target className="mr-2 h-5 w-5 text-accent" /> Our Vision
              </AccordionTrigger>
              <AccordionContent className="text-base text-foreground/80">
                To be a leading educational institution recognized for empowering students to become compassionate, innovative, and responsible global citizens.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="font-headline text-xl">
                <Book className="mr-2 h-5 w-5 text-accent" /> Our Mission
              </AccordionTrigger>
              <AccordionContent className="text-base text-foreground/80">
                <ul className="list-disc space-y-2 pl-6">
                  <li>To provide a high-quality, comprehensive education that nurtures intellectual curiosity.</li>
                  <li>To foster a culture of respect, integrity, and social responsibility.</li>
                  <li>To equip students with the skills and mindset to succeed in a rapidly changing world.</li>
                  <li>To create a collaborative and inclusive community of students, parents, and educators.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <section className="mt-16">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold text-primary">
            Our Dedicated Faculty & Staff
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
            Meet the experienced educators and staff who guide our students.
          </p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {faculty.map((member) => (
            <div key={member.name} className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={`https://placehold.co/100x100.png`} data-ai-hint="person portrait" />
                <AvatarFallback className="bg-primary/20 text-primary">{member.initials}</AvatarFallback>
              </Avatar>
              <h3 className="mt-4 font-semibold">{member.name}</h3>
              <p className="text-sm text-accent-foreground">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
