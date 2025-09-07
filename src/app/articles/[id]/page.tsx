import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Calendar, UserCircle } from 'lucide-react';
import { db } from '@/lib/db';
import { news } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getAllNewsIds } from '../../actions';

export const revalidate = 3600; // Revalidate at most every hour

export async function generateStaticParams() {
    const newsIds = await getAllNewsIds();
    return newsIds;
}

async function getNewsArticle(id: string) {
    try {
        const article = await db
            .select()
            .from(news)
            .where(eq(news.id, id))
            .limit(1);
        return article[0] || null;
    } catch (error) {
        console.error('Error fetching news article:', error);
        return null;
    }
}

export default async function NewsArticlePage({
    params,
}: {
    params: { id: string };
}) {
    const article = await getNewsArticle(params.id);

    if (!article) {
        notFound();
    }

    const paragraphs = article.description
        .split('\n')
        .filter((p) => p.trim() !== '');

    return (
        <div className="bg-background">
            <div className="container mx-auto max-w-4xl px-4 py-12 md:py-24">
                <article className="prose prose-lg dark:prose-invert mx-auto">
                    <div className="relative mb-8 w-full aspect-video overflow-hidden rounded-lg">
                        <Image
                            src={
                                article.imageUrl ||
                                'https://placehold.co/1200x675.png'
                            }
                            alt={article.title}
                            fill
                            className="object-cover"
                        />
                    </div>

                    <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary mb-4">
                        {article.title}
                    </h1>

                    <div className="flex items-center gap-6 text-muted-foreground text-sm mb-8">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                                {new Date(article.date).toLocaleDateString(
                                    'id-ID',
                                    {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    },
                                )}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <UserCircle className="h-4 w-4" />
                            <span>Oleh: Admin Sekolah</span>
                        </div>
                    </div>

                    <div className="space-y-6 text-foreground/90 dark:text-foreground/80 md:text-xl">
                        {paragraphs.map((p, index) => (
                            <p key={index}>{p}</p>
                        ))}
                    </div>
                </article>
            </div>
        </div>
    );
}
