
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

type OrgChartMode = "image" | "gdrive";

export default function OrganizationAdminPage() {
  const [mode, setMode] = useState<OrgChartMode>("image");
  const [imageUrl, setImageUrl] = useState<string | null>("https://placehold.co/1200x800.png");
  const [gdriveLink, setGdriveLink] = useState<string>("");
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveChanges = () => {
    // In a real application, you would save the mode and the corresponding URL
    // to your database.
    console.log("Saving changes:", {
      mode,
      imageUrl: mode === "image" ? imageUrl : null,
      gdriveLink: mode === "gdrive" ? gdriveLink : null,
    });
    toast({
      title: "Perubahan Disimpan!",
      description: "Struktur organisasi telah berhasil diperbarui.",
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold text-primary md:text-4xl">
          Kelola Struktur Organisasi
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Pilih metode untuk menampilkan bagan organisasi Anda.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sumber Bagan Organisasi</CardTitle>
          <CardDescription>
            Pilih untuk mengunggah gambar atau menggunakan tautan dari Google Drive.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={mode} onValueChange={(value) => setMode(value as OrgChartMode)} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="image">Unggah Gambar</TabsTrigger>
              <TabsTrigger value="gdrive">Tautan Google Drive</TabsTrigger>
            </TabsList>
            <TabsContent value="image" className="mt-6">
              <div className="space-y-4">
                <Label htmlFor="image-upload" className="font-semibold">
                  File Gambar Bagan Organisasi
                </Label>
                <div className="mt-2 flex justify-center rounded-md border-2 border-dashed border-border px-6 pb-6 pt-5">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div className="flex text-sm text-muted-foreground">
                      <Label
                        htmlFor="image-upload"
                        className="relative cursor-pointer rounded-md bg-background font-medium text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:text-primary/80"
                      >
                        <span>Unggah file</span>
                        <Input
                          id="image-upload"
                          name="image-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleImageUpload}
                          accept="image/*"
                        />
                      </Label>
                      <p className="pl-1">atau seret dan lepas</p>
                    </div>
                    <p className="text-xs text-muted-foreground">PNG, JPG, GIF hingga 10MB</p>
                  </div>
                </div>
                {imageUrl && (
                  <div>
                    <p className="mb-2 text-sm font-medium">Pratinjau Gambar:</p>
                    <div className="overflow-hidden rounded-md border">
                        <Image src={imageUrl} alt="Pratinjau Struktur Organisasi" width={1200} height={800} className="w-full h-auto object-contain"/>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="gdrive" className="mt-6">
              <div className="space-y-2">
                <Label htmlFor="gdrive-link" className="font-semibold">
                  Tautan Google Drive
                </Label>
                <p className="text-sm text-muted-foreground">
                  Pastikan tautan diatur ke "Siapa saja yang memiliki link dapat melihat". Ubah akhir tautan dari `/view` menjadi `/preview` untuk penyematan.
                </p>
                <Input
                  id="gdrive-link"
                  type="url"
                  placeholder="https://drive.google.com/file/d/your_file_id/preview"
                  value={gdriveLink}
                  onChange={(e) => setGdriveLink(e.target.value)}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 flex justify-end">
            <Button onClick={handleSaveChanges}>Simpan Perubahan</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
