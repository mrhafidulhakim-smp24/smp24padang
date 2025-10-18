'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { getPublicWasteDocumentation } from '@/app/admin/banksampah/actions';
import { WasteDocumentationItem } from '@/app/admin/banksampah/page'; // Re-using type
import { YouTubeEmbed, getYouTubeVideoId } from '@/components/youtube-embed'; // Corrected import casing
import SispendikSkeleton from './sispendik-skeleton';
import { PlayCircle } from 'lucide-react';



export default function Tab3_Documentation() {
    const [docs, setDocs] = useState<WasteDocumentationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchDocs = async () => {
            try {
                const docData = await getPublicWasteDocumentation();
                setDocs(docData as WasteDocumentationItem[]);
            } catch (error) {
                console.error("Failed to fetch waste documentation:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDocs();
    }, []);

    const openVideo = (youtubeUrl: string) => {
        setSelectedVideoUrl(youtubeUrl);
    };

    const closeVideo = () => {
        setSelectedVideoUrl(null);
    };

    if (loading) {
        return <SispendikSkeleton />;
    }

    return (
        <div className="space-y-8 pt-6">
            {docs.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                    <p>Belum ada dokumentasi yang dipublikasikan.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {docs.map((item) => {
                        const videoId = item.youtubeUrl ? getYouTubeVideoId(item.youtubeUrl) : null;

                        return (
                            <Card key={item.id} className="overflow-hidden">
                                <CardHeader className="p-0">
                                    <div className="relative w-full h-48 group">
                                        {videoId && item.youtubeUrl ? (
                                            // YouTube Thumbnail
                                            <button onClick={() => openVideo(item.youtubeUrl!)} className="w-full h-full">
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
                                            // Regular Image
                                            <Image
                                                src={item.imageUrl || 'https://placehold.co/600x400.png'}
                                                alt={item.title}
                                                fill
                                                className="object-cover"
                                            />
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
            <Dialog open={!!selectedVideoUrl} onOpenChange={(isOpen) => !isOpen && closeVideo()}>
                <DialogContent className="max-w-3xl p-0">
                    {selectedVideoUrl && (
                        <YouTubeEmbed url={selectedVideoUrl} title="Dokumentasi Bank Sampah" />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}