import { ExternalLink } from "lucide-react";

import { ErrorPanel } from "@/components/error-panel";
import { JSONViewer } from "@/components/admin/json-viewer";
import { PageHeader } from "@/components/admin/page-header";
import { PropertyGrid } from "@/components/admin/property-grid";
import { BooleanBadge } from "@/components/admin/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBasket } from "@/lib/tebex/queries";

import {
  AddPackageForm,
  AuthUrlPanel,
  CouponPanel,
  CreatorCodePanel,
  GiftCardPanel,
} from "./basket-mutations";
import { BasketPackagesTable } from "./basket-packages-table";

export const dynamic = "force-dynamic";

export default async function BasketDetailPage({
  params,
}: {
  params: Promise<{ basketIdent: string }>;
}) {
  const { basketIdent } = await params;
  const result = await getBasket(basketIdent);

  if (!result.ok) {
    return (
      <div className="space-y-6">
        <PageHeader
          crumbs={[
            { label: "Dashboard", href: "/admin" },
            { label: "Baskets", href: "/admin/baskets" },
            { label: basketIdent },
          ]}
          title={basketIdent}
        />
        <ErrorPanel error={result.error} />
      </div>
    );
  }

  const basket = result.data.data;
  if (!basket) {
    return (
      <div className="space-y-6">
        <PageHeader
          crumbs={[
            { label: "Dashboard", href: "/admin" },
            { label: "Baskets", href: "/admin/baskets" },
            { label: basketIdent },
          ]}
          title={basketIdent}
        />
        <ErrorPanel error={{ message: "Basket not found." }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        crumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Baskets", href: "/admin/baskets" },
          { label: basketIdent },
        ]}
        title={`Basket ${basket.ident ?? basketIdent}`}
        description={
          <span className="flex items-center gap-2">
            <BooleanBadge value={Boolean(basket.complete)} trueLabel="Complete" falseLabel="Incomplete" />
            {basket.links?.checkout && (
              <a
                href={basket.links.checkout}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                Checkout link <ExternalLink className="size-3.5" />
              </a>
            )}
            {basket.links?.payment && (
              <a
                href={basket.links.payment}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                Payment record <ExternalLink className="size-3.5" />
              </a>
            )}
          </span>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <PropertyGrid
            value={basket}
            exclude={["packages", "coupons", "giftcards", "links"]}
            columns={3}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Packages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <BasketPackagesTable
            basketIdent={basketIdent}
            packages={basket.packages ?? []}
            currency={basket.currency}
          />
          <AddPackageForm basketIdent={basketIdent} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <CouponPanel basketIdent={basketIdent} coupons={basket.coupons ?? []} />
        <GiftCardPanel basketIdent={basketIdent} giftcards={basket.giftcards ?? []} />
        <CreatorCodePanel basketIdent={basketIdent} creatorCode={basket.creator_code} />
      </div>

      <AuthUrlPanel basketIdent={basketIdent} />

      <JSONViewer data={basket} label="Raw basket" />
    </div>
  );
}
