
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

const initialProfile = {
    principalWelcome: "Selamat datang di SMPN 24 Padang! Kami adalah komunitas yang berdedikasi untuk menumbuhkan keunggulan akademik, pengembangan karakter, dan kecintaan belajar seumur hidup. Komitmen kami adalah menyediakan lingkungan yang aman, membina, dan merangsang di mana setiap siswa dapat berkembang dan mencapai potensi penuh mereka. Kami percaya pada pendekatan holistik terhadap pendidikan, yang menyeimbangkan kekakuan akademis dengan ekspresi artistik, prestasi atletik, dan pengabdian masyarakat. Fakultas kami yang berbakat dan berdedikasi hadir untuk membimbing dan menginspirasi siswa kami dalam perjalanan pendidikan mereka.",
    principalName: "Dr. Budi Santoso, Kepala Sekolah",
    principalImage: "https://placehold.co/600x800.png"
};

export default function ProfileAdminPage() {
    const [welcomeMessage, setWelcomeMessage] = useState(initialProfile.principalWelcome);
    const [principalName, setPrincipalName] = useState(initialProfile.principalName);
    const [principalImage, setPrincipalImage] = useState(initialProfile.principalImage);
    const { toast } = useToast();

    const handleSaveChanges = () => {
        console.log("Saving changes:", { welcomeMessage, principalImage });
        toast({
            title: "Perubahan Disimpan!",
            description: "Profil sekolah telah berhasil diperbarui.",
        });
    };
    
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPrincipalImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

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

            <Card>
                <CardHeader>
                    <CardTitle>Kata Sambutan Kepala Sekolah</CardTitle>
                    <CardDescription>
                        Lakukan perubahan pada kata sambutan dan foto kepala sekolah yang ditampilkan di halaman profil dan beranda.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        <div className="md:col-span-2 space-y-4">
                            <div>
                                <Label htmlFor="welcomeMessage" className="text-base font-semibold">Kata Sambutan</Label>
                                <Textarea
                                    id="welcomeMessage"
                                    value={welcomeMessage}
                                    onChange={(e) => setWelcomeMessage(e.target.value)}
                                    className="mt-2 min-h-[300px]"
                                    placeholder="Tuliskan kata sambutan di sini..."
                                />
                            </div>
                             <div>
                                <Label htmlFor="principalName" className="text-base font-semibold">Nama Kepala Sekolah & Gelar</Label>
                                <Input
                                    id="principalName"
                                    value={principalName}
                                    onChange={(e) => setPrincipalName(e.target.value)}
                                    className="mt-2"
                                    placeholder="Contoh: Dr. Budi Santoso, M.Pd."
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                             <div>
                                <Label htmlFor="principalImage" className="text-base font-semibold">Foto Kepala Sekolah</Label>
                                <div className="mt-2 space-y-4">
                                     <Image src={principalImage} alt="Foto Kepala Sekolah" width={600} height={800} className="w-full rounded-md object-cover aspect-[3/4]" data-ai-hint="professional portrait" />
                                     <div className="flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5">
                                        <div className="space-y-1 text-center">
                                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="flex text-sm text-gray-600">
                                                <Label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-medium text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:text-primary/80">
                                                    <span>Ganti gambar</span>
                                                    <Input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                                                </Label>
                                                <p className="pl-1">atau seret dan lepas</p>
                                            </div>
                                            <p className="text-xs text-gray-500">PNG, JPG, GIF hingga 10MB</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                     <div className="flex justify-end pt-4 border-t">
                        <Button onClick={handleSaveChanges}>Simpan Perubahan</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
