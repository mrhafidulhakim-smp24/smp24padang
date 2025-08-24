
"use client";

import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { getAcademics, updateAcademics } from './actions';
import { AcademicDataSchema, type AcademicData } from './schema';


import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { Upload } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// The form needs a slightly different shape than the schema, including the full image URLs
type AcademicFormData = AcademicData & {
    curriculumImageUrl?: string | null;
    structureImageUrl?: string | null;
};

export default function AcademicsAdminPage() {
  const { toast } = useToast();
  const [initialData, setInitialData] = useState<AcademicFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { register, handleSubmit, reset, watch, formState: { errors, isDirty } } = useForm<AcademicData>({
     resolver: zodResolver(AcademicDataSchema)
  });

  const curriculumImageFile = watch('curriculumImage');
  const curriculumImagePreview = curriculumImageFile?.[0] ? URL.createObjectURL(curriculumImageFile[0]) : initialData?.curriculumImageUrl;
  
  const structureImageFile = watch('structureImage');
  const structureImagePreview = structureImageFile?.[0] ? URL.createObjectURL(structureImageFile[0]) : initialData?.structureImageUrl;

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const data = await getAcademics();
      if (data) {
        setInitialData(data);
        reset({
          curriculumTitle: data.curriculumTitle,
          curriculumDescription: data.curriculumDescription,
          structureTitle: data.structureTitle,
          structureDescription: data.structureDescription,
        });
      }
      setIsLoading(false);
    }
    fetchData();
  }, [reset]);

  const onSubmit: SubmitHandler<AcademicData> = async (data) => {
    const formData = new FormData();
    
    // Append all text fields
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === 'string') {
        formData.append(key, value);
      }
    });

    // Append images if they exist
    if (data.curriculumImage && data.curriculumImage.length > 0) {
      formData.append('curriculumImage', data.curriculumImage[0]);
    }
     if (data.structureImage && data.structureImage.length > 0) {
      formData.append('structureImage', data.structureImage[0]);
    }
    
    if (initialData?.id) {
       formData.append('id', (initialData as any).id);
       formData.append('currentCurriculumImageUrl', initialData.curriculumImageUrl || '');
       formData.append('currentStructureImageUrl', initialData.structureImageUrl || '');
    }

    const result = await updateAcademics(formData);

    if (result.success) {
      toast({ title: 'Sukses!', description: 'Data akademik berhasil diperbarui.' });
      const updatedData = await getAcademics();
       if (updatedData) {
        setInitialData(updatedData);
        reset({
          curriculumTitle: updatedData.curriculumTitle,
          curriculumDescription: updatedData.curriculumDescription,
          structureTitle: updatedData.structureTitle,
          structureDescription: updatedData.structureDescription,
        });
      }
    } else {
      toast({ title: 'Gagal', description: result.message, variant: 'destructive' });
    }
  };
  
  if (isLoading) {
    return (
        <div className="flex flex-col gap-8">
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-8 w-3/4" />
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <Card>
                    <CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-24 w-full" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-24 w-full" />
                    </CardContent>
                </Card>
            </div>
             <div className="flex justify-end"><Skeleton className="h-10 w-32" /></div>
        </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold text-primary md:text-4xl">
          Kelola Halaman Akademik
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Perbarui konten untuk bagian Kurikulum dan Struktur Pembelajaran.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Konten Kurikulum</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div>
                <Label>Gambar Kurikulum</Label>
                <div className="mt-1 flex items-center gap-4">
                  {curriculumImagePreview ? (
                    <Image
                      src={curriculumImagePreview}
                      alt="Preview"
                      width={120}
                      height={80}
                      className="rounded-md object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-32 items-center justify-center rounded-md bg-muted">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <Input id="curriculumImage" type="file" accept="image/*" className="max-w-xs" {...register('curriculumImage')} />
                </div>
              </div>
            <div>
              <Label htmlFor="curriculumTitle">Judul</Label>
              <Input id="curriculumTitle" {...register('curriculumTitle')} />
               {errors.curriculumTitle && <p className="text-sm text-destructive mt-1">{errors.curriculumTitle.message}</p>}
            </div>
            <div>
              <Label htmlFor="curriculumDescription">Deskripsi</Label>
              <Textarea id="curriculumDescription" rows={8} {...register('curriculumDescription')} />
               {errors.curriculumDescription && <p className="text-sm text-destructive mt-1">{errors.curriculumDescription.message}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Konten Struktur Pembelajaran</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div>
                <Label>Gambar Struktur</Label>
                <div className="mt-1 flex items-center gap-4">
                  {structureImagePreview ? (
                    <Image
                      src={structureImagePreview}
                      alt="Preview"
                      width={120}
                      height={80}
                      className="rounded-md object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-32 items-center justify-center rounded-md bg-muted">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <Input id="structureImage" type="file" accept="image/*" className="max-w-xs" {...register('structureImage')} />
                </div>
              </div>
            <div>
              <Label htmlFor="structureTitle">Judul</Label>
              <Input id="structureTitle" {...register('structureTitle')} />
               {errors.structureTitle && <p className="text-sm text-destructive mt-1">{errors.structureTitle.message}</p>}
            </div>
            <div>
              <Label htmlFor="structureDescription">Deskripsi</Label>
              <Textarea id="structureDescription" rows={8} {...register('structureDescription')} />
               {errors.structureDescription && <p className="text-sm text-destructive mt-1">{errors.structureDescription.message}</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={!isDirty}>Simpan Perubahan</Button>
      </div>
    </form>
  );
}
