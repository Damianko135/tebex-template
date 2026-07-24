"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";

import { cn } from "@/lib/utils";

interface GalleryMedia {
  url?: string;
  name?: string | null;
}

/** Main image + thumbnail strip for the package detail page. Thumbnails are
 * capped at 4 to keep a single `grid-cols-4` row regardless of gallery
 * length. */
export function PackageGallery({ gallery, alt }: { gallery: GalleryMedia[]; alt: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = gallery[activeIndex];
  const thumbnails = gallery.slice(0, 4);

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted">
        {active?.url ? (
          <Image src={active.url} alt={active.name || alt} fill unoptimized className="object-cover" />
        ) : (
          <ImageOff className="absolute inset-0 m-auto size-10 text-muted-foreground/40" />
        )}
      </div>
      {thumbnails.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {thumbnails.map((media, index) => (
            <button
              key={media.url ?? `media-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1} of ${gallery.length}`}
              aria-current={index === activeIndex}
              className={cn(
                "relative aspect-square overflow-hidden rounded-md border bg-muted transition-colors",
                index === activeIndex
                  ? "border-primary ring-1 ring-primary"
                  : "border-border hover:border-foreground/40"
              )}
            >
              {media.url ? (
                <Image src={media.url} alt={media.name || alt} fill unoptimized className="object-cover" />
              ) : (
                <ImageOff className="absolute inset-0 m-auto size-5 text-muted-foreground/40" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
