import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { createExportJob, downloadExportJob, getExportJobs, retryExportJob, type ExportJob } from "../../../api/exports.api";
import { DataTable } from "../../../components/DataTable";
import { LoadingState } from "../../../components/LoadingState";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { formatDate, getDefaultDateRange } from "../../../lib/formatDate";

export function ExportCenterPage() {
  const defaultRange = getDefaultDateRange();
  const queryClient = useQueryClient();
  const [exportType, setExportType] = useState("TRACKED_EVENTS");
  const exportJobsQuery = useQuery({
    queryKey: ["exports"],
    queryFn: getExportJobs
  });

  const mutation = useMutation({
    mutationFn: () =>
      createExportJob({
        exportType,
        filters: defaultRange
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exports"] });
    }
  });
  const retryMutation = useMutation({
    mutationFn: retryExportJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exports"] });
    }
  });

  return (
    <div className="space-y-6">
      <Card className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Export center</p>
          <h2 className="mt-1 text-xl font-semibold">Background-ready CSV workflow</h2>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={exportType}
            onChange={(event) => setExportType(event.target.value)}
            className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm"
          >
            <option value="TRACKED_EVENTS">Tracked events</option>
            <option value="AUDIT_EVENTS">Audit events</option>
            <option value="KPI_SUMMARY">KPI summary</option>
            <option value="MONITORING_METRICS">Monitoring metrics</option>
          </select>
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          {mutation.isPending ? "Creating..." : "Create tracked-event export"}
          </Button>
        </div>
      </Card>
      {exportJobsQuery.data ? (
        <DataTable
          rows={exportJobsQuery.data}
          columns={[
            { key: "exportType", header: "Type" },
            { key: "status", header: "Status" },
            {
              key: "createdAt",
              header: "Created",
              render: (value) => formatDate(String(value))
            },
            { key: "rowCount", header: "Rows" },
            {
              key: "id",
              header: "Actions",
              render: (_value, row) => (
                <div className="flex gap-2">
                  {(row as ExportJob).status === "COMPLETED" ? (
                    <button
                      className="font-medium text-[var(--primary)]"
                      onClick={async () => {
                        const blob = await downloadExportJob((row as ExportJob).id);
                        const url = URL.createObjectURL(blob);
                        const anchor = document.createElement("a");
                        anchor.href = url;
                        anchor.download = `${(row as ExportJob).exportType.toLowerCase()}.csv`;
                        anchor.click();
                        URL.revokeObjectURL(url);
                      }}
                    >
                      Download
                    </button>
                  ) : null}
                  {(row as ExportJob).status === "FAILED" ? (
                    <button
                      className="font-medium text-[var(--danger)]"
                      onClick={() => retryMutation.mutate((row as ExportJob).id)}
                    >
                      Retry
                    </button>
                  ) : null}
                </div>
              )
            }
          ]}
        />
      ) : (
        <LoadingState label="Loading export history..." />
      )}
    </div>
  );
}
