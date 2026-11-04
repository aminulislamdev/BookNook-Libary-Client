"use client";

import Image from "next/image";
import { BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function BookCover({
  src,
  alt,
  className,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  eager = false,
}: {
  src?: string;
  alt: string;
  className?: string;
  sizes?: string;
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  const showFallback = !src || failed;

  return (
    <div className="relative h-full w-full overflow-hidden bg-surface-muted">
      {showFallback ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-linear-to-br from-brand-soft to-surface-muted px-4 text-center text-brand-soft-foreground">
          <BookOpen className="h-8 w-8" aria-hidden="true" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-soft-foreground/70">
            BookNook
          </span>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          unoptimized={true}
          loading={eager ? "eager" : "lazy"}
          className={cn("object-contain object-center p-2", className)}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}