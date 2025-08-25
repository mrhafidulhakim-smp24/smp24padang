
"use client";

import { useEffect, useState } from 'react';

export default function DeprecatedNewsPage() {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const pathParts = window.location.pathname.split('/');
            const id = pathParts[pathParts.length - 1];
            window.location.replace(`/articles/${id}`);
        }
    }, []);

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
