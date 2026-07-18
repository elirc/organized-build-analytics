import { useQuery } from "@tanstack/react-query";

import { getEventsOverTime, getKpiSummary } from "../../../api/dashboard.api";
import { ErrorState } from "../../../components/ErrorState";
import { LoadingState } from "../../../components/LoadingState";
import { ChartCard } from "../components/ChartCard";
import { DashboardFilterBar } from "../components/DashboardFilterBar";
import { EventsOverTimeChart } from "../components/EventsOverTimeChart";
import { KpiCardGrid } from "../components/KpiCardGrid";
import { useDashboardFilters } from "../hooks/useDashboardFilters";

export function ExecutiveDashboardPage() {
  const { filters, updateFilters } = useDashboardFilters();
  const kpis = useQuery({
    queryKey: ["executive", "kpis", filters.startDate, filters.endDate],
    queryFn: () => getKpiSummary({ startDate: filters.startDate, endDate: filters.endDate })
  });
  const trend = useQuery({
    queryKey: ["executive", "trend", filters.startDate, filters.endDate, filters.interval],
    queryFn: () => getEventsOverTime({ startDate: filters.startDate, endDate: filters.endDate, interval: filters.interval })
  });

  if (kpis.isLoading) {
    return <LoadingState label="Loading executive summary..." />;
  }

  if (kpis.isError || !kpis.data) {
    return <ErrorState message={kpis.error?.message ?? "Failed to load executive dashboard"} />;
  }

  return (
    <div className="space-y-6">
      <DashboardFilterBar
        startDate={filters.startDate}
        endDate={filters.endDate}
        interval={filters.interval}
        onRangeChange={(range) => updateFilters(range)}
        onIntervalChange={(interval) => updateFilters({ interval })}
      />
      <KpiCardGrid data={kpis.data} />
      <ChartCard title="Trend overview" description="Executive views stay summary-first and avoid raw operational feeds.">
        {trend.data ? <EventsOverTimeChart data={trend.data.data} /> : <LoadingState label="Loading summary trend..." />}
      </ChartCard>
    </div>
  );
}
