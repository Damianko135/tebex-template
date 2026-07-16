"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Search, ShoppingCart, Store } from "lucide-react";
import type { components } from "tebex-headless";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type Category = components["schemas"]["Category"];
type CMSPage = components["schemas"]["CMSPage"];

export function SiteHeader({
  storeName,
  logo,
  categories,
  pages,
  cartCount,
}: {
  storeName: string;
  logo?: string | null;
  categories: Category[];
  pages: CMSPage[];
  cartCount: number;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
        pathname === href && "text-foreground"
      )}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          {logo ? (
            <Image src={logo} alt={storeName} width={28} height={28} unoptimized className="rounded-md" />
          ) : (
            <Store className="size-6" />
          )}
          <span className="hidden sm:inline">{storeName}</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLink("/", "Home")}
          {categories.length > 0 ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Categories <ChevronDown className="size-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {categories.map((category) => (
                  <DropdownMenuItem key={category.id} render={<Link href={`/categories/${category.id}`} />}>
                    {category.name}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem render={<Link href="/categories" />}>Browse all</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            navLink("/categories", "Categories")
          )}
          {navLink("/packages", "All packages")}
          {pages.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Info <ChevronDown className="size-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {pages.map((page) => (
                  <DropdownMenuItem key={page.id} render={<Link href={`/pages/${page.slug}`} />}>
                    {page.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>

        <form action="/search" className="ml-auto hidden max-w-xs flex-1 sm:flex">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input name="q" placeholder="Search packages..." className="pl-8" />
          </div>
        </form>

        <Link href="/basket" className="relative ml-auto sm:ml-0" aria-label="Basket">
          <Button variant="outline" size="icon">
            <ShoppingCart className="size-4" />
          </Button>
          {cartCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 min-w-5 justify-center rounded-full px-1 text-xs">
              {cartCount}
            </Badge>
          )}
        </Link>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>{storeName}</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4">
              <Link href="/" className="rounded-md px-2 py-2 text-sm font-medium hover:bg-muted" onClick={() => setMobileOpen(false)}>
                Home
              </Link>
              <Link href="/categories" className="rounded-md px-2 py-2 text-sm font-medium hover:bg-muted" onClick={() => setMobileOpen(false)}>
                Categories
              </Link>
              <Link href="/packages" className="rounded-md px-2 py-2 text-sm font-medium hover:bg-muted" onClick={() => setMobileOpen(false)}>
                All packages
              </Link>
              <Link href="/basket" className="rounded-md px-2 py-2 text-sm font-medium hover:bg-muted" onClick={() => setMobileOpen(false)}>
                Basket
              </Link>
              {pages.map((page) => (
                <Link
                  key={page.id}
                  href={`/pages/${page.slug}`}
                  className="rounded-md px-2 py-2 text-sm font-medium hover:bg-muted"
                  onClick={() => setMobileOpen(false)}
                >
                  {page.title}
                </Link>
              ))}
            </nav>
            <form action="/search" className="px-4">
              <div className="relative w-full">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input name="q" placeholder="Search packages..." className="pl-8" />
              </div>
            </form>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
