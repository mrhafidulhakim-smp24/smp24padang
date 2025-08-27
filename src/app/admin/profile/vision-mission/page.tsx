
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Target, Book } from "lucide-react";
import { getProfile, updateVisionMission } from "./actions";

export default function VisionMissionAdminPage() {
    const [vision, setVision] = useState("");
    const [mission, setMission] = useState("");
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        async function fetchVisionMission() {
            const data = await getProfile();
            if (data) {
                setVision(data.vision);
                setMission(data.mission);
            }
            setLoading(false);
        }
        fetchVisionMission();
    }, []);

    const handleSaveChanges = async () => {
        setLoading(true);
        const result = await updateVisionMission(vision, mission);
        if (result.success) {
            toast({
                title: "Perubahan Disimpan!",
                description: "Visi & Misi sekolah telah berhasil diperbarui.",
            });
        } else {
            toast({
                title: "Gagal Menyimpan!",
                description: result.error || "Terjadi kesalahan saat memperbarui Visi & Misi.",
                variant: "destructive",
            });
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="flex flex-col gap-8">
                <h1 className="font-headline text-3xl font-bold text-primary md:text-4xl">
                    Kelola Visi & Misi
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
                    Kelola Visi & Misi
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Perbarui pernyataan visi dan misi sekolah Anda.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="h-6 w-6 text-accent"/>
                            Visi Sekolah
                        </CardTitle>
                        <CardDescription>
                            Tuliskan pernyataan visi yang menginspirasi.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            id="vision"
                            value={vision}
                            onChange={(e) => setVision(e.target.value)}
                            className="min-h-[250px]"
                            placeholder="Tuliskan visi sekolah di sini..."
                        />
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Book className="h-6 w-6 text-accent"/>
                            Misi Sekolah
                        </CardTitle>
                        <CardDescription>
                           Setiap baris akan dianggap sebagai satu poin misi.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Textarea
                            id="mission"
                            value={mission}
                            onChange={(e) => setMission(e.target.value)}
                            className="min-h-[250px]"
                            placeholder="Tuliskan poin-poin misi di sini, pisahkan dengan baris baru..."
                        />
                    </CardContent>
                </Card>
            </div>
            
            <div className="flex justify-end pt-4">
                <Button onClick={handleSaveChanges} size="lg">Simpan Semua Perubahan</Button>
            </div>
        </div>
    );
}
