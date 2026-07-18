import { DataTable } from "../../../components/DataTable";
import { formatDate } from "../../../lib/formatDate";

export function RecentActivityTable({
  data
}: {
  data: Array<{ id: string; eventType: string; actorEmail: string | null; occurredAt: string }>;
}) {
  return (
    <DataTable
      rows={data}
      columns={[
        { key: "eventType", header: "Event type" },
        { key: "actorEmail", header: "Actor" },
        {
          key: "occurredAt",
          header: "Occurred",
          render: (value) => formatDate(String(value))
        }
      ]}
    />
  );
}
