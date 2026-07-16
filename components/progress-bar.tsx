export function ProgressBar({ percentage, animated }: { percentage: number; animated?: boolean }) {
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
      <div
        className="h-full rounded-full bg-primary transition-all"
        style={{
          width: `${Math.min(100, Math.max(0, percentage))}%`,
          ...(animated
            ? {
                backgroundImage:
                  "linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent)",
                backgroundSize: "1rem 1rem",
              }
            : {}),
        }}
      />
    </div>
  );
}
