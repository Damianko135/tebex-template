import Link from "next/link";

import { ErrorPanel } from "@/components/error-panel";
import { Button } from "@/components/ui/button";
import { getCurrentBasket } from "@/lib/store/basket";
import { BasketPage } from "@/themes/default/basket";

export const dynamic = "force-dynamic";

export default async function Page() {
  const result = await getCurrentBasket();

  if (!result.ok) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <ErrorPanel
          error={result.error}
          action={
            <Button size="sm" variant="outline" render={<Link href="/basket" />}>
              Try again
            </Button>
          }
        />
      </div>
    );
  }

  return <BasketPage basket={result.data} />;
}
