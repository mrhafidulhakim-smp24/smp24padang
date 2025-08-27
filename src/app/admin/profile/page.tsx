"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getProfileDetails, updateProfileDetails } from "./actions";

export default function ProfileAdminPage() {
    const [principalName, setPrincipalName] = useState("");
    const [principalWelcome, setPrincipalWelcome] = useState("");
    const [principalImageUrl, setPrincipalImageUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        async function fetchProfile() {
            const data = await getProfileDetails();
            if (data) {
                setPrincipalName(data.principalName);
                setPrincipalWelcome(data.principalWelcome);
                setPrincipalImageUrl(data.principalImageUrl || "");
            }
            setLoading(false);
        }
        fetchProfile();
    }, []);

    const handleSaveChanges = async () => {
        setLoading(true);
        const result = await updateProfileDetails({ 
            principalName, 
            principalWelcome, 
            principalImageUrl 
        });
        if (result.success) {
            toast({
                title: "Perubahan Disimpan!",
                description: "Profil sekolah telah berhasil diperbarui.",
            });
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
        <div className="flex flex-col gap-8">
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
                            value={principalName}
                            onChange={(e) => setPrincipalName(e.target.value)}
                            placeholder="Masukkan nama lengkap..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="principalWelcome">Kata Sambutan</Label>
                        <Textarea
                            id="principalWelcome"
                            value={principalWelcome}
                            onChange={(e) => setPrincipalWelcome(e.target.value)}
                            className="min-h-[200px]"
                            placeholder="Tuliskan kata sambutan..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="principalImageUrl">URL Gambar Kepala Sekolah</Label>
                        <Input
                            id="principalImageUrl"
                            value={principalImageUrl}
                            onChange={(e) => setPrincipalImageUrl(e.target.value)}
                            placeholder="https://example.com/image.png"
                        />
                    </div>
                </CardContent>
            </Card>
            
            <div className="flex justify-end pt-4">
                <Button onClick={handleSaveChanges} size="lg" disabled={loading}>
                    {loading ? "Menyimpan..." : "Simpan Perubahan Profil"}
                </Button>
            </div>
        </div>
    );
}