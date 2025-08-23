
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Target, Book } from "lucide-react";

const initialData = {
  vision: "Menjadi lembaga pendidikan terkemuka yang diakui karena memberdayakan siswa untuk menjadi warga dunia yang welas asih, inovatif, dan bertanggung jawab.",
  mission: [
    "Menyediakan pendidikan berkualitas tinggi dan komprehensif yang memupuk rasa ingin tahu intelektual.",
    "Membina budaya saling menghormati, berintegritas, dan bertanggung jawab sosial.",
    "Membekali siswa dengan keterampilan dan pola pikir untuk berhasil di dunia yang cepat berubah.",
    "Menciptakan komunitas siswa, orang tua, dan pendidik yang kolaboratif dan inklusif.",
  ],
};

export default function VisionMissionAdminPage() {
    const [vision, setVision] = useState(initialData.vision);
    const [mission, setMission] = useState(initialData.mission.join("\n"));
    const { toast } = useToast();

    const handleSaveChanges = () => {
        console.log("Saving changes:", { vision, mission: mission.split("\n") });
        toast({
            title: "Perubahan Disimpan!",
            description: "Visi & Misi sekolah telah berhasil diperbarui.",
        });
    };

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

            <Card>
                <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="vision" className="text-base font-semibold flex items-center gap-2">
                            <Target className="h-5 w-5 text-accent" />
                            Visi Sekolah
                        </Label>
                        <Textarea
                            id="vision"
                            value={vision}
                            onChange={(e) => setVision(e.target.value)}
                            className="min-h-[100px]"
                            placeholder="Tuliskan visi sekolah di sini..."
                        />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="mission" className="text-base font-semibold flex items-center gap-2">
                            <Book className="h-5 w-5 text-accent" />
                            Misi Sekolah
                        </Label>
                         <CardDescription>
                            Setiap baris akan dianggap sebagai satu poin misi.
                        </CardDescription>
                        <Textarea
                            id="mission"
                            value={mission}
                            onChange={(e) => setMission(e.target.value)}
                            className="min-h-[200px]"
                            placeholder="Tuliskan poin-poin misi di sini, pisahkan dengan baris baru..."
                        />
                    </div>
                     <div className="flex justify-end pt-4 border-t">
                        <Button onClick={handleSaveChanges}>Simpan Perubahan</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
