import { getAllPackages } from "@/lib/tebex/queries";
import { PackagesPage } from "@/themes/default/packages";

export const dynamic = "force-dynamic";

export default async function Page() {
  const result = await getAllPackages();
  return <PackagesPage result={result} />;
}
