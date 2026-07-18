import { useQuery } from "@tanstack/react-query";

import { getMonitoringSeries, getMonitoringSummary, getQueueDepth, getRecentJobFailures } from "../../../api/monitoring.api";
import { ErrorState } from "../../../components/ErrorState";
import { LoadingState } from "../../../components/LoadingState";
import { DataTable } from "../../../components/DataTable";
import { ChartCard } from "../components/ChartCard";
import { DashboardFilterBar } from "../components/DashboardFilterBar";
import { KpiCard } from "../components/KpiCard";
import { MetricSeriesChart } from "../components/MetricSeriesChart";
import { useDashboardFilters } from "../hooks/useDashboardFilters";

export function EngineeringDashboardPage() {
  const { filters, updateFilters } = useDashboardFilters();

  const summaryQuery = useQuery({
    queryKey: ["monitoring", "summary", filters.startDate, filters.endDate],
    queryFn: () => getMonitoringSummary({ startDate: filters.startDate, endDate: filters.endDate })
  });

  const errorRateQuery = useQuery({
    queryKey: ["monitoring", "error-rate", filters.startDate, filters.endDate],
    queryFn: () => getMonitoringSeries("error-rate", { startDate: filters.startDate, endDate: filters.endDate })
  });
  const apiLatencyQuery = useQuery({
    queryKey: ["monitoring", "api-latency", filters.startDate, filters.endDate],
    queryFn: () => getMonitoringSeries("api-latency", { startDate: filters.startDate, endDate: filters.endDate })
  });
  const dbQueryTimeQuery = useQuery({
    queryKey: ["monitoring", "db-query-time", filters.startDate, filters.endDate],
    queryFn: () => getMonitoringSeries("db-query-time", { startDate: filters.startDate, endDate: filters.endDate })
  });
  const queueDepthQuery = useQuery({
    queryKey: ["monitoring", "queue-depth"],
    queryFn: getQueueDepth
  });
  const jobFailuresQuery = useQuery({
    queryKey: ["monitoring", "recent-job-failures", filters.startDate, filters.endDate],
    queryFn: () => getRecentJobFailures({ startDate: filters.startDate, endDate: filters.endDate })
  });

  if (summaryQuery.isLoading) {
    return <LoadingState label="Loading engineering metrics..." />;
  }

  if (summaryQuery.isError || !summaryQuery.data) {
    return <ErrorState message={summaryQuery.error?.message ?? "Failed to load monitoring summary"} />;
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
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Avg API latency" value={`${summaryQuery.data.averageApiLatencyMs} ms`} />
        <KpiCard label="Avg DB query time" value={`${summaryQuery.data.averageDbQueryTimeMs} ms`} />
        <KpiCard label="Avg error rate" value={`${(summaryQuery.data.averageErrorRate * 100).toFixed(2)}%`} />
        <KpiCard label="Queue backlog" value={String(queueDepthQuery.data?.total ?? summaryQuery.data.queueDepth.total)} />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="API latency" description="Time-series monitoring feed for API responsiveness.">
          {apiLatencyQuery.data ? <MetricSeriesChart data={apiLatencyQuery.data} /> : <LoadingState label="Loading latency..." />}
        </ChartCard>
        <ChartCard title="DB query time" description="Database timing trend for engineering support workflows.">
          {dbQueryTimeQuery.data ? <MetricSeriesChart data={dbQueryTimeQuery.data} color="#d97904" /> : <LoadingState label="Loading DB timings..." />}
        </ChartCard>
      </div>
      <ChartCard title="Error rate over time" description="Monitoring metrics are ingested separately from tracked events.">
        {errorRateQuery.data ? <MetricSeriesChart data={errorRateQuery.data} color="#b73c20" /> : <LoadingState label="Loading error-rate series..." />}
      </ChartCard>
      <ChartCard title="Recent job failures" description="Background job failures are recorded as tracked events for support teams.">
        {jobFailuresQuery.data ? (
          <DataTable
            rows={jobFailuresQuery.data}
            columns={[
              { key: "entityId", header: "Entity ID" },
              {
                key: "metadata",
                header: "Error",
                render: (value) =>
                  typeof value === "object" && value !== null && "error" in value
                    ? String((value as { error?: string }).error ?? "Unknown")
                    : "Unknown"
              },
              {
                key: "occurredAt",
                header: "Occurred",
                render: (value) => new Date(String(value)).toLocaleString()
              }
            ]}
          />
        ) : (
          <LoadingState label="Loading failed jobs..." />
        )}
      </ChartCard>
    </div>
  );
}
