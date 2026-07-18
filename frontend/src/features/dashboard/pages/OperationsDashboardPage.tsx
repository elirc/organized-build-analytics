import { useQuery } from "@tanstack/react-query";

import { getErrorRateSeries, getRecentActivity } from "../../../api/dashboard.api";
import { ErrorState } from "../../../components/ErrorState";
import { LoadingState } from "../../../components/LoadingState";
import { ChartCard } from "../components/ChartCard";
import { DashboardFilterBar } from "../components/DashboardFilterBar";
import { ErrorRateChart } from "../components/ErrorRateChart";
import { EventsByTypeChart } from "../components/EventsByTypeChart";
import { EventsOverTimeChart } from "../components/EventsOverTimeChart";
import { KpiCardGrid } from "../components/KpiCardGrid";
import { RecentActivityTable } from "../components/RecentActivityTable";
import { useDashboardFilters } from "../hooks/useDashboardFilters";
import { useEventsByType } from "../hooks/useEventsByType";
import { useEventsOverTime } from "../hooks/useEventsOverTime";
import { useKpiSummary } from "../hooks/useKpiSummary";

export function OperationsDashboardPage() {
  const { filters, updateFilters } = useDashboardFilters();
  const kpiQuery = useKpiSummary(filters.startDate, filters.endDate);
  const eventsOverTimeQuery = useEventsOverTime(filters.startDate, filters.endDate, filters.interval);
  const eventsByTypeQuery = useEventsByType(filters.startDate, filters.endDate);
  const recentActivityQuery = useQuery({
    queryKey: ["dashboard", "recent-activity", filters.startDate, filters.endDate],
    queryFn: () => getRecentActivity({ startDate: filters.startDate, endDate: filters.endDate })
  });
  const errorRateQuery = useQuery({
    queryKey: ["dashboard", "error-rate", filters.startDate, filters.endDate, filters.interval],
    queryFn: () =>
      getErrorRateSeries({
        startDate: filters.startDate,
        endDate: filters.endDate,
        interval: filters.interval
      })
  });

  if (kpiQuery.isLoading) {
    return <LoadingState />;
  }

  if (kpiQuery.isError || !kpiQuery.data) {
    return <ErrorState message={kpiQuery.error?.message ?? "Failed to load KPI summary"} />;
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
      <KpiCardGrid data={kpiQuery.data} />
      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Events over time" description="Chart-ready server aggregation for event volume trends.">
          {eventsOverTimeQuery.data ? <EventsOverTimeChart data={eventsOverTimeQuery.data.data} /> : <LoadingState label="Loading event trend..." />}
        </ChartCard>
        <ChartCard title="Events by type" description="Backend aggregation keeps the frontend lightweight.">
          {eventsByTypeQuery.data ? <EventsByTypeChart data={eventsByTypeQuery.data} /> : <LoadingState label="Loading event mix..." />}
        </ChartCard>
      </div>
      <ChartCard title="Error rate over time" description="Failure ratio is computed on the server from raw tracked events.">
        {errorRateQuery.data ? (
          <ErrorRateChart data={errorRateQuery.data.map((point) => ({ date: point.date, value: point.errorRate }))} />
        ) : (
          <LoadingState label="Loading error-rate trend..." />
        )}
      </ChartCard>
      <ChartCard title="Recent activity" description="A paged operational feed of the most recent tracked events in range.">
        {recentActivityQuery.data ? <RecentActivityTable data={recentActivityQuery.data} /> : <LoadingState label="Loading activity..." />}
      </ChartCard>
    </div>
  );
}
