"use client";

import Image from "next/image";
import { useState } from "react";

interface ImageWithErrorHandlingProps {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
  fallback?: React.ReactNode;
}

export default function ImageWithErrorHandling({
  src,
  alt,
  fill = true,
  sizes,
  className,
  fallback
}: ImageWithErrorHandlingProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return fallback || (
      <div className="flex h-full w-full items-center justify-center text-gray-400 bg-gray-100">
        <span className="text-xs">Image unavailable</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      className={className}
      onError={() => {
        console.error('Image failed to load:', src);
        setHasError(true);
      }}
    />
  );
}