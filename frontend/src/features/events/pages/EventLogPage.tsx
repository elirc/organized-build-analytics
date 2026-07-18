import { Link } from "react-router-dom";

import { ErrorState } from "../../../components/ErrorState";
import { LoadingState } from "../../../components/LoadingState";
import { Card } from "../../../components/ui/card";
import { DashboardFilterBar } from "../../dashboard/components/DashboardFilterBar";
import { useDashboardFilters } from "../../dashboard/hooks/useDashboardFilters";
import { EventFilters } from "../components/EventFilters";
import { EventTable } from "../components/EventTable";
import { useEvents } from "../hooks/useEvents";

export function EventLogPage() {
  const { filters, updateFilters } = useDashboardFilters();
  const eventType = filters.eventType;
  const query = useEvents(filters.startDate, filters.endDate, eventType || undefined);

  if (query.isLoading) {
    return <LoadingState label="Loading event log..." />;
  }

  if (query.isError || !query.data) {
    return <ErrorState message={query.error?.message ?? "Failed to load events"} />;
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
      <Card className="flex justify-end">
        <EventFilters value={eventType} onChange={(value) => updateFilters({ eventType: value })} />
      </Card>
      <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[var(--surface-2)] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3">Event type</th>
              <th className="px-4 py-3">Actor</th>
              <th className="px-4 py-3">Entity</th>
              <th className="px-4 py-3">Occurred</th>
              <th className="px-4 py-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {query.data.items.map((row) => (
              <tr key={row.id} className="border-t border-[var(--border)]">
                <td className="px-4 py-3">{row.eventType}</td>
                <td className="px-4 py-3">{row.actorEmail ?? "Unknown"}</td>
                <td className="px-4 py-3">{row.entityType ?? "n/a"}</td>
                <td className="px-4 py-3">{new Date(row.occurredAt).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <Link to={`/events/${row.id}`} className="font-medium text-[var(--primary)]">
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
