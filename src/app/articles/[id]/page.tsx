
import { getWasteNewsById } from '@/app/admin/banksampah/actions';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, ExternalLink } from 'lucide-react';

export default async function ArticlePage({ params }: { params: { id: string } }) {
    const articleId = parseInt(params.id, 10);
    if (isNaN(articleId)) {
        notFound();
    }

    const article = await getWasteNewsById(articleId);

    if (!article) {
        notFound();
    }

    return (
        <div className="container mx-auto py-10">
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <div className="relative w-full h-96 mb-6">
                        <Image
                            src={article.previewUrl || 'https://placehold.co/1200x800.png'}
                            alt={article.title}
                            fill
                            className="object-cover rounded-t-lg"
                        />
                    </div>
                    <CardTitle className="text-4xl font-bold leading-tight">{article.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                        {article.createdAt && (
                            <div className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(article.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            </div>
                        )}
                        {article.googleDriveUrl && (
                             <a href={article.googleDriveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                                <ExternalLink className="h-4 w-4" />
                                <span>Lihat di Google Drive</span>
                            </a>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="prose prose-lg max-w-none">
                    <p>{article.description}</p>
                </CardContent>
            </Card>
        </div>
    );
}
