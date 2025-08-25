
"use client";

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function DeprecatedNewsPage({ params }: { params: { id: string }}) {
    useEffect(() => {
        redirect(`/articles/${params.id}`);
    }, [params.id]);

    return (
        <div className="container mx-auto flex h-screen items-center justify-center text-center">
            <div>
                <h1 className="text-2xl font-bold">Mengalihkan...</h1>
                <p className="text-muted-foreground">
                    Halaman ini telah dipindahkan. Anda akan dialihkan ke alamat baru.
                </p>
            </div>
        </div>
    );
}
