import type { ReactNode } from "react";
import type { components } from "tebex-headless";

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, formatNumber } from "@/lib/format";
import { PROGRESS_STRIPE_STYLE } from "@/lib/ui/progress-stripe";

import { JSONViewer } from "./json-viewer";
import { PropertyGrid } from "./property-grid";
import { EnumBadge } from "./status-badge";

interface ModuleEnvelope {
  id?: number;
  type?: string;
  start_time?: string;
  end_time?: string | null;
  data?: unknown;
}

function ModuleShell({
  header,
  typeLabel,
  children,
}: {
  header: string;
  typeLabel: string;
  children: ReactNode;
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>{header}</CardTitle>
        <CardAction>
          <EnumBadge value={typeLabel} />
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-3">{children}</CardContent>
    </Card>
  );
}

export function SidebarModuleCard({ module }: { module: ModuleEnvelope }) {
  // The schema doesn't mark `data` nullable, but the live API can return it
  // as null for a module with nothing to show yet (e.g. no top customer
  // recorded). Route those through the "unrecognized" diagnostic view below
  // instead of crashing on `data.header`.
  switch (module.data ? module.type : undefined) {
    case "top_customer": {
      const data = module.data as components["schemas"]["TopCustomerData"];
      return (
        <ModuleShell header={data.header} typeLabel="Top customer">
          <p className="text-sm">
            <span className="font-medium">{data.username}</span>{" "}
            <span className="text-muted-foreground">({data.username_id})</span>
          </p>
          {data.total !== undefined && (
            <p className="text-lg font-semibold">{formatCurrency(data.total)}</p>
          )}
        </ModuleShell>
      );
    }

    case "textbox": {
      const data = module.data as components["schemas"]["TextboxData"];
      return (
        <ModuleShell header={data.header} typeLabel="Textbox">
          <div
            className="prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: data.text }}
          />
        </ModuleShell>
      );
    }

    case "recent_payments": {
      const data = module.data as components["schemas"]["RecentPaymentsData"];
      return (
        <ModuleShell header={data.header} typeLabel="Recent payments">
          <ul className="space-y-1.5 text-sm">
            {data.payments.map((payment) => (
              <li
                key={payment.created_at ? `${payment.username_id}-${payment.created_at}` : payment.username_id}
                className="flex items-center justify-between gap-2"
              >
                <span>
                  <span className="font-medium">{payment.username}</span>{" "}
                  <span className="text-muted-foreground">bought {payment.package.name}</span>
                </span>
                {payment.price != null && (
                  <span className="text-muted-foreground">
                    {formatCurrency(payment.price, payment.currency ?? undefined)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </ModuleShell>
      );
    }

    case "featured_package": {
      const data = module.data as components["schemas"]["FeaturedPackageData"];
      return (
        <ModuleShell header={data.header} typeLabel="Featured package">
          <p className="text-sm font-medium">{data.package.name}</p>
          {data.package.total_price !== undefined && (
            <p className="text-muted-foreground text-sm">
              {formatCurrency(data.package.total_price, data.package.currency)}
            </p>
          )}
        </ModuleShell>
      );
    }

    case "giftcard_balance": {
      const data = module.data as components["schemas"]["GiftcardBalanceData"];
      return (
        <ModuleShell header={data.header} typeLabel="Gift card balance">
          <p className="text-sm text-muted-foreground">
            Customers see their own gift card balance here on the storefront.
          </p>
        </ModuleShell>
      );
    }

    case "server_status": {
      const data = module.data as components["schemas"]["ServerStatusData"];
      return (
        <ModuleShell header={data.header} typeLabel="Server status">
          <p className="font-mono text-sm">
            {data.hostname}:{data.port}
          </p>
          <div className="flex items-center gap-2 text-sm">
            <span className={data.online ? "text-success" : "text-muted-foreground"}>
              {data.online ? "Online" : "Offline"}
            </span>
            {data.players && (
              <span className="text-muted-foreground">
                {formatNumber(data.players.online)} / {formatNumber(data.players.max)} players
              </span>
            )}
          </div>
        </ModuleShell>
      );
    }

    case "payment_goal": {
      const data = module.data as components["schemas"]["PaymentGoalData"];
      return (
        <ModuleShell header={data.header} typeLabel="Payment goal">
          <Progress
            value={data.percentage}
            indicatorStyle={data.bar_animated ? PROGRESS_STRIPE_STYLE : undefined}
          />
          <p className="text-xs text-muted-foreground">
            {data.total != null && data.target != null
              ? `${formatCurrency(data.total)} of ${formatCurrency(data.target)}`
              : `${data.percentage}%`}
          </p>
        </ModuleShell>
      );
    }

    case "community_goal": {
      const data = module.data as components["schemas"]["CommunityGoalData"];
      return (
        <ModuleShell header={data.header} typeLabel="Community goal">
          <Progress
            value={data.percentage}
            indicatorStyle={data.bar_animated ? PROGRESS_STRIPE_STYLE : undefined}
          />
          <p className="text-xs text-muted-foreground">
            {data.total_payments != null && data.target != null
              ? `${formatNumber(data.total_payments)} of ${formatNumber(data.target)}`
              : `${data.percentage}%`}
            {data.times_achieved != null && ` — achieved ${data.times_achieved}x`}
          </p>
        </ModuleShell>
      );
    }

    default:
      return (
        <ModuleShell header={module.type ?? "Unknown module"} typeLabel="Unrecognized">
          <p className="text-sm text-muted-foreground">
            This module type isn&apos;t recognized yet - showing its raw data.
          </p>
          <PropertyGrid value={(module.data as Record<string, unknown>) ?? {}} columns={1} />
          <JSONViewer data={module} label="Raw module" />
        </ModuleShell>
      );
  }
}
