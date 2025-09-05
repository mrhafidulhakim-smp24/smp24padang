'use client';

import { useState, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
import { MoreHorizontal, Pencil, PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/db';
import { videos } from '@/lib/db/schema';
import { createVideo, updateVideo, deleteVideo } from './actions';
import { VideoForm } from './video-form';
import type { InferSelectModel } from 'drizzle-orm';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

type Video = InferSelectModel<typeof videos>;

// This is a new function to fetch videos on the client side
async function getVideos(): Promise<Video[]> {
    // This is a workaround to fetch data in a client component.
    // Ideally, you would pass server-fetched data as a prop.
    const allVideos = await db.select().from(videos);
    return allVideos;
}

export default function VideosPage() {
    const [allVideos, setAllVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialog, setDialog] = useState<'add' | 'edit' | 'delete' | null>(null);
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const fetchData = async () => {
        setLoading(true);
        // In a real app, you'd fetch this from your API
        // For this example, we simulate a fetch.
        try {
            const data = await getVideos();
            setAllVideos(data);
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to fetch videos', variant: 'destructive' });
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCloseDialog = (refresh = false) => {
        setDialog(null);
        setSelectedVideo(null);
        if (refresh) {
            fetchData();
        }
    };

    const handleDelete = () => {
        if (!selectedVideo) return;
        startTransition(async () => {
            const result = await deleteVideo(selectedVideo.id);
            if (!result.error) {
                toast({ title: 'Success!', description: result.message });
                handleCloseDialog(true);
            } else {
                toast({ title: 'Error', description: result.error, variant: 'destructive' });
            }
        });
    };

    const boundUpdateVideo = selectedVideo
        ? updateVideo.bind(null, selectedVideo.id)
        : (prevState: any, formData: FormData): Promise<{ message: string; error?: string }> =>
              Promise.resolve({ message: "", error: "No video selected" });

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Videos</h1>
                <Button onClick={() => setDialog('add')}><PlusCircle className="mr-2 h-4 w-4" /> Add New Video</Button>
            </div>
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>YouTube URL</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={4} className="h-24 text-center">Loading...</TableCell></TableRow>
                        ) : allVideos.length > 0 ? (
                            allVideos.map((video) => (
                                <TableRow key={video.id}>
                                    <TableCell className="font-medium">{video.title}</TableCell>
                                    <TableCell><a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{video.youtubeUrl}</a></TableCell>
                                    <TableCell>{new Date(video.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => { setSelectedVideo(video); setDialog('edit'); }}><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-500" onClick={() => { setSelectedVideo(video); setDialog('delete'); }}><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow><TableCell colSpan={4} className="h-24 text-center">No videos found.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Dialogs */}
            <Dialog open={dialog === 'add' || dialog === 'edit'} onOpenChange={() => handleCloseDialog()}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{dialog === 'add' ? 'Add New Video' : 'Edit Video'}</DialogTitle>
                    </DialogHeader>
                    <VideoForm
                        action={dialog === 'add' ? createVideo : boundUpdateVideo}
                        initialData={dialog === 'edit' ? selectedVideo : null}
                        onClose={() => handleCloseDialog(true)}
                    />
                </DialogContent>
            </Dialog>

            <AlertDialog open={dialog === 'delete'} onOpenChange={() => handleCloseDialog()}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>This action will permanently delete the video and cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={isPending} className="bg-destructive hover:bg-destructive/90">
                            {isPending ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}