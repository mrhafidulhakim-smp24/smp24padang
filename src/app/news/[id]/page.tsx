import { db } from '@/lib/db';
import { news, videos } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { YouTubeEmbed } from '@/components/youtube-embed';

export default async function NewsArticlePage({ params }: { params: { id: string } }) {
  const articleId = params.id;

  const articleData = await db.query.news.findFirst({
    where: eq(news.id, articleId),
    with: {
      video: true,
    },
  });

  if (!articleData) {
    notFound();
  }

  console.log('NewsArticlePage - articleData.video:', articleData.video);

  return (
    <main className="container mx-auto max-w-4xl px-4 py-8">
      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">
            {articleData.title}
          </h1>
          <p className="mt-2 text-muted-foreground">
            Dipublikasikan pada {new Date(articleData.date).toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </header>

        {articleData.imageUrl && (
          <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={articleData.imageUrl}
              alt={articleData.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {articleData.video && (
          <div className="mb-8">
            <YouTubeEmbed url={articleData.video.youtubeUrl} title={articleData.video.title} />
          </div>
        )}

        <div
          className="prose prose-lg max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: articleData.description.replace(/\n/g, '<br />') }}
        />
      </article>
    </main>
  );
}