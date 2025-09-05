import { db } from '@/lib/db';
import { videos } from '@/lib/db/schema';
import { VideoCard } from './_components/video-card';

export default async function GalleryPage() {
  const allVideos = await db.select().from(videos).orderBy(videos.createdAt);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-center text-3xl font-bold tracking-tight md:text-4xl">
        Galeri Video
      </h1>
      {allVideos.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {allVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          <p>Belum ada video yang ditambahkan.</p>
        </div>
      )}
    </main>
  );
}
