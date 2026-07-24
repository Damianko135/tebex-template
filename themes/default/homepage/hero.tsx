import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

import { revealDelay } from "./reveal-delay";
import type { Webstore } from "./types";

/** The homepage's top banner: store name/description plus primary CTAs. */
export function Hero({ webstore }: { webstore: Webstore }) {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="max-w-3xl space-y-7">
          <h1 className="animate-fade-up font-display text-display-lg text-balance">
            {webstore?.name}
          </h1>
          {webstore?.description && (
            <div
              className="prose prose-sm sm:prose-base dark:prose-invert max-w-2xl animate-fade-up text-muted-foreground"
              style={revealDelay(1, 80)}
              dangerouslySetInnerHTML={{ __html: webstore.description }}
            />
          )}
          <div className="animate-fade-up flex flex-wrap gap-3 pt-3" style={revealDelay(2, 80)}>
            <Button size="lg" render={<Link href="/categories" />}>
              Shop now <ArrowRight className="size-4" />
            </Button>
            <Button size="lg" variant="outline" render={<Link href="/packages" />}>
              Browse all packages
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
