import { db } from '@/lib/db';
import { profiles } from '@/lib/db/schema';
import PrincipalForm from './principal-form';

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

  return (
    <PrincipalForm initialProfileData={profileData} />
  );
}
