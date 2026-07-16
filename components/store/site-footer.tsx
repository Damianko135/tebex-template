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
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-10 sm:px-6 md:grid-cols-4">
        <div className="col-span-2 space-y-2 md:col-span-1">
          <p className="font-semibold">{storeName}</p>
          {currency && <p className="text-sm text-muted-foreground">Prices shown in {currency}</p>}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Shop</p>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li><Link href="/categories" className="hover:text-foreground">Categories</Link></li>
            <li><Link href="/packages" className="hover:text-foreground">All packages</Link></li>
            <li><Link href="/basket" className="hover:text-foreground">Basket</Link></li>
          </ul>
        </div>

        {pages.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Info</p>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {pages.map((page) => (
                <li key={page.id}>
                  <Link href={`/pages/${page.slug}`} className="hover:text-foreground">
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm font-medium">Account</p>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li><Link href="/account/sign-in" className="hover:text-foreground">Sign in</Link></li>
          </ul>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-4 text-xs text-muted-foreground sm:px-6">
        <span>© {new Date().getFullYear()} {storeName}. Powered by Tebex.</span>
        <Link href="/admin" className="hover:text-foreground">
          Store admin
        </Link>
      </div>
    </footer>
  );
}
