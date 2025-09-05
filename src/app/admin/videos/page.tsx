import { db } from '@/lib/db';
import { videos } from '@/lib/db/schema';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { deleteVideo } from './actions';

function DeleteVideoButton({ id }: { id: number }) {
    return (
        <form action={async () => {
            "use server";
            await deleteVideo(id);
        }}>
            <Button variant="destructive" size="sm">
                Delete
            </Button>
        </form>
    );
}

export default async function VideosPage() {
    const allVideos = await db.select().from(videos);

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Videos</h1>
                <Button asChild>
                    <Link href="/admin/videos/new">Add New Video</Link>
                </Button>
            </div>
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>YouTube URL</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allVideos.map((video) => (
                            <TableRow key={video.id}>
                                <TableCell className="font-medium">
                                    {video.title}
                                </TableCell>
                                <TableCell>{video.youtubeUrl}</TableCell>
                                <TableCell>
                                    {video.createdAt.toDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex gap-2 justify-end">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                        >
                                            <Link
                                                href={`/admin/videos/${video.id}/edit`}
                                            >
                                                Edit
                                            </Link>
                                        </Button>
                                        <DeleteVideoButton id={video.id} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
