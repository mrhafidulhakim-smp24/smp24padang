import { desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { documents } from '@/lib/db/schema/documents';

type DocumentInput = {
    title: string;
    description: string;
    pdfUrl: string;
    category: string;
};

export async function getDocuments(category?: string) {
    try {
        const result = await db
            .select()
            .from(documents)
            .where(category ? eq(documents.category, category) : undefined)
            .orderBy(desc(documents.createdAt));

        return { data: result, error: null };
    } catch (error) {
        console.error('Error fetching documents:', error);
        return { data: null, error: 'Failed to fetch documents' };
    }
}

export async function createDocument(input: DocumentInput) {
    try {
        const result = await db
            .insert(documents)
            .values({
                title: input.title,
                description: input.description,
                pdfUrl: input.pdfUrl,
                category: input.category,
            })
            .returning();

        return { data: result[0], error: null };
    } catch (error) {
        console.error('Error creating document:', error);
        return { data: null, error: 'Failed to create document' };
    }
}

export async function updateDocument(
    id: number,
    input: Partial<DocumentInput>,
) {
    try {
        const result = await db
            .update(documents)
            .set({
                ...input,
                updatedAt: new Date(),
            })
            .where(eq(documents.id, id))
            .returning();

        return { data: result[0], error: null };
    } catch (error) {
        console.error('Error updating document:', error);
        return { data: null, error: 'Failed to update document' };
    }
}

export async function deleteDocument(id: number) {
    try {
        await db.delete(documents).where(eq(documents.id, id));
        return { error: null };
    } catch (error) {
        console.error('Error deleting document:', error);
        return { error: 'Failed to delete document' };
    }
}
