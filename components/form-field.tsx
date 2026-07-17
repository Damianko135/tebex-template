import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/** The label-above-input wrapper repeated across every admin form. Wraps
 * whatever control is passed as `children` (Input, Textarea, a custom
 * field) rather than rendering one itself, so each call site keeps full
 * control over its own input's props (type, ref, required, ...). */
export function FormField({
  label,
  htmlFor,
  className,
  children,
}: {
  label: ReactNode;
  htmlFor: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
