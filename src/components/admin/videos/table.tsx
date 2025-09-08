
'use client';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2 } from 'lucide-react';
import { deleteVideo } from '@/app/admin/videos/actions';
import type { videos } from '@/lib/db/schema';

export function VideosTable({ data, onEdit }: { data: (typeof videos.$inferSelect)[], onEdit: (video: typeof videos.$inferSelect) => void }) {
    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this video?')) {
            await deleteVideo(id);
        }
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((video) => (
                    <TableRow key={video.id}>
                        <TableCell>{video.title}</TableCell>
                        <TableCell>{video.description}</TableCell>
                        <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => onEdit(video)}>
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(video.id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
