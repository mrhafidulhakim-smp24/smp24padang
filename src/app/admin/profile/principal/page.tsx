import { db } from '@/lib/db';
import { profiles, pastPrincipals, type PastPrincipal } from '@/lib/db/schema';
import PrincipalForm from './principal-form';
import PastPrincipalsList from '@/components/admin/profile/past-principals-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
    const profileData: Profile | null =
        (await db.query.profiles.findFirst()) || null;
    const pastPrincipalsData = (await db.query.pastPrincipals.findMany()) as PastPrincipal[];
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold">Kelola Profil Sekolah</h1>
                <p className="text-muted-foreground">
                    Perbarui profil sekolah, sejarah, dan riwayat kepala
                    sekolah.
                </p>
            </div>
            <Tabs defaultValue="current" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="current">Profil Saat Ini</TabsTrigger>
                    <TabsTrigger value="history">
                        Riwayat Kepala Sekolah
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="current" className="mt-6">
                    <PrincipalForm initialProfileData={profileData} />
                </TabsContent>
                <TabsContent value="history" className="mt-6">
                    <PastPrincipalsList principals={pastPrincipalsData} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
