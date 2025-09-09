'use client';

import { useState, useEffect, useTransition } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { updatePrincipalProfile } from './actions';
import { Upload, UserCircle } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

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

export default function PrincipalForm({
    initialProfileData,
}: PrincipalFormProps) {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const [profileData, setProfileData] = useState<Profile | null>(
        initialProfileData,
    );
    const [principalImageFile, setPrincipalImageFile] = useState<File | null>(
        null,
    );
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(
        initialProfileData?.principalImageUrl || null,
    );
    const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});

    useEffect(() => {
        setProfileData(initialProfileData);
        setPreviewImageUrl(initialProfileData?.principalImageUrl || null);
    }, [initialProfileData]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors({}); // Clear previous errors
        const formData = new FormData(event.currentTarget);

        if (principalImageFile) {
            formData.append('principalImage', principalImageFile);
        }

        startTransition(async () => {
            const result = await updatePrincipalProfile(formData);

            if (result.success) {
                toast({
                    title: 'Success',
                    description: result.message,
                });
                if (result.newImageUrl) {
                    setPreviewImageUrl(result.newImageUrl);
                }
                setErrors({}); // Clear errors on success
            } else {
                if (result.errors) {
                    setErrors(result.errors);
                    toast({
                        title: 'Validation Error',
                        description: 'Please check the form for errors.',
                        variant: 'destructive',
                    });
                } else if (result.message) {
                    toast({
                        title: 'Error',
                        description: result.message,
                        variant: 'destructive',
                    });
                } else {
                    toast({
                        title: 'Error',
                        description: 'An unexpected error occurred.',
                        variant: 'destructive',
                    });
                }
            }
        });
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
        <Card>
            <CardHeader>
                <CardTitle>Profil Kepala Sekolah & Tentang Sekolah</CardTitle>
                <CardDescription>
                    Perbarui informasi mengenai kepala sekolah saat ini dan
                    informasi umum sekolah.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    onSubmit={handleSubmit}
                    className="grid md:grid-cols-3 gap-8"
                >
                    {/* Column 1: Image Upload */}
                    <div className="md:col-span-1 space-y-4">
                        <div>
                            <Label
                                htmlFor="principalImage"
                                className="text-base font-semibold"
                            >
                                Foto Kepala Sekolah
                            </Label>
                            <div className="mt-2 flex justify-center border border-dashed border-border px-6 py-10">
                                <div className="text-center">
                                    {previewImageUrl ? (
                                        <Image
                                            src={previewImageUrl}
                                            alt="Preview"
                                            width={160}
                                            height={160}
                                            className="mx-auto h-40 w-40 object-cover"
                                        />
                                    ) : (
                                        <UserCircle className="mx-auto h-24 w-24 text-muted-foreground" />
                                    )}
                                    <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
                                        <Label
                                            htmlFor="principalImage"
                                            className="relative cursor-pointer rounded-md font-semibold text-primary focus-within:outline-none hover:text-primary/80"
                                        >
                                            <span>Unggah file</span>
                                            <Input
                                                id="principalImage"
                                                name="principalImage"
                                                type="file"
                                                className="sr-only"
                                                onChange={handleImageChange}
                                                accept="image/*"
                                            />
                                        </Label>
                                        <p className="pl-1">
                                            atau seret dan lepas
                                        </p>
                                    </div>
                                    <p className="text-xs leading-5 text-muted-foreground">
                                        PNG, JPG, GIF up to 10MB
                                    </p>
                                    {principalImageFile && (
                                        <p className="text-sm text-foreground mt-2">
                                            Selected: {principalImageFile.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {errors.principalImage && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.principalImage[0]}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Column 2: Form Fields */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="space-y-2">
                            <Label
                                htmlFor="principalName"
                                className="text-base font-semibold"
                            >
                                Nama Kepala Sekolah
                            </Label>
                            <Input
                                id="principalName"
                                name="principalName"
                                defaultValue={profileData?.principalName || ''}
                                required
                                className="text-base"
                            />
                            {errors.principalName && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.principalName[0]}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="principalWelcome"
                                className="text-base font-semibold"
                            >
                                Kata Sambutan
                            </Label>
                            <Textarea
                                id="principalWelcome"
                                name="principalWelcome"
                                defaultValue={
                                    profileData?.principalWelcome || ''
                                }
                                rows={8}
                                required
                                className="text-base"
                            />
                            {errors.principalWelcome && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.principalWelcome[0]}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="history"
                                className="text-base font-semibold"
                            >
                                Tentang Sekolah
                            </Label>
                            <Textarea
                                id="history"
                                name="history"
                                defaultValue={profileData?.history || ''}
                                rows={8}
                                required
                                className="text-base"
                            />
                            {errors.history && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.history[0]}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="md:col-span-3 flex justify-end">
                        <Button type="submit" disabled={isPending} size="lg">
                            {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
