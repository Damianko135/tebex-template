import { Check, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function BooleanBadge({ value, trueLabel, falseLabel }: {
  value: boolean;
  trueLabel?: string;
  falseLabel?: string;
}) {
  return (
    <Badge
      variant={value ? "default" : "outline"}
      className={cn("gap-1", !value && "text-muted-foreground")}
    >
      {value ? <Check className="size-3" /> : <X className="size-3" />}
      {value ? (trueLabel ?? "Yes") : (falseLabel ?? "No")}
    </Badge>
  );
}

const TONE_CLASSES = {
  neutral: "",
  success: "border-transparent bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  warning: "border-transparent bg-amber-500/15 text-amber-600 dark:text-amber-400",
  danger: "border-transparent bg-destructive/15 text-destructive",
} as const;

export function EnumBadge({
  value,
  tone = "neutral",
}: {
  value: string;
  tone?: keyof typeof TONE_CLASSES;
}) {
  return (
    <Badge variant="outline" className={cn("capitalize", TONE_CLASSES[tone])}>
      {value.replace(/[_-]+/g, " ")}
    </Badge>
  );
}

export function NullableValue() {
  return <span className="text-muted-foreground italic">Not set</span>;
}
