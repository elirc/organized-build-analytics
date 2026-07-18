import { useQuery } from "@tanstack/react-query";

import { getActiveUsers, getConversionFunnel, getEventsOverTime, getKpiSummary } from "../../../api/dashboard.api";
import { ErrorState } from "../../../components/ErrorState";
import { LoadingState } from "../../../components/LoadingState";
import { ChartCard } from "../components/ChartCard";
import { ConversionFunnelChart } from "../components/ConversionFunnelChart";
import { DashboardFilterBar } from "../components/DashboardFilterBar";
import { EventsOverTimeChart } from "../components/EventsOverTimeChart";
import { KpiCardGrid } from "../components/KpiCardGrid";
import { MetricSeriesChart } from "../components/MetricSeriesChart";
import { useDashboardFilters } from "../hooks/useDashboardFilters";

export function ProductDashboardPage() {
  const { filters, updateFilters } = useDashboardFilters();
  const kpis = useQuery({
    queryKey: ["product", "kpis", filters.startDate, filters.endDate],
    queryFn: () => getKpiSummary({ startDate: filters.startDate, endDate: filters.endDate })
  });
  const activeUsers = useQuery({
    queryKey: ["product", "active-users", filters.startDate, filters.endDate, filters.interval],
    queryFn: () => getActiveUsers({ startDate: filters.startDate, endDate: filters.endDate, interval: filters.interval })
  });
  const funnel = useQuery({
    queryKey: ["product", "funnel", filters.startDate, filters.endDate],
    queryFn: () => getConversionFunnel({ startDate: filters.startDate, endDate: filters.endDate })
  });
  const eventTrend = useQuery({
    queryKey: ["product", "events", filters.startDate, filters.endDate, filters.interval],
    queryFn: () => getEventsOverTime({ startDate: filters.startDate, endDate: filters.endDate, interval: filters.interval })
  });

  if (kpis.isLoading) {
    return <LoadingState label="Loading product analytics..." />;
  }

  if (kpis.isError || !kpis.data) {
    return <ErrorState message={kpis.error?.message ?? "Failed to load product dashboard"} />;
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
      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Active users trend" description="Distinct actors are bucketed by date on the backend.">
          {activeUsers.data ? <MetricSeriesChart data={activeUsers.data.map((item) => ({ date: item.date, value: item.activeUsers }))} /> : <LoadingState label="Loading active users..." />}
        </ChartCard>
        <ChartCard title="Feature funnel" description="Product funnel stages are derived from tracked event types.">
          {funnel.data ? <ConversionFunnelChart data={funnel.data} /> : <LoadingState label="Loading funnel..." />}
        </ChartCard>
      </div>
      <ChartCard title="Event volume" description="Product teams can compare usage motion over shared date ranges.">
        {eventTrend.data ? <EventsOverTimeChart data={eventTrend.data.data} /> : <LoadingState label="Loading product trend..." />}
      </ChartCard>
    </div>
  );
}
