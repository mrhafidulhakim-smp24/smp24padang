import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const OrganizationMember = ({ name, role, image, hint, initials, children, level = 0 }) => (
  <div className={`flex flex-col items-center ${level > 0 ? 'mt-8' : ''}`}>
    <Card className="w-64 text-center">
      <CardHeader className="items-center">
        <Avatar className="h-24 w-24 border-4 border-primary/20">
          <AvatarImage src={image} data-ai-hint={hint} />
          <AvatarFallback className="bg-primary/20 text-2xl font-semibold text-primary">{initials}</AvatarFallback>
        </Avatar>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-lg font-bold text-primary">{name}</CardTitle>
        <p className="text-sm text-accent-foreground">{role}</p>
      </CardContent>
    </Card>
    {children && (
      <>
        <div className="h-8 w-px bg-border" />
        <div className="flex justify-center gap-8">
          {children}
        </div>
      </>
    )}
  </div>
);

export default function OrganizationStructurePage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">
          Struktur Organisasi
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Hirarki kepemimpinan dan manajemen di SMPN 24 Padang.
        </p>
      </div>

      <section className="mt-16 flex flex-col items-center">
        <OrganizationMember
          name="Dr. Budi Santoso"
          role="Kepala Sekolah"
          image="https://placehold.co/150x150.png"
          hint="man portrait"
          initials="BS"
        >
          <OrganizationMember
            name="Siti Rahayu"
            role="Wakil Kepala Sekolah Bidang Akademik"
            image="https://placehold.co/150x150.png"
            hint="woman portrait"
            initials="SR"
            level={1}
          />
          <OrganizationMember
            name="Agus Wijaya"
            role="Wakil Kepala Sekolah Bidang Kesiswaan"
            image="https://placehold.co/150x150.png"
            hint="man portrait"
            initials="AW"
            level={1}
          />
          <OrganizationMember
            name="Dewi Lestari"
            role="Kepala Tata Usaha"
            image="https://placehold.co/150x150.png"
            hint="woman portrait"
            initials="DL"
            level={1}
          />
        </OrganizationMember>
      </section>
    </div>
  );
}
