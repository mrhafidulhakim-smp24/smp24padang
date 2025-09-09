import { db } from '@/lib/db';
import { videos } from '@/lib/db/schema';
import dynamic from 'next/dynamic';

// Dynamically import Videos component with SSR disabled
const Videos = dynamic(() => import('@/components/admin/videos').then(mod => mod.Videos), { ssr: false });

export async function getVideos() {
    try {
        return db.select().from(videos);
    } catch (error) {
        console.error('Error fetching videos:', error);
        return [];
    }
}

export default async function VideosPage() {
    const videoData = await getVideos();

    return <Videos data={videoData} />;
}