import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { Boxes } from "lucide-react";
import type { components } from "tebex-headless";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type Category = components["schemas"]["Category"];

export function CategoryCard({
  category,
  style,
}: {
  category: Category;
  /** Used by call sites to stagger this card's entrance animation. */
  style?: CSSProperties;
}) {
  return (
    <Card
      className="@container/ccard group animate-fade-up gap-0 overflow-hidden rounded-lg bg-muted py-0"
      style={style}
    >
      <Link
        href={`/categories/${category.id}`}
        className="relative flex aspect-4/3 flex-col justify-end"
      >
        {category.image_url ? (
          <Image
            src={category.image_url}
            alt={category.name ?? "Category image"}
            fill
            unoptimized
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          />
        ) : (
          <Boxes className="absolute inset-0 m-auto size-10 text-muted-foreground/30" />
        )}
        {/* Text size responds to the card's own rendered width (auto-fill
            grid, see themes/default/homepage/homepage.tsx), not the
            viewport - a narrow viewport can still produce a wide card, and
            vice versa. */}
        {/* Fixed black/white, not theme tokens: this is a legibility scrim
            over an arbitrary photo, not themed chrome - it needs to stay
            dark regardless of light/dark mode so the white text on top
            stays readable. `from-foreground/70` would invert in dark mode
            (foreground is near-white there), producing a near-invisible
            light-on-light scrim. */}
        <div className="relative z-10 bg-linear-to-t from-black/70 to-transparent p-4 pt-10">
          <p className="font-heading text-white @sm/ccard:text-lg">{category.name}</p>
          {category.packages && (
            <Badge variant="outline" className="mt-1 border-white/30 text-white/90">
              {category.packages.length} {category.packages.length === 1 ? "package" : "packages"}
            </Badge>
          )}
        </div>
      </Link>
    </Card>
  );
}
