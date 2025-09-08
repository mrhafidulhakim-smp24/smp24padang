import { db } from '@/lib/db';
import { videos } from '@/lib/db/schema';
import { Videos } from '@/components/admin/videos';

async function getVideos() {
    return db.select().from(videos);
}

export default async function VideosPage() {
    const videoData = await getVideos();

    return <Videos data={videoData} />;
}