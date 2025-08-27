'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { updatePrincipalProfile } from './actions';
import { Upload } from 'lucide-react';

type Profile = {
  id: string;
  principalName: string;
  principalWelcome: string;
  principalImageUrl: string | null;
  history: string;
  vision: string;
  mission: string;
};

type PrincipalFormProps = {
  initialProfileData: Profile | null;
};

export default function PrincipalForm({ initialProfileData }: PrincipalFormProps) {
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<Profile | null>(initialProfileData);
  const [principalImageFile, setPrincipalImageFile] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(initialProfileData?.principalImageUrl || null);

  useEffect(() => {
    setProfileData(initialProfileData);
    setPreviewImageUrl(initialProfileData?.principalImageUrl || null);
  }, [initialProfileData]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (principalImageFile) {
      formData.append('principalImage', principalImageFile);
    }

    const result = await updatePrincipalProfile(formData);

    if (result.success) {
      toast({
        title: "Success",
        description: result.message,
      });
      // No need to re-fetch here, revalidatePath in action will handle it
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPrincipalImageFile(file);
      setPreviewImageUrl(URL.createObjectURL(file));
    } else {
      setPrincipalImageFile(null);
      setPreviewImageUrl(profileData?.principalImageUrl || null);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold text-primary md:text-4xl">
          Kelola Profil Kepala Sekolah
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Perbarui kata sambutan, foto, dan nama kepala sekolah.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="principalName">Nama Kepala Sekolah</Label>
          <Input
            id="principalName"
            name="principalName"
            defaultValue={profileData?.principalName || ''}
            required
          />
        </div>

        <div>
          <Label htmlFor="principalWelcome">Kata Sambutan Kepala Sekolah</Label>
          <Textarea
            id="principalWelcome"
            name="principalWelcome"
            defaultValue={profileData?.principalWelcome || ''}
            rows={10}
            required
          />
        </div>

        <div>
          <Label htmlFor="principalImage">Foto Kepala Sekolah</Label>
          <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5">
            <div className="space-y-1 text-center">
              {previewImageUrl ? (
                <Image
                  src={previewImageUrl}
                  alt="Preview"
                  width={150}
                  height={150}
                  className="mx-auto rounded-full object-cover"
                />
              ) : (
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
              )}
              <Label htmlFor="principalImage" className="relative cursor-pointer rounded-md bg-white font-medium text-primary focus-within:outline-none hover:text-primary/80">
                <span>Unggah file baru</span>
                <Input
                  id="principalImage"
                  name="principalImage"
                  type="file"
                  className="sr-only"
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </Label>
              {principalImageFile && <p className="text-sm text-gray-500">Selected: {principalImageFile.name}</p>}
            </div>
          </div>
        </div>

        <Button type="submit">Simpan Perubahan</Button>
      </form>
    </div>
  );
}