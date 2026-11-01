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
  const isRemote = Boolean(src && !src.startsWith("/"));

  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-100">
      {showFallback ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[linear-gradient(145deg,#ecfdf9_0%,#f1f5f9_100%)] px-4 text-center text-brand">
          <BookOpen className="h-8 w-8" aria-hidden="true" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-dark/70">
            BookNook
          </span>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          unoptimized={isRemote}
          loading={eager ? "eager" : "lazy"}
          className={cn("object-cover", className)}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
