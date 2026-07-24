import type { Metadata } from "next";
import type { ReactNode } from "react";

import { StorefrontShell } from "@/themes/default/layout";
import { getWebstore } from "@/lib/tebex/queries";
import { stripHtml } from "@/lib/format";

// Next.js dedupes identical fetch() calls made during the same render pass,
// so this doesn't cost an extra request beyond the one StorefrontShell
// already makes for the same data.
export async function generateMetadata(): Promise<Metadata> {
  const result = await getWebstore();
  const store = result.ok ? result.data.data : undefined;
  const name = store?.name ?? "Store";
  return {
    title: { default: name, template: `%s | ${name}` },
    description: store?.description
      ? stripHtml(store.description).slice(0, 160)
      : `Shop ${name}, powered by Tebex.`,
  };
}

export default function StoreLayout({ children }: { children: ReactNode }) {
  return <StorefrontShell>{children}</StorefrontShell>;
}
