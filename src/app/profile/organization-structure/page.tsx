
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type OrgMember = {
  id: string;
  name: string;
  position: string;
  category: "Kepemimpinan Sekolah" | "Staf Tata Usaha" | "Pembina OSIS";
  initials: string;
  image: string;
  hint: string;
};

// Data ini seharusnya diambil dari CMS/database di aplikasi nyata.
const orgMembers: OrgMember[] = [
  { id: "1", name: "Dr. Budi Santoso, M.Pd.", position: "Kepala Sekolah", category: "Kepemimpinan Sekolah", initials: "BS", image: "https://placehold.co/150x150.png", hint: "man portrait" },
  { id: "2", name: "Siti Rahayu, S.Pd.", position: "Wakil Kepala Sekolah Bidang Akademik", category: "Kepemimpinan Sekolah", initials: "SR", image: "https://placehold.co/150x150.png", hint: "woman portrait" },
  { id: "3", name: "Agus Wijaya, M.Pd.", position: "Wakil Kepala Sekolah Bidang Kesiswaan", category: "Kepemimpinan Sekolah", initials: "AW", image: "https://placehold.co/150x150.png", hint: "man portrait" },
  { id: "4", name: "Joko Susilo, S.Kom", position: "Kepala Tata Usaha", category: "Staf Tata Usaha", initials: "JS", image: "https://placehold.co/150x150.png", hint: "man portrait" },
  { id: "5", name: "Dewi Lestari, A.Md.", position: "Staf Administrasi", category: "Staf Tata Usaha", initials: "DL", image: "https://placehold.co/150x150.png", hint: "woman portrait" },
  { id: "6", name: "Eko Prasetyo, S.Or.", position: "Pembina OSIS", category: "Pembina OSIS", initials: "EP", image: "https://placehold.co/150x150.png", hint: "man portrait" },
  { id: "7", name: "Fitriani, S.Psi.", position: "Sekretaris OSIS", category: "Pembina OSIS", initials: "F", image: "https://placehold.co/150x150.png", hint: "woman portrait" },
];

const groupByCategory = (members: OrgMember[]) => {
  return members.reduce((acc, member) => {
    (acc[member.category] = acc[member.category] || []).push(member);
    return acc;
  }, {} as Record<string, OrgMember[]>);
};

export default function OrganizationStructurePage() {
  const groupedMembers = groupByCategory(orgMembers);
  const categories = Object.keys(groupedMembers);

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">
          Struktur Organisasi
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Mengenal kepemimpinan, staf, dan pengurus organisasi di SMPN 24 Padang.
        </p>
      </div>

      <div className="mt-16 space-y-16">
        {categories.map((category) => (
          <section key={category}>
            <h2 className="font-headline mb-8 text-center text-3xl font-bold text-primary">
              {category}
            </h2>
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {groupedMembers[category].map((member) => (
                <div key={member.id} className="flex flex-col items-center text-center">
                  <Avatar className="h-32 w-32 border-4 border-primary/10">
                    <AvatarImage src={member.image} data-ai-hint={member.hint} alt={member.name} />
                    <AvatarFallback className="bg-primary/20 text-3xl font-semibold text-primary">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="mt-4 text-xl font-bold text-primary">{member.name}</h3>
                  <p className="font-semibold text-base text-accent-foreground">{member.position}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
