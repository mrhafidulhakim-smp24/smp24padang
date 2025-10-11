'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TabSetoranGuru } from './components/setoran-guru-tab';
import { TabSetoranKelas } from './components/setoran-kelas-tab';
import type { SispendikClientProps } from './components/types';

// --- MAIN WRAPPER COMPONENT ---
export default function SispendikClient(props: SispendikClientProps) {
    return (
        <Tabs defaultValue="kelas" className="w-full">
            <TabsList className="grid w-full grid-cols-2 print:hidden">
                <TabsTrigger
                    value="kelas"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                    Setoran per Kelas
                </TabsTrigger>
                <TabsTrigger
                    value="guru"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                    Setoran Guru
                </TabsTrigger>
            </TabsList>
            <TabsContent value="kelas">
                <TabSetoranKelas
                    kelas={props.kelas}
                    jenisSampah={props.jenisSampah}
                />
            </TabsContent>
            <TabsContent value="guru">
                <TabSetoranGuru
                    jenisSampah={props.jenisSampah}
                    gurus={props.gurus}
                    initialSetoranGuru={props.initialSetoranGuru}
                />
            </TabsContent>
        </Tabs>
    );
}