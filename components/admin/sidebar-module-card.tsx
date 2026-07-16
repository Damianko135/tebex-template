import type { ReactNode } from "react";
import type { components } from "tebex-headless";

import { formatCurrency, formatNumber } from "@/lib/format";

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

function ProgressBar({ percentage, animated }: { percentage: number; animated?: boolean }) {
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
      <div
        className="h-full rounded-full bg-primary transition-all"
        style={{
          width: `${Math.min(100, Math.max(0, percentage))}%`,
          ...(animated ? { backgroundImage: "linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent)", backgroundSize: "1rem 1rem" } : {}),
        }}
      />
    </div>
  );
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
    <div className="space-y-3 rounded-lg border border-border p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">{header}</h3>
        <EnumBadge value={typeLabel} />
      </div>
      {children}
    </div>
  );
}

export function SidebarModuleCard({ module }: { module: ModuleEnvelope }) {
  switch (module.type) {
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
            {data.payments.map((payment, index) => (
              <li key={index} className="flex items-center justify-between gap-2">
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
            <span className={data.online ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}>
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
          <ProgressBar percentage={data.percentage} animated={data.bar_animated} />
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
          <ProgressBar percentage={data.percentage} animated={data.bar_animated} />
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
