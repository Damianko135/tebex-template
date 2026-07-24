import Link from "next/link";

/** Title + trailing "view all"-style link, used above each homepage section
 * grid (categories, new arrivals). */
export function SectionHeader({
  title,
  linkHref,
  linkLabel,
}: {
  title: string;
  linkHref: string;
  linkLabel: string;
}) {
  return (
    <div className="mb-8 flex items-end justify-between">
      <h2 className="font-heading text-2xl">{title}</h2>
      <Link href={linkHref} className="text-sm text-primary hover:underline">
        {linkLabel}
      </Link>
    </div>
  );
}
