import { db } from '@/lib/db';
import { videos } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { VideoForm } from '../../video-form';
import { notFound } from 'next/navigation';

export default async function EditVideoPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return notFound();
  }

  const video = await db.query.videos.findFirst({
    where: eq(videos.id, id),
  });

  if (!video) {
    return notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Video</h1>
      <VideoForm video={video} />
    </div>
  );
}
