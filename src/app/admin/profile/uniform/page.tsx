import type { Metadata } from 'next';
import { getUniforms } from '@/app/profile/uniform/actions';
import { getUniformPageDescription } from './actions';
import UniformList from './uniform-list';

export const metadata: Metadata = {
    title: 'Kelola Seragam Sekolah | Admin SMPN 24 Padang',
    description:
        'Halaman administrasi untuk mengelola informasi seragam sekolah SMPN 24 Padang.',
};

export const dynamic = 'force-dynamic';

export default async function AdminUniformPage() {
    const uniforms = await getUniforms();
    const uniformPageDescription = await getUniformPageDescription();

    return (
        <div className="container mx-auto px-4 py-12 md:py-24">
            <div className="text-center">
                <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">
                    Kelola Seragam Sekolah
                </h1>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                    {uniformPageDescription || 'Perbarui gambar dan deskripsi untuk setiap seragam.'}
                </p>
            </div>
            <div className="mt-16">
                <UniformList initialUniformsData={uniforms} />
            </div>
        </div>
    );
}
