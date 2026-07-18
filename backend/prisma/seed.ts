import { EventType, ExportStatus, ExportType, MonitoringMetricType, Role } from "@prisma/client";

import { prisma } from "../src/db/prisma.js";
import { hashPassword } from "../src/shared/utils/password.js";

const roles: Role[] = [
  "SYSTEM_ADMIN",
  "OPS_MANAGER",
  "PRODUCT_MANAGER",
  "ENGINEERING_ADMIN",
  "AUDIT_VIEWER",
  "EXECUTIVE_VIEWER",
  "READ_ONLY"
];

async function main() {
  await prisma.refreshToken.deleteMany();
  await prisma.exportJob.deleteMany();
  await prisma.dashboardConfig.deleteMany();
  await prisma.metricSnapshot.deleteMany();
  await prisma.monitoringMetric.deleteMany();
  await prisma.auditEvent.deleteMany();
  await prisma.trackedEvent.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await hashPassword("Password123!");

  const users = await Promise.all(
    roles.map((role, index) =>
      prisma.user.create({
        data: {
          email: `${role.toLowerCase()}@example.com`,
          passwordHash,
          firstName: role.split("_")[0]!,
          lastName: `User${index + 1}`,
          role
        }
      })
    )
  );

  const now = new Date();
  const trackedEvents = Array.from({ length: 10_000 }, (_, index) => {
    const actor = users[index % users.length]!;
    const occurredAt = new Date(now);
    occurredAt.setDate(now.getDate() - (index % 90));
    occurredAt.setHours(index % 24, index % 60, 0, 0);

    const eventTypes = Object.values(EventType);
    const eventType = eventTypes[index % eventTypes.length]!;

    return {
      eventType,
      entityType: ["User", "Dashboard", "ExportJob", "AuditEvent"][index % 4]!,
      entityId: `entity-${index % 500}`,
      actorId: actor.id,
      actorEmail: actor.email,
      sessionId: `session-${index % 300}`,
      requestId: `req-${index}`,
      metadata: {
        source: "seed",
        feature: ["analytics", "audit", "monitoring", "exports"][index % 4]
      },
      occurredAt
    };
  });

  await prisma.trackedEvent.createMany({
    data: trackedEvents
  });

  const auditEvents = Array.from({ length: 1_000 }, (_, index) => {
    const actor = users[index % users.length]!;
    const createdAt = new Date(now);
    createdAt.setDate(now.getDate() - (index % 90));

    return {
      actorId: actor.id,
      action: ["USER_CREATED", "ROLE_CHANGED", "EXPORT_REQUESTED", "DASHBOARD_VIEWED"][index % 4]!,
      entityType: ["User", "ExportJob", "DashboardConfig"][index % 3]!,
      entityId: `audit-entity-${index % 200}`,
      metadata: {
        source: "seed",
        severity: ["low", "medium", "high"][index % 3]
      },
      ipAddress: `10.0.0.${(index % 200) + 1}`,
      userAgent: "seed-agent",
      createdAt
    };
  });

  await prisma.auditEvent.createMany({
    data: auditEvents
  });

  const monitoringMetrics = Array.from({ length: 5_000 }, (_, index) => {
    const recordedAt = new Date(now);
    recordedAt.setDate(now.getDate() - (index % 30));
    recordedAt.setHours(index % 24, 0, 0, 0);

    const metricTypes = Object.values(MonitoringMetricType);
    const metricType = metricTypes[index % metricTypes.length]!;

    return {
      metricType,
      name: `${metricType.toLowerCase()}-${index % 5}`,
      value:
        metricType === MonitoringMetricType.API_LATENCY
          ? 120 + (index % 200)
          : metricType === MonitoringMetricType.ERROR_RATE
            ? Number((index % 10) / 100)
            : metricType === MonitoringMetricType.CACHE_HIT_RATE
              ? 0.7 + ((index % 20) / 100)
              : 1 + (index % 25),
      unit: metricType === MonitoringMetricType.API_LATENCY ? "ms" : "ratio",
      tags: {
        source: "seed",
        region: ["us-west", "us-east"][index % 2]
      },
      recordedAt
    };
  });

  await prisma.monitoringMetric.createMany({
    data: monitoringMetrics
  });

  await prisma.exportJob.createMany({
    data: users.flatMap((user, index) => [
      {
        requestedById: user.id,
        exportType: Object.values(ExportType)[index % Object.values(ExportType).length]!,
        status: ExportStatus.COMPLETED,
        filtersJson: { startDate: "2026-05-01", endDate: "2026-05-31" },
        fileName: `export-${index}.csv`,
        fileUrl: `/exports/export-${index}.csv`,
        rowCount: 200 + index,
        completedAt: now,
        expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      }
    ])
  });

  await prisma.dashboardConfig.createMany({
    data: roles.map((role) => ({
      name: `${role} Default Dashboard`,
      description: `Seeded default dashboard for ${role}`,
      role,
      layoutJson: {
        widgets: ["kpi-summary", "events-over-time", "recent-activity"]
      },
      isDefault: true
    }))
  });

  console.log("Seed complete");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
