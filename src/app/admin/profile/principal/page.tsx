import { db } from '@/lib/db';
import { profiles, pastPrincipals } from '@/lib/db/schema';
import PrincipalForm from './principal-form';
import PastPrincipalsList from './_components/past-principals-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Profile = {
  id: string;
  principalName: string;
  principalWelcome: string;
  principalImageUrl: string | null;
  history: string;
  vision: string;
  mission: string;
};

export default async function PrincipalProfilePage() {
  const profileData: Profile | null = await db.query.profiles.findFirst() || null;
  const pastPrincipalsData = await db.query.pastPrincipals.findMany();

  return (
    <div className="flex flex-col gap-8">
        <div>
            <h1 className="font-headline text-3xl font-bold text-primary md:text-4xl">Kelola Profil Sekolah</h1>
            <p className="mt-2 text-lg text-muted-foreground">
                Perbarui profil sekolah, sejarah, dan riwayat kepala sekolah.
            </p>
        </div>
        <Tabs defaultValue="current">
            <TabsList>
                <TabsTrigger value="current">Profil Saat Ini</TabsTrigger>
                <TabsTrigger value="history">Riwayat Kepala Sekolah</TabsTrigger>
            </TabsList>
            <TabsContent value="current">
                <PrincipalForm initialProfileData={profileData} />
            </TabsContent>
            <TabsContent value="history">
                <PastPrincipalsList initialData={pastPrincipalsData} />
            </TabsContent>
        </Tabs>
    </div>
  );
}