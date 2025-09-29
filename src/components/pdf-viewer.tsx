'use client';

import { Card } from '@/components/ui/card';

interface PDFViewerProps {
    url: string;
    title: string;
    description?: string;
}

export function PDFViewer({ url, title, description }: PDFViewerProps) {
    // Convert Google Drive URL to embed URL if needed
    const getEmbedUrl = (url: string) => {
        if (url.includes('drive.google.com')) {
            // Convert sharing URL to embed URL
            const fileId = url.match(/\/d\/(.*?)\//)?.[1] || '';
            return `https://drive.google.com/file/d/${fileId}/preview`;
        }
        return url;
    };

    return (
        <Card className="overflow-hidden">
            <div className="p-4 border-b">
                <h2 className="text-xl font-semibold">{title}</h2>
                {description && (
                    <p className="text-gray-600 mt-2">{description}</p>
                )}
            </div>
            <div className="h-[700px] w-full">
                <iframe
                    src={getEmbedUrl(url)}
                    className="w-full h-full"
                    allow="autoplay"
                />
            </div>
        </Card>
    );
}
