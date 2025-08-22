import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BackupReminderForm } from "@/components/admin/backup-reminder-form";
import { Newspaper, Trophy, ImageIcon, Users, Wrench } from "lucide-react";
import Link from "next/link";

const dashboardItems = [
  {
    title: "Berita & Pengumuman",
    description: "Kelola artikel berita dan pengumuman sekolah.",
    icon: <Newspaper className="h-8 w-8 text-accent" />,
    link: "/admin/news",
  },
  {
    title: "Prestasi Siswa",
    description: "Publikasikan dan perbarui prestasi siswa.",
    icon: <Trophy className="h-8 w-8 text-accent" />,
    link: "/achievements",
  },
  {
    title: "Galeri Sekolah",
    description: "Tambah dan atur gambar di galeri.",
    icon: <ImageIcon className="h-8 w-8 text-accent" />,
    link: "/gallery",
  },
  {
    title: "Staf & Fakultas",
    description: "Kelola profil guru dan staf sekolah.",
    icon: <Users className="h-8 w-8 text-accent" />,
    link: "/profile/faculty",
  },
];


export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">
          Admin Dashboard
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Kelola konten dan utilitas situs web.
        </p>
      </div>

      <div className="mt-16">
        <h2 className="mb-8 font-headline text-2xl font-bold text-primary md:text-3xl">
          Manajemen Konten
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {dashboardItems.map((item) => (
            <Link href={item.link} key={item.title}>
              <Card className="h-full transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                  {item.icon}
                  <CardTitle className="font-headline text-xl text-primary">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

       <div className="mt-16">
         <h2 className="mb-8 font-headline text-2xl font-bold text-primary md:text-3xl">
          Utilitas
        </h2>
        <div className="flex justify-center">
          <BackupReminderForm />
        </div>
      </div>
    </div>
  );
}
