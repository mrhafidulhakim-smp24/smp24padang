
import Image from "next/image";
import { getStaff } from "./actions";


export default async function FacultyPage() {
  const faculty = await getStaff();

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">
          Guru & Staf
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Temui para pendidik dan staf berpengalaman yang berdedikasi untuk membimbing siswa kami.
        </p>
      </div>

      <section className="mt-16">
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {faculty.map((member) => (
            <div key={member.id} className="flex flex-col items-center text-center group">
              <div className="relative h-40 w-40 overflow-hidden rounded-full shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl">
                <Image 
                  src={member.imageUrl || "https://placehold.co/150x150.png"}
                  alt={member.name} 
                  fill
                  objectFit="cover"
                  data-ai-hint={member.hint || "portrait"}
                />
              </div>
              <h3 className="mt-4 text-xl font-bold text-primary">{member.name}</h3>
              <p className="font-semibold text-base text-accent">{member.position}</p>
              <p className="text-sm text-muted-foreground">{member.subject}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
