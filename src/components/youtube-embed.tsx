import React from 'react';

interface YouTubeEmbedProps {
  url: string;
  title: string;
}

export const getYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    let videoId: string | null = null;

    if (urlObj.hostname.includes('youtube.com')) {
      if (urlObj.pathname.includes('/watch')) {
        videoId = urlObj.searchParams.get('v');
      } else if (urlObj.pathname.includes('/embed/')) {
        videoId = urlObj.pathname.split('/embed/')[1].split('/')[0];
      } else if (urlObj.pathname.includes('/live/')) {
        videoId = urlObj.pathname.split('/live/')[1].split('/')[0];
      }
    } else if (urlObj.hostname === 'youtu.be') {
      videoId = urlObj.pathname.slice(1).split('/')[0];
    }

    return videoId;
  } catch (error) {
    console.error('Invalid YouTube URL', error);
    return null;
  }
};

export const getYouTubeThumbnailUrl = (url: string) => {
  const videoId = getYouTubeVideoId(url);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  return null;
};

const getEmbedUrl = (url: string) => {
  const videoId = getYouTubeVideoId(url);
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return null;
};

export function YouTubeEmbed({ url, title }: YouTubeEmbedProps) {
  const embedUrl = getEmbedUrl(url);

  if (!embedUrl) {
    return <p className="text-red-500">Link YouTube tidak valid.</p>;
  }

  return (
    <div className="aspect-video w-full">
      <iframe
        src={embedUrl}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full rounded-lg"
      ></iframe>
    </div>
  );
}