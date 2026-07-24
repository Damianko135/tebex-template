import Link from "next/link";
import type { components } from "tebex-headless";

type CMSPage = components["schemas"]["CMSPage"];

export function SiteFooter({
  storeName,
  currency,
  pages,
}: {
  storeName: string;
  currency?: string;
  pages: CMSPage[];
}) {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-4 py-16 sm:px-6 md:grid-cols-4">
        <div className="col-span-2 space-y-2.5 md:col-span-1">
          <p className="font-heading text-lg tracking-tight">{storeName}</p>
          {currency && <p className="text-sm text-muted-foreground">Prices shown in {currency}</p>}
        </div>

        <div className="space-y-3">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Shop</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/categories" className="transition-colors hover:text-primary">Categories</Link></li>
            <li><Link href="/packages" className="transition-colors hover:text-primary">All packages</Link></li>
            <li><Link href="/basket" className="transition-colors hover:text-primary">Basket</Link></li>
          </ul>
        </div>

        {pages.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Info</p>
            <ul className="space-y-2 text-sm">
              {pages.map((page) => (
                <li key={page.id}>
                  <Link href={`/pages/${page.slug}`} className="transition-colors hover:text-primary">
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-3">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Account</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/account/sign-in" className="transition-colors hover:text-primary">Sign in</Link></li>
          </ul>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-5 text-xs text-muted-foreground sm:px-6">
        <span>© {new Date().getFullYear()} {storeName}. Powered by Tebex.</span>
        <Link href="/admin" className="transition-colors hover:text-foreground">
          Store admin
        </Link>
      </div>
    </footer>
  );
}
