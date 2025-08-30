import { db } from '@/lib/db';
import { organizationStructures } from '@/lib/db/schema';
import OrganizationStructureList from './_components/organization-list';

const REQUIRED_STRUCTURES = [
    {
        type: 'pimpinan',
        title: 'Struktur Pimpinan Sekolah',
        description: 'Bagan kepengurusan pimpinan di SMPN 24 Padang.',
    },
    {
        type: 'osis',
        title: 'Struktur Organisasi Siswa Intra Sekolah (OSIS)',
        description: 'Bagan kepengurusan OSIS di SMPN 24 Padang.',
    },
    {
        type: 'tu',
        title: 'Struktur Tata Usaha',
        description: 'Bagan kepengurusan tata usaha di SMPN 24 Padang.',
    },
];

export default async function OrganizationAdminPage() {
    const existingStructures = await db.query.organizationStructures.findMany();

    for (const required of REQUIRED_STRUCTURES) {
        const found = existingStructures.some(
            (existing) => existing.type === required.type,
        );

        if (!found) {
            await db.insert(organizationStructures).values(required);
        }
    }

    const allStructures = await db.query.organizationStructures.findMany();

    const orderedStructures = REQUIRED_STRUCTURES.map((required) => {
        const structure = allStructures.find((s) => s.type === required.type);
        return structure!;
    });

    return <OrganizationStructureList initialData={orderedStructures} />;
}
