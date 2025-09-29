// Types for the curriculum documents
export interface CurriculumDocument {
    id: number;
    title: string;
    description: string;
    pdfUrl: string;
    category: string;
    createdAt: Date;
    updatedAt: Date;
}
