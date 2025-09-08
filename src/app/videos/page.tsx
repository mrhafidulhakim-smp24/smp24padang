import { db } from '@/lib/db';
import { videos } from '@/lib/db/schema';
import { VideoCard } from '@/components/videos/video-card';

async function getVideos() {
    return db.select().from(videos);
}

export default async function VideosPage() {
    const videoData = await getVideos();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Videos</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {videoData.map((video) => (
                    <VideoCard key={video.id} video={video} />
                ))}
            </div>
        </div>
    );
}