'use client';

import { useState, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LazyIframeProps extends React.IframeHTMLAttributes<HTMLIFrameElement> {
    placeholderClassName?: string;
}

export function LazyIframe({
    placeholderClassName,
    ...props
}: LazyIframeProps) {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);
    const iframeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsIntersecting(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: '100px', // Load 100px before it enters the viewport
            },
        );

        if (iframeRef.current) {
            observer.observe(iframeRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    const handleLoad = () => {
        setHasLoaded(true);
    };

    return (
        <div ref={iframeRef} className={cn("relative w-full h-full", placeholderClassName)}>
            {!hasLoaded && (
                 <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="sr-only">Memuat...</span>
                </div>
            )}
            {isIntersecting && (
                <iframe
                    {...props}
                    onLoad={handleLoad}
                    className={cn(
                        "h-full w-full transition-opacity duration-300",
                        hasLoaded ? "opacity-100" : "opacity-0"
                    )}
                />
            )}
        </div>
    );
}
