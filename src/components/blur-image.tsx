'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface BlurImageProps {
  src: string;
  alt: string;
  className?: string;
  width: number;
  height: number;
  placeholder: string;
}

export function BlurImage({ src, alt, className, width, height, placeholder }: BlurImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          'object-cover transition-all duration-300',
          isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0'
        )}
        onLoad={() => setIsLoading(false)}
      />
      <Image
        src={placeholder}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          'absolute inset-0 object-cover transition-opacity duration-300',
          isLoading ? 'opacity-100' : 'opacity-0'
        )}
        aria-hidden="true"
      />
    </div>
  );
}
