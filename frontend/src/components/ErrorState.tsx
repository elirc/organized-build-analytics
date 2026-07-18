export function ErrorState({ message }: { message: string }) {
  return <div className="rounded-3xl border border-[var(--danger)]/30 bg-red-50 p-6 text-sm text-[var(--danger)]">{message}</div>;
}
