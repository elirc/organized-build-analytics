import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import {
  createDashboardConfig,
  deleteDashboardConfig,
  getDashboardConfigs,
  updateDashboardConfig
} from "../../../api/dashboardConfigs.api";
import { DataTable } from "../../../components/DataTable";
import { LoadingState } from "../../../components/LoadingState";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";

export function DashboardConfigPage() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["dashboard-configs"],
    queryFn: getDashboardConfigs
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("OPS_MANAGER");
  const [description, setDescription] = useState("");

  const selectedConfig = useMemo(
    () => query.data?.find((config) => config.id === selectedId) ?? null,
    [query.data, selectedId]
  );

  const refreshConfigs = () => queryClient.invalidateQueries({ queryKey: ["dashboard-configs"] });

  const createMutation = useMutation({
    mutationFn: createDashboardConfig,
    onSuccess: () => {
      setName("");
      setDescription("");
      refreshConfigs();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof updateDashboardConfig>[1] }) =>
      updateDashboardConfig(id, payload),
    onSuccess: () => refreshConfigs()
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDashboardConfig,
    onSuccess: () => {
      setSelectedId(null);
      refreshConfigs();
    }
  });

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Dashboard configs</p>
        <h2 className="mt-1 text-xl font-semibold">Role-specific layouts</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Config name"
            className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm"
          />
          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm"
          >
            <option value="SYSTEM_ADMIN">System admin</option>
            <option value="OPS_MANAGER">Ops manager</option>
            <option value="PRODUCT_MANAGER">Product manager</option>
            <option value="ENGINEERING_ADMIN">Engineering admin</option>
            <option value="AUDIT_VIEWER">Audit viewer</option>
            <option value="EXECUTIVE_VIEWER">Executive viewer</option>
            <option value="READ_ONLY">Read only</option>
          </select>
          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Description"
            className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm md:col-span-2"
          />
        </div>
        <Button
          onClick={() =>
            createMutation.mutate({
              name,
              description,
              role,
              isDefault: false,
              layoutJson: { widgets: ["kpi-summary", "events-over-time"] }
            })
          }
        >
          Create config
        </Button>
      </Card>
      {query.data ? (
        <DataTable
          rows={query.data}
          columns={[
            { key: "name", header: "Name" },
            { key: "role", header: "Role" },
            { key: "description", header: "Description" },
            {
              key: "id",
              header: "Actions",
              render: (value, row) => (
                <div className="flex gap-2">
                  <button
                    className="font-medium text-[var(--primary)]"
                    onClick={() => {
                      setSelectedId(String(value));
                      setName(String(row.name));
                      setRole(String(row.role));
                      setDescription(String(row.description ?? ""));
                    }}
                  >
                    Select
                  </button>
                  <button
                    className="font-medium text-[var(--danger)]"
                    onClick={() => deleteMutation.mutate(String(value))}
                  >
                    Delete
                  </button>
                </div>
              )
            }
          ]}
        />
      ) : (
        <LoadingState label="Loading dashboard configs..." />
      )}
      {selectedConfig ? (
        <Card className="space-y-4">
          <h3 className="text-lg font-semibold">Edit selected config</h3>
          <p className="text-sm text-[var(--muted)]">The current editor keeps layout changes simple and intentional for onboarding.</p>
          <Button
            onClick={() =>
              updateMutation.mutate({
                id: selectedConfig.id,
                payload: {
                  name,
                  description,
                  role,
                  layoutJson: selectedConfig.layoutJson
                }
              })
            }
          >
            Save changes
          </Button>
        </Card>
      ) : null}
    </div>
  );
}
