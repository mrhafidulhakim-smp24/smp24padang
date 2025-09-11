'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Award } from 'lucide-react';
import type { achievements as Achievement } from '@/lib/db/schema';
import { type InferSelectModel } from 'drizzle-orm';

type AchievementItem = InferSelectModel<typeof Achievement>;

type AchievementListProps = {
    achievements: AchievementItem[];
};

export default function AchievementList({ achievements }: AchievementListProps) {
    const [selectedAchievement, setSelectedAchievement] =
        useState<AchievementItem | null>(null);

    return (
        <>
            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {achievements.map((achievement, index) => (
                    <div
                        key={index}
                        className="cursor-pointer"
                        onClick={() => setSelectedAchievement(achievement)}
                    >
                        <Card
                            className="group relative w-full overflow-hidden rounded-lg shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                            data-aos="fade-up"
                            data-aos-delay={(index % 3) * 100}
                        >
                            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                            <Image
                                src={
                                    achievement.imageUrl ||
                                    'https://placehold.co/600x400.png'
                                }
                                alt={achievement.title}
                                width={600}
                                height={400}
                                className="h-full w-full object-cover bg-black transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 z-20 flex flex-col justify-end p-6">
                                <div className="mb-4 h-12 w-12 rounded-full bg-accent/20 p-3 ring-4 ring-accent/30 transition-all duration-500 group-hover:bg-accent group-hover:ring-accent">
                                    <Award className="h-full w-full text-accent transition-colors duration-500 group-hover:text-accent-foreground" />
                                </div>
                                <h3 className="font-headline text-2xl font-bold text-white shadow-black drop-shadow-lg">
                                    {achievement.title}
                                </h3>
                                <p className="text-md mt-1 font-semibold text-amber-300 drop-shadow-md">
                                    {achievement.student}
                                </p>
                            </div>
                        </Card>
                    </div>
                ))}
            </div>

            <Dialog
                open={!!selectedAchievement}
                onOpenChange={(isOpen) => {
                    if (!isOpen) {
                        setSelectedAchievement(null);
                    }
                }}
            >
                <DialogContent className="max-w-2xl">
                    {selectedAchievement && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="font-headline text-2xl text-primary">
                                    {selectedAchievement.title}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="mt-4">
                                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                                    <Image
                                        src={
                                            selectedAchievement.imageUrl ||
                                            'https://placehold.co/600x400.png'
                                        }
                                        alt={selectedAchievement.title}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <div className="mt-4 space-y-2">
                                    <p className="text-lg font-semibold text-accent">
                                        {selectedAchievement.student}
                                    </p>
                                    <p className="text-muted-foreground whitespace-pre-wrap">
                                        {selectedAchievement.description}
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
