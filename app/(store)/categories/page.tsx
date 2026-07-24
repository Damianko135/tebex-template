import { getCategoriesWithPackages } from "@/lib/tebex/queries";
import { CategoriesPage } from "@/themes/default/categories";

export const dynamic = "force-dynamic";

export default async function Page() {
  const result = await getCategoriesWithPackages();
  return <CategoriesPage result={result} />;
}
