

"use client";

import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { ProfileSchema, updateProfile, getProfile } from "./actions";
import type { z } from "zod";
import type { Profile } from "@prisma/client";

type ProfileValues = z.infer<typeof ProfileSchema>;

export default function ProfileAdminPage() {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const form = useForm<ProfileValues>({
        resolver: zodResolver(ProfileSchema),
        defaultValues: {
            principalWelcome: "",
            principalName: "",
        },
    });

    useEffect(() => {
        async function fetchProfile() {
            const data = await getProfile();
            if (data) {
                setProfile(data);
                form.reset({
                    principalWelcome: data.principalWelcome,
                    principalName: data.principalName,
                });
                if(data.principalImageUrl) {
                    setPreviewImage(data.principalImageUrl);
                }
            }
        }
        fetchProfile();
    }, [form]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const onSubmit = (data: ProfileValues) => {
        startTransition(async () => {
             if (!profile) {
                toast({ title: "Error", description: "Profil tidak ditemukan.", variant: "destructive" });
                return;
            }

            const formData = new FormData();
            formData.append("principalWelcome", data.principalWelcome);
            formData.append("principalName", data.principalName);

            const imageFile = (document.getElementById('file-upload') as HTMLInputElement)?.files?.[0];
            if (imageFile) {
                formData.append('image', imageFile);
            }

            const result = await updateProfile(profile.id, profile.principalImageUrl || '', formData);

            if (result.success && result.data) {
                setProfile(result.data);
                if (result.data.principalImageUrl) {
                    setPreviewImage(result.data.principalImageUrl);
                }
                toast({ title: "Sukses", description: "Profil sekolah telah berhasil diperbarui." });
            } else {
                toast({ title: "Error", description: result.message, variant: "destructive" });
            }
        });
    };

    if (!profile) {
        return <div>Loading...</div>
    }

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="font-headline text-3xl font-bold text-primary md:text-4xl">
                    Kelola Profil Sekolah
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Edit kata sambutan, nama, dan foto kepala sekolah.
                </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle>Kata Sambutan Kepala Sekolah</CardTitle>
                        <CardDescription>
                            Lakukan perubahan pada kata sambutan dan foto kepala sekolah yang ditampilkan di halaman profil dan beranda.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start">
                            <div className="lg:col-span-2 space-y-6">
                                <div>
                                    <Label htmlFor="principalWelcome" className="text-base font-semibold">Kata Sambutan</Label>
                                    <Textarea
                                        id="principalWelcome"
                                        {...form.register("principalWelcome")}
                                        className="mt-2 min-h-[300px]"
                                        placeholder="Tuliskan kata sambutan di sini..."
                                    />
                                    {form.formState.errors.principalWelcome && <p className="text-sm text-destructive">{form.formState.errors.principalWelcome.message}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="principalName" className="text-base font-semibold">Nama Kepala Sekolah & Gelar</Label>
                                    <Input
                                        id="principalName"
                                        {...form.register("principalName")}
                                        className="mt-2"
                                        placeholder="Contoh: Dr. Budi Santoso, M.Pd."
                                    />
                                    {form.formState.errors.principalName && <p className="text-sm text-destructive">{form.formState.errors.principalName.message}</p>}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="principalImage" className="text-base font-semibold">Foto Kepala Sekolah</Label>
                                    <div className="mt-2 space-y-4">
                                        {previewImage && <Image src={previewImage} alt="Foto Kepala Sekolah" width={600} height={800} className="w-full rounded-md object-cover aspect-[3/4]" data-ai-hint="professional portrait" />}
                                        <div className="flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5">
                                            <div className="space-y-1 text-center">
                                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                                <div className="flex text-sm text-gray-600">
                                                    <Label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-medium text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:text-primary/80">
                                                        <span>Ganti gambar</span>
                                                        <Input id="file-upload" name="image" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                                    </Label>
                                                    <p className="pl-1">atau seret dan lepas</p>
                                                </div>
                                                <p className="text-xs text-gray-500">Biarkan kosong jika tidak ingin mengganti gambar.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end pt-6 mt-6 border-t">
                            <Button type="submit" disabled={isPending}>{isPending ? "Menyimpan..." : "Simpan Perubahan"}</Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
