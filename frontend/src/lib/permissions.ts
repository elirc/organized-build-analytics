import type { Role } from "../auth/auth.store";

const eventRoles: Role[] = ["SYSTEM_ADMIN", "OPS_MANAGER", "PRODUCT_MANAGER"];
const auditRoles: Role[] = ["SYSTEM_ADMIN", "AUDIT_VIEWER"];
const monitoringRoles: Role[] = ["SYSTEM_ADMIN", "ENGINEERING_ADMIN"];

export function canViewEvents(role: Role) {
  return eventRoles.includes(role);
}

export function canViewAudit(role: Role) {
  return auditRoles.includes(role);
}

export function canViewMonitoring(role: Role) {
  return monitoringRoles.includes(role);
}

export function canManageUsers(role: Role) {
  return role === "SYSTEM_ADMIN";
}

export function canConfigureDashboards(role: Role) {
  return role !== "READ_ONLY" && role !== "EXECUTIVE_VIEWER";
}
