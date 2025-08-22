
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Newspaper, Trophy, ImageIcon, Users, BookOpen } from "lucide-react";
import Link from "next/link";
import { BackupReminderForm } from "@/components/admin/backup-reminder-form";

const dashboardItems = [
  {
    title: "Kelola Berita",
    description: "Tambah, edit, atau hapus artikel berita dan pengumuman.",
    icon: <Newspaper className="h-8 w-8 text-primary" />,
    link: "/admin/news",
  },
  {
    title: "Kelola Prestasi",
    description: "Perbarui daftar prestasi siswa dan sekolah.",
    icon: <Trophy className="h-8 w-8 text-primary" />,
    link: "/admin/achievements",
  },
  {
    title: "Kelola Galeri",
    description: "Unggah dan atur gambar di galeri sekolah.",
    icon: <ImageIcon className="h-8 w-8 text-primary" />,
    link: "/admin/gallery",
  },
  {
    title: "Kelola Guru & Staf",
    description: "Kelola profil para pendidik dan staf.",
    icon: <Users className="h-8 w-8 text-primary" />,
    link: "/admin/staff",
  },
];


export default function AdminPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold text-primary md:text-4xl">
          Dasbor Admin
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Selamat datang! Kelola konten situs Anda dari sini.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dashboardItems.map((item) => (
          <Link href={item.link} key={item.title}>
            <Card className="flex h-full flex-col transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                <div className="rounded-lg bg-primary/10 p-3">
                  {item.icon}
                </div>
                <CardTitle className="font-headline text-xl text-primary">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      
       <div>
         <h2 className="mb-6 font-headline text-2xl font-bold text-primary">
          Utilitas AI
        </h2>
        <div>
          <BackupReminderForm />
        </div>
      </div>
    </div>
  );
}
