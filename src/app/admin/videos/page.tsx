import { db } from '@/lib/db';
import { videos } from '@/lib/db/schema';
import { Videos } from '@/components/admin/videos'; // Import the main Videos component
import { InferSelectModel } from 'drizzle-orm';

type Video = InferSelectModel<typeof videos>;

export default async function VideosPage() {
    let videoData: Video[] = [];
    try {
        videoData = await db.query.videos.findMany();
    } catch (error) {
        console.error('Error fetching videos:', error);
        // Optionally, handle the error more gracefully, e.g., display an error message to the user
    }

    return (
        <div className="container mx-auto py-10">
            <Videos data={videoData} />
        </div>
    );
}
