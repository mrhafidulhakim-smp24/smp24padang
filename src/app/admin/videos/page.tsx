import { getVideos } from './actions';
import VideosClient from './videos-client';

export default async function VideosPage() {
    const result = await getVideos();

    // Handle potential error during server-side fetch
    if (result.error) {
        return (
            <div className="text-center text-red-500">
                <p>Error fetching videos: {result.error}</p>
            </div>
        );
    }

    return <VideosClient initialVideos={result.videos || []} />;
}
