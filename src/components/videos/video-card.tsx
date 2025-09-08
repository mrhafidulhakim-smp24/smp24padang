import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { YoutubeEmbed } from '@/components/youtube-embed';
import type { videos } from '@/lib/db/schema';

export function VideoCard({ video }: { video: typeof videos.$inferSelect }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{video.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <YoutubeEmbed url={video.youtubeUrl} />
                <p className="mt-4">{video.description}</p>
            </CardContent>
        </Card>
    );
}