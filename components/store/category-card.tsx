import Image from "next/image";
import Link from "next/link";
import { Boxes } from "lucide-react";
import type { components } from "tebex-headless";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type Category = components["schemas"]["Category"];

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Card className="group gap-0 overflow-hidden bg-muted py-0">
      <Link
        href={`/categories/${category.id}`}
        className="relative flex aspect-4/3 flex-col justify-end"
      >
        {category.image_url ? (
          <Image
            src={category.image_url}
            alt={category.name ?? ""}
            fill
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <Boxes className="absolute inset-0 m-auto size-10 text-muted-foreground/30" />
        )}
        <div className="relative z-10 bg-linear-to-t from-black/70 to-transparent p-4 pt-10">
          <p className="font-semibold text-white">{category.name}</p>
          {category.packages && (
            <Badge variant="outline" className="mt-1 border-white/30 text-white/90">
              {category.packages.length} {category.packages.length === 1 ? "item" : "items"}
            </Badge>
          )}
        </div>
      </Link>
    </Card>
  );
}
