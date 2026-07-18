import { DataTable } from "../../../components/DataTable";
import { formatDate } from "../../../lib/formatDate";
import type { EventRow } from "../../../api/events.api";

export function EventTable({ rows }: { rows: EventRow[] }) {
  return (
    <DataTable
      rows={rows}
      columns={[
        { key: "eventType", header: "Event type" },
        { key: "actorEmail", header: "Actor" },
        { key: "entityType", header: "Entity" },
        {
          key: "occurredAt",
          header: "Occurred",
          render: (value) => formatDate(String(value))
        }
      ]}
    />
  );
}
