import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, BookMarked, Activity } from "lucide-react";
import Image from "next/image";

export default function AcademicsPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">
          Our Academics
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Fostering intellectual curiosity and a passion for lifelong learning.
        </p>
      </div>

      <Tabs defaultValue="curriculum" className="mt-12 w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="curriculum">
            <BookMarked className="mr-2 h-5 w-5" /> Curriculum
          </TabsTrigger>
          <TabsTrigger value="organization">
            <Building className="mr-2 h-5 w-5" /> Organization
          </TabsTrigger>
          <TabsTrigger value="activities">
            <Activity className="mr-2 h-5 w-5" /> Activities
          </TabsTrigger>
        </TabsList>
        <TabsContent value="curriculum" className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary">
                Comprehensive Curriculum
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-foreground/80">
               <Image src="https://placehold.co/1200x400.png" alt="Curriculum" width={1200} height={400} className="mb-6 w-full rounded-lg object-cover" data-ai-hint="library books" />
              <p>
                Our curriculum is designed to provide a balanced and holistic education, blending rigorous academic standards with creative and practical learning experiences. We follow the national curriculum while incorporating innovative teaching methodologies to cater to diverse learning styles.
              </p>
              <p>
                Core subjects include Mathematics, Science, Languages, and Social Studies, supplemented by a wide range of elective courses in arts, technology, and physical education. We emphasize critical thinking, problem-solving, and collaboration to prepare students for the challenges of the future.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="organization" className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary">
                School Organization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-foreground/80">
              <Image src="https://placehold.co/1200x400.png" alt="Organization" width={1200} height={400} className="mb-6 w-full rounded-lg object-cover" data-ai-hint="school building" />
              <p>
                DUAPAT Empat Padang is structured to create a supportive and efficient learning environment. The school is divided into three main levels: Primary School (Grades 1-6), Middle School (Grades 7-9), and High School (Grades 10-12).
              </p>
              <p>
                Each level is led by a dedicated head, who works closely with a team of experienced educators and support staff. Our administrative body ensures the smooth operation of all school functions, from admissions to student welfare, maintaining open communication with parents and the wider community.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activities" className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary">
                Extracurricular Activities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-foreground/80">
              <Image src="https://placehold.co/1200x400.png" alt="Activities" width={1200} height={400} className="mb-6 w-full rounded-lg object-cover" data-ai-hint="students playing" />
              <p>
                We believe that learning extends beyond the classroom. Our extensive extracurricular program offers students opportunities to explore their interests, develop new skills, and build character.
              </p>
              <p>
                Students can choose from a variety of clubs and activities, including:
              </p>
              <ul className="list-disc pl-6">
                <li><strong>Sports:</strong> Soccer, Basketball, Swimming, and Athletics.</li>
                <li><strong>Arts:</strong> Drama Club, School Choir, Band, and Visual Arts.</li>
                <li><strong>Academic Clubs:</strong> Debate Team, Science Club, and Math Olympiad.</li>
                <li><strong>Community Service:</strong> Volunteering and social outreach programs.</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
