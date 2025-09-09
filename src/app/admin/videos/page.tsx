import { db } from '@/lib/db';
import { videos } from '@/lib/db/schema';
import { Videos } from '@/components/admin/videos';

async function getVideos() {
    try {
        return db.select().from(videos);
    } catch (error) {
        console.error('Error fetching videos:', error);
        throw new Error('Failed to fetch videos.');
    }
}

export default async function VideosPage() {
    const videoData = await getVideos();

    return <Videos data={videoData} />;
}