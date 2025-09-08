
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { VideosTable } from './table';
import { VideoDialog } from './dialog';
import type { videos } from '@/lib/db/schema';

export function Videos({ data }: { data: (typeof videos.$inferSelect)[] }) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<(typeof videos.$inferSelect) | null>(null);

    const openDialog = (video: (typeof videos.$inferSelect) | null = null) => {
        setSelectedVideo(video);
        setDialogOpen(true);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Videos</h1>
                <Button onClick={() => openDialog()}>
                    <PlusCircle className="mr-2" />
                    Add Video
                </Button>
            </div>
            <VideosTable data={data} onEdit={openDialog} />
            <VideoDialog open={dialogOpen} onOpenChange={setDialogOpen} video={selectedVideo} />
        </div>
    );
}
