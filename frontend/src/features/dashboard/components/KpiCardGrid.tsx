import { KpiCard } from "./KpiCard";
import { formatNumber, formatPercent } from "../../../lib/chartFormatters";
import type { KpiSummary } from "../../../api/dashboard.api";

export function KpiCardGrid({ data }: { data: KpiSummary }) {
  const cards = [
    { label: "Total events", value: formatNumber(data.totalEvents) },
    { label: "Active users", value: formatNumber(data.activeUsers) },
    { label: "Failed events", value: formatNumber(data.failedEvents) },
    { label: "Error rate", value: formatPercent(data.errorRate) },
    { label: "CSV exports", value: formatNumber(data.csvExports) }
  ];

  if (typeof data.averageApiLatencyMs === "number") {
    cards.push({ label: "Avg API latency", value: `${formatNumber(data.averageApiLatencyMs)} ms` });
  }

  if (typeof data.backgroundJobFailures === "number") {
    cards.push({ label: "Job failures", value: formatNumber(data.backgroundJobFailures) });
  }

  if (typeof data.adminActions === "number") {
    cards.push({ label: "Admin actions", value: formatNumber(data.adminActions) });
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <KpiCard key={card.label} label={card.label} value={card.value} />
      ))}
    </div>
  );
}
