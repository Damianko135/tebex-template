import { PackageCheck, ShieldCheck } from "lucide-react";

/** Shared reassurance copy shown next to purchase CTAs (package detail,
 * basket) - a first-time visitor deciding whether to trust an unfamiliar
 * store needs this at the point of decision, not only after committing to
 * add an item. */
export function TrustSignals({ className }: { className?: string }) {
  return (
    <ul className={className ?? "space-y-1.5 text-xs text-muted-foreground"}>
      <li className="flex items-center gap-1.5">
        <ShieldCheck className="size-3.5 shrink-0" />
        Payments are encrypted and processed securely by Tebex.
      </li>
      <li className="flex items-center gap-1.5">
        <PackageCheck className="size-3.5 shrink-0" />
        Most packages deliver automatically in-game within minutes.
      </li>
    </ul>
  );
}
