import type { Curriculum } from '../types/curriculum';

export async function getCurriculumDocuments(category: string) {
    // Dummy data
    return {
        data: [
            {
                id: 1,
                title: 'Contoh Dokumen',
                description: 'Deskripsi dokumen',
                pdfUrl: 'https://docs.google.com/gview?url=https://example.com/sample.pdf&embedded=true',
                category,
            },
        ],
        error: null,
    };
}

export async function createCurriculumDocument(curriculum: Omit<Curriculum, 'id'>) {
    return { success: true };
}

export async function updateCurriculumDocument(
    id: number,
    curriculum: Omit<Curriculum, 'id'>,
) {
    return { success: true };
}

export async function deleteCurriculumDocument(id: number) {
    return { success: true };
}
