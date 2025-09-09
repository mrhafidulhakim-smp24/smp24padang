
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { VideosTable } from './table';
import { VideoDialog } from './dialog';
import type { videos } from '@/lib/db/schema';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { deleteVideo } from '@/app/admin/videos/actions';
import { getVideos } from '@/app/admin/videos/page';

export function Videos({ data: initialData }: { data: (typeof videos.$inferSelect)[] }) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<(typeof videos.$inferSelect) | null>(null);
    const [isDeleteOpen, setDeleteOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const [videosData, setVideosData] = useState(initialData);

    const openDialog = (video: (typeof videos.$inferSelect) | null = null) => {
        setSelectedVideo(video);
        setDialogOpen(true);
    };

    const handleDelete = () => {
        if (!selectedVideo) return;
        startTransition(async () => {
            const result = await deleteVideo(selectedVideo.id);
            if (result.success) {
                toast({ title: 'Sukses!', description: result.message });
                setVideosData(videosData.filter((v) => v.id !== selectedVideo.id));
                setDeleteOpen(false);
                setSelectedVideo(null);
            } else {
                toast({
                    title: 'Gagal',
                    description: result.message,
                    variant: 'destructive',
                });
            }
        });
    };

    const refreshVideos = () => {
        getVideos().then((data) => setVideosData(data));
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold">
                            Kelola Video
                        </CardTitle>
                        <CardDescription className="mt-2 text-lg">
                            Tambah, edit, atau hapus data video.
                        </CardDescription>
                    </div>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => openDialog()}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Tambah Video
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <VideoDialog
                                open={dialogOpen}
                                onOpenChange={(isOpen) => {
                                    setDialogOpen(isOpen);
                                    if (!isOpen) {
                                        setSelectedVideo(null);
                                        refreshVideos();
                                    }
                                }}
                                video={selectedVideo}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                <div className="border rounded-lg overflow-hidden">
                    <VideosTable
                        data={videosData}
                        onEdit={openDialog}
                        onDelete={(id) => {
                            setSelectedVideo(videosData.find(v => v.id === id) || null);
                            setDeleteOpen(true);
                        }}
                    />
                </div>
            </CardContent>

            <AlertDialog open={isDeleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Ini akan
                            menghapus data video secara permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => setSelectedVideo(null)}
                        >
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={isPending}
                        >
                            {isPending ? 'Menghapus...' : 'Hapus'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
}

