import { useQuery } from "@tanstack/react-query";

import { getAuditEvents, getAuditOverTime, getAuditSummaryByAction, getAuditSummaryByActor } from "../../../api/audit.api";
import { ErrorState } from "../../../components/ErrorState";
import { LoadingState } from "../../../components/LoadingState";
import { ChartCard } from "../../dashboard/components/ChartCard";
import { DashboardFilterBar } from "../../dashboard/components/DashboardFilterBar";
import { EventsByTypeChart } from "../../dashboard/components/EventsByTypeChart";
import { MetricSeriesChart } from "../../dashboard/components/MetricSeriesChart";
import { useDashboardFilters } from "../../dashboard/hooks/useDashboardFilters";
import { DataTable } from "../../../components/DataTable";
import { formatDate } from "../../../lib/formatDate";

export function AuditDashboardPage() {
  const { filters, updateFilters } = useDashboardFilters();

  const actionQuery = useQuery({
    queryKey: ["audit", "by-action", filters.startDate, filters.endDate],
    queryFn: () => getAuditSummaryByAction({ startDate: filters.startDate, endDate: filters.endDate })
  });

  const actorQuery = useQuery({
    queryKey: ["audit", "by-actor", filters.startDate, filters.endDate],
    queryFn: () => getAuditSummaryByActor({ startDate: filters.startDate, endDate: filters.endDate })
  });

  const auditEventsQuery = useQuery({
    queryKey: ["audit", "events", filters.startDate, filters.endDate],
    queryFn: () => getAuditEvents({ startDate: filters.startDate, endDate: filters.endDate })
  });
  const auditOverTimeQuery = useQuery({
    queryKey: ["audit", "over-time", filters.startDate, filters.endDate],
    queryFn: () => getAuditOverTime({ startDate: filters.startDate, endDate: filters.endDate })
  });

  if (actionQuery.isLoading) {
    return <LoadingState label="Loading audit dashboard..." />;
  }

  if (actionQuery.isError || !actionQuery.data) {
    return <ErrorState message={actionQuery.error?.message ?? "Failed to load audit charts"} />;
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
      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Actions by type" description="Compliance-facing aggregation by audit action.">
          <EventsByTypeChart data={actionQuery.data.map((item) => ({ eventType: item.action, count: item.count }))} />
        </ChartCard>
        <ChartCard title="Actions by actor" description="Top actors across the selected audit range.">
          <EventsByTypeChart data={(actorQuery.data ?? []).map((item) => ({ eventType: item.actor, count: item.count }))} />
        </ChartCard>
      </div>
      <ChartCard title="Audit activity over time" description="Server-side grouping shows when compliance-sensitive activity clusters.">
        {auditOverTimeQuery.data ? <MetricSeriesChart data={auditOverTimeQuery.data} color="#b73c20" dataKey="count" /> : <LoadingState label="Loading audit trend..." />}
      </ChartCard>
      <ChartCard title="Recent audit events" description="Audit records remain server-filtered and paginated.">
        {auditEventsQuery.data ? (
          <DataTable
            rows={auditEventsQuery.data.items}
            columns={[
              { key: "action", header: "Action" },
              {
                key: "actor",
                header: "Actor",
                render: (value) => (value && typeof value === "object" && "email" in value ? String(value.email) : "Unknown")
              },
              { key: "entityType", header: "Entity" },
              {
                key: "createdAt",
                header: "Created",
                render: (value) => formatDate(String(value))
              }
            ]}
          />
        ) : (
          <LoadingState label="Loading audit records..." />
        )}
      </ChartCard>
    </div>
  );
}
