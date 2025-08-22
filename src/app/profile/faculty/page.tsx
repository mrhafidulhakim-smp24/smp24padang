import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const faculty = [
  { name: "Dr. Budi Santoso", role: "Kepala Sekolah", initials: "BS", image: "https://placehold.co/150x150.png", hint: "man portrait" },
  { name: "Siti Rahayu", role: "Kepala Akademik", initials: "SR", image: "https://placehold.co/150x150.png", hint: "woman portrait" },
  { name: "Agus Wijaya", role: "Kepala Departemen Sains", initials: "AW", image: "https://placehold.co/150x150.png", hint: "man portrait" },
  { name: "Dewi Lestari", role: "Koordinator Seni & Budaya", initials: "DL", image: "https://placehold.co/150x150.png", hint: "woman portrait" },
  { name: "Eko Prasetyo", role: "Direktur Olahraga", initials: "EP", image: "https://placehold.co/150x150.png", hint: "man portrait" },
  { name: "Fitriani", role: "Konselor Siswa", initials: "F", image: "https://placehold.co/150x150.png", hint: "woman portrait" },
  { name: "Joko Susilo", role: "Guru Matematika", initials: "JS", image: "https://placehold.co/150x150.png", hint: "man portrait" },
  { name: "Lina Marlina", role: "Guru Bahasa Inggris", initials: "LM", image: "https://placehold.co/150x150.png", hint: "woman portrait" },
];

export default function FacultyPage() {
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
            <div key={member.name} className="flex flex-col items-center text-center">
              <Avatar className="h-32 w-32 border-4 border-primary/10">
                <AvatarImage src={member.image} data-ai-hint={member.hint} />
                <AvatarFallback className="bg-primary/20 text-3xl font-semibold text-primary">{member.initials}</AvatarFallback>
              </Avatar>
              <h3 className="mt-4 text-xl font-bold text-primary">{member.name}</h3>
              <p className="text-base text-accent-foreground">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
