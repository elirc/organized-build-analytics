export function LoadingState({ label = "Loading dashboard data..." }: { label?: string }) {
  return <div className="rounded-3xl border border-dashed border-[var(--border)] bg-white/50 p-6 text-sm text-[var(--muted)]">{label}</div>;
}
