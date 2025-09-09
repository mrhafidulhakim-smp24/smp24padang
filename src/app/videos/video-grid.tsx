'use client';

import { useState } from 'react';
import type { videos } from '@/lib/db/schema';
import { VideoCard } from '@/components/videos/video-card';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { YouTubeEmbed } from '@/components/youtube-embed';

type Video = typeof videos.$inferSelect;

export function VideoGrid({ videos }: { videos: Video[] }) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onClick={() => setSelectedVideo(video)}
          />
        ))}
      </div>

      <Dialog open={!!selectedVideo} onOpenChange={(isOpen) => !isOpen && setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl w-full h-auto aspect-video p-0 border-0">
          {selectedVideo && (
            <YouTubeEmbed url={selectedVideo.youtubeUrl} title={selectedVideo.title} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}