export function EmptyState({ message }: { message: string }) {
  return <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 text-sm text-[var(--muted)]">{message}</div>;
}
