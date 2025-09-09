import { Card, CardContent } from '@/components/ui/card';
import { getYouTubeThumbnailUrl } from '@/components/youtube-embed';
import type { videos } from '@/lib/db/schema';
import Image from 'next/image';

export function VideoCard({
    video,
    onClick,
}: {
    video: typeof videos.$inferSelect;
    onClick: () => void;
}) {
    const thumbnailUrl = getYouTubeThumbnailUrl(video.youtubeUrl);

    return (
        <div onClick={onClick} className="cursor-pointer group">
            <Card className="overflow-hidden">
                <CardContent className="p-0">
                    {thumbnailUrl ? (
                        <div className="relative aspect-video w-full">
                            <Image
                                src={thumbnailUrl}
                                alt={video.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>
                    ) : (
                        <div className="aspect-video w-full bg-secondary flex items-center justify-center">
                            <p className="text-muted-foreground">
                                No thumbnail
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
            <h3 className="font-semibold text-base mt-2 truncate">
                {video.title}
            </h3>
            {video.description && (
                <p className="text-sm text-muted-foreground mt-1 truncate">
                    {video.description}
                </p>
            )}
        </div>
    );
}
