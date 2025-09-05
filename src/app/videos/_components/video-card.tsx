'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { YouTubeEmbed } from '@/components/youtube-embed';
import Image from 'next/image';

interface VideoCardProps {
  video: {
    id: number;
    title: string;
    description: string | null;
    youtubeUrl: string;
  };
}

// Helper to get thumbnail URL from YouTube URL
const getThumbnailUrl = (youtubeUrl: string) => {
  try {
    const url = new URL(youtubeUrl);
    let videoId = url.searchParams.get('v');
    if (url.hostname === 'youtu.be') {
      videoId = url.pathname.substring(1);
    }
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  } catch {
    return '/placeholder.svg'; // Fallback image
  }
};

export function VideoCard({ video }: VideoCardProps) {
  const thumbnailUrl = getThumbnailUrl(video.youtubeUrl);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="group cursor-pointer overflow-hidden rounded-lg border">
          <div className="relative aspect-video">
            <Image
              src={thumbnailUrl}
              alt={video.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                // In case YouTube thumbnail fails
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
            <div className="absolute inset-0 bg-black/30 transition-opacity duration-300 group-hover:bg-black/10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="h-12 w-12 text-white/80 transition-transform duration-300 group-hover:scale-110"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold line-clamp-2">{video.title}</h3>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{video.title}</DialogTitle>
        </DialogHeader>
        <YouTubeEmbed url={video.youtubeUrl} title={video.title} />
      </DialogContent>
    </Dialog>
  );
}
