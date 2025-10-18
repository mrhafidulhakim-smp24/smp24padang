import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getWasteNewsById } from '@/app/admin/banksampah/actions';
import { PDFViewer } from '@/components/pdf-viewer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const revalidate = 3600; // Revalidate at most every hour

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
        <div className="bg-background">
            <div className="container mx-auto max-w-4xl px-4 py-12 md:py-24">
                <Button asChild variant="outline" className="mb-8">
                    <Link href="/sispendik" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        <span>Kembali ke Sispendik</span>
                    </Link>
                </Button>

                {article.googleDriveUrl ? (
                    <PDFViewer
                        url={article.googleDriveUrl}
                        title={article.title}
                        description={article.description}
                    />
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>{article.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">
                                Pratinjau PDF tidak tersedia untuk artikel ini.
                            </p>
                            <div className="prose dark:prose-invert">
                                <p>{article.description}</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}