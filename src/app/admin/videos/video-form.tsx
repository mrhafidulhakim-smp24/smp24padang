'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { videoSchema } from './schema';
import { type videos as Video } from '@/lib/db/schema';
import { createVideo, updateVideo } from './actions';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

type VideoFormValues = z.infer<typeof videoSchema>;

export function VideoForm({ video }: { video?: Video }) {
  const { toast } = useToast();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VideoFormValues>({
    resolver: zodResolver(videoSchema),
    defaultValues: video || {
      title: '',
      description: '',
      youtubeUrl: '',
    },
  });

  const onSubmit = async (data: VideoFormValues) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description || '');
    formData.append('youtubeUrl', data.youtubeUrl);

    const action = video ? updateVideo.bind(null, video.id) : createVideo;
    const result = await action(formData);

    if (result?.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred.',
      });
    } else {
      toast({
        title: 'Success',
        description: `Video ${video ? 'updated' : 'created'} successfully.`,
      });
      router.push('/admin/videos');
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register('title')} />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register('description')} />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
      </div>
      <div>
        <Label htmlFor="youtubeUrl">YouTube URL</Label>
        <Input id="youtubeUrl" {...register('youtubeUrl')} />
        {errors.youtubeUrl && <p className="text-red-500 text-sm">{errors.youtubeUrl.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : video ? 'Update' : 'Create'}
      </Button>
    </form>
  );
}
