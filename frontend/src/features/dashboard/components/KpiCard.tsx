import { Card } from "../../../components/ui/card";

export function KpiCard({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <Card className="bg-[linear-gradient(180deg,#fffdf8_0%,#f7f1e5_100%)]">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{label}</p>
      <p className="mt-4 text-3xl font-semibold">{value}</p>
      {detail ? <p className="mt-2 text-sm text-[var(--muted)]">{detail}</p> : null}
    </Card>
  );
}
