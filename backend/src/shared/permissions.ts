import { Role } from "@prisma/client";

export type Permission =
  | "users:manage"
  | "dashboard:view"
  | "dashboard:configure"
  | "events:view"
  | "audit:view"
  | "monitoring:view"
  | "exports:create"
  | "exports:view";

const permissionMatrix: Record<Role, Permission[]> = {
  SYSTEM_ADMIN: [
    "users:manage",
    "dashboard:view",
    "dashboard:configure",
    "events:view",
    "audit:view",
    "monitoring:view",
    "exports:create",
    "exports:view"
  ],
  OPS_MANAGER: [
    "dashboard:view",
    "dashboard:configure",
    "events:view",
    "exports:create",
    "exports:view"
  ],
  PRODUCT_MANAGER: [
    "dashboard:view",
    "dashboard:configure",
    "events:view",
    "exports:create",
    "exports:view"
  ],
  ENGINEERING_ADMIN: [
    "dashboard:view",
    "dashboard:configure",
    "monitoring:view",
    "exports:create",
    "exports:view"
  ],
  AUDIT_VIEWER: ["dashboard:view", "audit:view", "exports:create", "exports:view"],
  EXECUTIVE_VIEWER: ["dashboard:view"],
  READ_ONLY: ["dashboard:view"]
};

export function hasPermission(role: Role, permission: Permission) {
  return permissionMatrix[role].includes(permission);
}

export function applyMetricVisibility<T extends Record<string, unknown>>(role: Role, metrics: T) {
  const hiddenKeysByRole: Partial<Record<Role, string[]>> = {
    EXECUTIVE_VIEWER: ["recentFailures", "adminActions"],
    READ_ONLY: ["averageApiLatencyMs", "backgroundJobFailures", "adminActions"],
    PRODUCT_MANAGER: ["backgroundJobFailures"],
    AUDIT_VIEWER: ["revenueProxy", "averageApiLatencyMs"]
  };

  const hiddenKeys = hiddenKeysByRole[role] ?? [];

  return Object.fromEntries(
    Object.entries(metrics).filter(([key]) => !hiddenKeys.includes(key))
  ) as T;
}
