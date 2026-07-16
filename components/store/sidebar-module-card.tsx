import type { CSSProperties } from "react";
import type { components } from "tebex-headless";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, formatNumber } from "@/lib/format";

interface ModuleEnvelope {
  id?: number;
  type?: string;
  data?: unknown;
}

const STRIPE_STYLE: CSSProperties = {
  backgroundImage:
    "linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent)",
  backgroundSize: "1rem 1rem",
};

/** Public-facing renderer for `/sidebar` modules. Unlike the admin version,
 * this silently omits anything it doesn't recognize instead of surfacing
 * raw JSON - a customer shouldn't see developer diagnostics. */
export function StoreSidebarModule({ module }: { module: ModuleEnvelope }) {
  // The schema doesn't mark `data` nullable, but the live API can return it
  // as null for a module with nothing to show yet (e.g. no top customer
  // recorded). Omit the module rather than crash on `data.header`.
  if (!module.data) return null;

  switch (module.type) {
    case "top_customer": {
      const data = module.data as components["schemas"]["TopCustomerData"];
      return (
        <Card size="sm">
          <CardHeader>
            <CardTitle className="text-sm">{data.header}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{data.username}</p>
            {data.total !== undefined && (
              <p className="text-2xl font-semibold">{formatCurrency(data.total)}</p>
            )}
          </CardContent>
        </Card>
      );
    }

    case "recent_payments": {
      const data = module.data as components["schemas"]["RecentPaymentsData"];
      return (
        <Card size="sm">
          <CardHeader>
            <CardTitle className="text-sm">{data.header}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {data.payments.slice(0, 5).map((payment, index) => (
                <li key={index} className="flex items-center justify-between gap-2">
                  <span className="truncate">
                    <span className="font-medium">{payment.username}</span>{" "}
                    <span className="text-muted-foreground">bought {payment.package.name}</span>
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      );
    }

    case "server_status": {
      const data = module.data as components["schemas"]["ServerStatusData"];
      return (
        <Card size="sm">
          <CardHeader>
            <CardTitle className="text-sm">{data.header}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="font-mono text-sm">
              {data.hostname}:{data.port}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span
                className={
                  data.online
                    ? "flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400"
                    : "text-muted-foreground"
                }
              >
                <span
                  className={`size-1.5 rounded-full ${data.online ? "bg-emerald-500" : "bg-muted-foreground"}`}
                />
                {data.online ? "Online" : "Offline"}
              </span>
              {data.players && (
                <span className="text-muted-foreground">
                  {formatNumber(data.players.online)} / {formatNumber(data.players.max)} playing
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      );
    }

    case "payment_goal": {
      const data = module.data as components["schemas"]["PaymentGoalData"];
      return (
        <Card size="sm">
          <CardHeader>
            <CardTitle className="text-sm">{data.header}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Progress
              value={data.percentage}
              indicatorStyle={data.bar_animated ? STRIPE_STYLE : undefined}
            />
            <p className="text-xs text-muted-foreground">
              {data.total != null && data.target != null
                ? `${formatCurrency(data.total)} raised of ${formatCurrency(data.target)} goal`
                : `${data.percentage}% of goal`}
            </p>
          </CardContent>
        </Card>
      );
    }

    case "community_goal": {
      const data = module.data as components["schemas"]["CommunityGoalData"];
      return (
        <Card size="sm">
          <CardHeader>
            <CardTitle className="text-sm">{data.header}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Progress
              value={data.percentage}
              indicatorStyle={data.bar_animated ? STRIPE_STYLE : undefined}
            />
            <p className="text-xs text-muted-foreground">
              {data.total_payments != null && data.target != null
                ? `${formatNumber(data.total_payments)} of ${formatNumber(data.target)}`
                : `${data.percentage}% complete`}
              {data.times_achieved != null && ` — achieved ${data.times_achieved}x`}
            </p>
          </CardContent>
        </Card>
      );
    }

    case "textbox": {
      const data = module.data as components["schemas"]["TextboxData"];
      return (
        <Card size="sm">
          <CardHeader>
            <CardTitle className="text-sm">{data.header}</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: data.text }}
            />
          </CardContent>
        </Card>
      );
    }

    default:
      return null;
  }
}
