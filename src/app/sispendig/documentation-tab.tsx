"use client";

import SkeletonLoader from "@/components/skeleton-loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { YouTubeEmbed, getYouTubeVideoId } from "@/components/youtube-embed";
import { PlayCircle, ZoomIn } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSispendigPublicStore } from "./store";

export default function DocumentationTab() {
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<{
    title: string;
    imageUrl: string | null;
  } | null>(null);
  const docs = useSispendigPublicStore((state) => state.documentation);
  const loadingDocumentation = useSispendigPublicStore((state) => state.loadingDocumentation);
  const loadDocumentation = useSispendigPublicStore((state) => state.loadDocumentation);

  useEffect(() => {
    void loadDocumentation();
  }, [loadDocumentation]);

  if (loadingDocumentation || docs === null) {
    return <SkeletonLoader />;
  }

  return (
    <div className="space-y-6 pt-5 sm:space-y-8 sm:pt-6">
      {docs.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">
          <p>Belum ada dokumentasi yang dipublikasikan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {docs.map((item) => {
            const videoId = item.youtubeUrl
              ? getYouTubeVideoId(item.youtubeUrl)
              : null;

            return (
              <Card key={item.id} className="overflow-hidden">
                <CardHeader className="p-0">
                  <div className="relative w-full aspect-[4/3] group">
                    {videoId && item.youtubeUrl ? (
                      // YouTube Thumbnail
                      <button
                        onClick={() => setSelectedVideoUrl(item.youtubeUrl!)}
                        className="w-full h-full"
                        aria-label={`Putar video ${item.title}`}
                      >
                        <Image
                          src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                          <PlayCircle className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </button>
                    ) : (
                      // Regular Image with Popup
                      <button
                        onClick={() => item.imageUrl && setSelectedItem(item)}
                        className="w-full h-full text-left"
                        aria-label={`Lihat dokumentasi ${item.title}`}
                      >
                        <Image
                          src={
                            item.imageUrl || "https://placehold.co/600x400.png"
                          }
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <ZoomIn className="w-12 h-12 text-white" />
                        </div>
                      </button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="truncate">{item.title}</CardTitle>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Video Player Dialog */}
      <Dialog
        open={!!selectedVideoUrl}
        onOpenChange={(isOpen) => !isOpen && setSelectedVideoUrl(null)}
      >
        <DialogContent className="max-w-7xl p-0">
          {selectedVideoUrl && (
            <YouTubeEmbed
              url={selectedVideoUrl}
              title="Dokumentasi Bank Sampah"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Image Viewer Dialog */}
      <Dialog
        open={!!selectedItem}
        onOpenChange={(isOpen) => !isOpen && setSelectedItem(null)}
      >
        <DialogContent className="max-w-5xl p-4">
          {selectedItem && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{selectedItem.title}</h3>
              <div className="relative w-full h-auto">
                <Image
                  src={selectedItem.imageUrl || "https://placehold.co/1920x1080.png"}
                  alt={selectedItem.title}
                  width={1920}
                  height={1080}
                  className="object-contain w-full h-auto rounded-lg"
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
