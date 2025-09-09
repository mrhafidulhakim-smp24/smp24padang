import { db } from '@/lib/db';
import { videos } from '@/lib/db/schema';
import { VideoGrid } from './video-grid';

async function getVideos() {
    return db.select().from(videos);
}

export default async function VideosPage() {
    const videoData = await getVideos();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">
                Galeri Video
            </h1>
            <VideoGrid videos={videoData} />
        </div>
    );
}
