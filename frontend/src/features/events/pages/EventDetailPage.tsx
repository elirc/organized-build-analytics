import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";

import { getEventById } from "../../../api/events.api";
import { ErrorState } from "../../../components/ErrorState";
import { LoadingState } from "../../../components/LoadingState";
import { Card } from "../../../components/ui/card";
import { formatDate } from "../../../lib/formatDate";

export function EventDetailPage() {
  const { id } = useParams();
  const query = useQuery({
    queryKey: ["event", id],
    queryFn: () => getEventById(String(id)),
    enabled: Boolean(id)
  });

  if (query.isLoading) {
    return <LoadingState label="Loading event details..." />;
  }

  if (query.isError || !query.data) {
    return <ErrorState message={query.error?.message ?? "Failed to load event details"} />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Tracked event</p>
        <h2 className="mt-1 text-2xl font-semibold">{query.data.eventType}</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Occurred {formatDate(query.data.occurredAt)}
        </p>
      </Card>
      <Card className="space-y-3 text-sm">
        <p><span className="font-semibold">Event ID:</span> {query.data.id}</p>
        <p><span className="font-semibold">Actor:</span> {query.data.actorEmail ?? "Unknown"}</p>
        <p><span className="font-semibold">Entity:</span> {query.data.entityType ?? "n/a"} {query.data.entityId ?? ""}</p>
        <pre className="overflow-auto rounded-2xl bg-[var(--surface-2)] p-4 text-xs">
          {JSON.stringify(query.data.metadata ?? {}, null, 2)}
        </pre>
        <Link to="/events" className="text-sm font-medium text-[var(--primary)]">
          Back to event log
        </Link>
      </Card>
    </div>
  );
}
