"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getProfileDetails, updateProfileDetails } from "./actions";
import Image from "next/image"; // Import Image component

export default function ProfileAdminPage() {
    const [principalName, setPrincipalName] = useState("");
    const [principalWelcome, setPrincipalWelcome] = useState("");
    const [principalImageUrl, setPrincipalImageUrl] = useState(""); // This will store the URL from DB
    const [principalImageFile, setPrincipalImageFile] = useState<File | null>(null); // This will store the selected file
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null); // For image preview
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        async function fetchProfile() {
            const data = await getProfileDetails();
            if (data) {
                setPrincipalName(data.principalName);
                setPrincipalWelcome(data.principalWelcome);
                setPrincipalImageUrl(data.principalImageUrl || "");
                setPreviewImageUrl(data.principalImageUrl || null); // Set initial preview
            }
            setLoading(false);
        }
        fetchProfile();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPrincipalImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImageUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPrincipalImageFile(null);
            setPreviewImageUrl(principalImageUrl || null); // Revert to current URL if no file selected
        }
    };

    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission
        setLoading(true);

        const formData = new FormData();
        formData.append('principalName', principalName);
        formData.append('principalWelcome', principalWelcome);
        if (principalImageFile) {
            formData.append('principalImage', principalImageFile);
        }
        formData.append('currentPrincipalImageUrl', principalImageUrl); // Pass current URL for deletion

        const result = await updateProfileDetails(formData); // This is the line that needs to be fixed
        if (result.success) {
            toast({
                title: "Perubahan Disimpan!",
                description: result.message,
            });
            // Re-fetch data to ensure UI is updated with new image URL from server
            const updatedData = await getProfileDetails();
            if (updatedData) {
                setPrincipalName(updatedData.principalName);
                setPrincipalWelcome(updatedData.principalWelcome);
                setPrincipalImageUrl(updatedData.principalImageUrl || "");
                setPreviewImageUrl(updatedData.principalImageUrl || null);
            }
        } else {
            toast({
                title: "Gagal Menyimpan!",
                description: result.error || "Terjadi kesalahan saat memperbarui profil.",
                variant: "destructive",
            });
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="flex flex-col gap-8">
                <h1 className="font-headline text-3xl font-bold text-primary md:text-4xl">
                    Kelola Profil Sekolah
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Memuat data...
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSaveChanges} className="flex flex-col gap-8">
            <div>
                <h1 className="font-headline text-3xl font-bold text-primary md:text-4xl">
                    Kelola Profil Sekolah
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Perbarui informasi mengenai kepala sekolah dan sejarah singkat sekolah.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Informasi Kepala Sekolah</CardTitle>
                    <CardDescription>
                        Perbarui detail yang akan ditampilkan di halaman beranda.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="principalName">Nama Kepala Sekolah</Label>
                        <Input
                            id="principalName"
                            name="principalName" // Add name prop for FormData
                            value={principalName}
                            onChange={(e) => setPrincipalName(e.target.value)}
                            placeholder="Masukkan nama lengkap..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="principalWelcome">Kata Sambutan</Label>
                        <Textarea
                            id="principalWelcome"
                            name="principalWelcome" // Add name prop for FormData
                            value={principalWelcome}
                            onChange={(e) => setPrincipalWelcome(e.target.value)}
                            className="min-h-[200px]"
                            placeholder="Tuliskan kata sambutan..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="principalImage">Foto Kepala Sekolah</Label>
                        <div className="mt-1 flex items-center gap-4">
                            {previewImageUrl ? (
                                <Image
                                    src={previewImageUrl}
                                    alt="Foto Kepala Sekolah"
                                    width={120}
                                    height={120}
                                    className="rounded-full object-cover"
                                />
                            ) : (
                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                                    <p className="text-sm text-muted-foreground text-center">Pilih Foto</p>
                                </div>
                            )}
                            <Input
                                id="principalImage"
                                name="principalImage" // Add name prop for FormData
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="max-w-xs"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
            
            <div className="flex justify-end pt-4">
                <Button type="submit" size="lg" disabled={loading}>
                    {loading ? "Menyimpan..." : "Simpan Perubahan Profil"}
                </Button>
            </div>
        </form>
    );
}