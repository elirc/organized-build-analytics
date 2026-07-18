import { promises as fs } from "node:fs";
import path from "node:path";

import { Prisma } from "@prisma/client";
import { ExportStatus, type ExportType } from "@prisma/client";

import { env } from "../../config/env.js";
import { getExportQueue } from "../../jobs/queue.js";
import { prisma } from "../../db/prisma.js";
import { AppError } from "../../shared/errors/AppError.js";
import { ERROR_CODES } from "../../shared/errors/errorCodes.js";
import { logWarn } from "../../shared/utils/logger.js";
import { dashboardService } from "../dashboard/dashboard.service.js";
import { auditService } from "../audit/audit.service.js";
import { exportsRepository } from "./exports.repository.js";
import { csvService } from "./csv.service.js";

const MAX_SYNC_EXPORT_ROWS = 10_000;

export const exportsService = {
  async create(input: {
    requestedById: string;
    requestedByRole: Express.User["role"];
    exportType: ExportType;
    filters?: Record<string, unknown>;
  }) {
    const job = await exportsRepository.create({
      requestedById: input.requestedById,
      exportType: input.exportType,
      filtersJson: input.filters as Prisma.InputJsonValue | undefined,
      status: ExportStatus.PENDING
    });

    await auditService.record({
      actorId: input.requestedById,
      action: "EXPORT_REQUESTED",
      entityType: "ExportJob",
      entityId: job.id,
      metadata: {
        exportType: input.exportType,
        filters: input.filters
      }
    });

    const estimatedRowCount = await estimateExportRows(input.exportType, input.filters);

    if (estimatedRowCount <= MAX_SYNC_EXPORT_ROWS) {
      return this.processJob(job.id, {
        requestedById: input.requestedById,
        requestedByRole: input.requestedByRole
      });
    }

    try {
      await getExportQueue().add("PROCESS_EXPORT", {
        exportJobId: job.id,
        requestedById: input.requestedById,
        requestedByRole: input.requestedByRole
      });
    } catch (error) {
      logWarn("export.queue.unavailable.falling_back", {
        exportJobId: job.id,
        error: error instanceof Error ? error.message : "unknown"
      });
      await this.processJob(job.id, {
        requestedById: input.requestedById,
        requestedByRole: input.requestedByRole
      });
    }

    return job;
  },

  async listForUser(userId: string) {
    return exportsRepository.listByUser(userId);
  },

  async getById(userId: string, id: string) {
    const job = await exportsRepository.findById(id);

    if (!job || job.requestedById !== userId) {
      throw new AppError(ERROR_CODES.NOT_FOUND, "Export job not found", 404);
    }

    return job;
  },

  async downloadForUser(userId: string, id: string) {
    const job = await this.getById(userId, id);

    if (job.status !== ExportStatus.COMPLETED || !job.fileUrl || !job.fileName) {
      throw new AppError(ERROR_CODES.BAD_REQUEST, "Export is not ready for download", 400);
    }

    return {
      fileName: job.fileName,
      filePath: resolveExportFilePath(job.fileName)
    };
  },

  async retry(userId: string, id: string, userRole: Express.User["role"]) {
    const job = await this.getById(userId, id);

    if (job.status !== ExportStatus.FAILED) {
      throw new AppError(ERROR_CODES.BAD_REQUEST, "Only failed exports can be retried", 400);
    }

    await exportsRepository.update(job.id, {
      status: ExportStatus.PENDING,
      errorMessage: null,
      completedAt: null,
      fileName: null,
      fileUrl: null
    });

    return this.create({
      requestedById: userId,
      requestedByRole: userRole,
      exportType: job.exportType,
      filters: (job.filtersJson as Record<string, unknown> | null) ?? undefined
    });
  },

  async processJob(
    exportJobId: string,
    context?: { requestedById?: string; requestedByRole?: Express.User["role"] }
  ) {
    const job = await exportsRepository.findById(exportJobId);

    if (!job) {
      throw new AppError(ERROR_CODES.NOT_FOUND, "Export job not found", 404);
    }

    await exportsRepository.update(job.id, {
      status: ExportStatus.PROCESSING,
      errorMessage: null
    });

    try {
      const requestContext = await resolveRequestContext(job.requestedById, context?.requestedByRole);
      const rows = await buildExportRows(job.exportType, job.filtersJson, requestContext.role);
      const csv = csvService.buildDownloadableCsv(rows);
      const fileName = csvService.buildFileName(job.exportType.toLowerCase());

      await fs.mkdir(resolveExportStorageDir(), { recursive: true });
      await fs.writeFile(resolveExportFilePath(fileName), csv, "utf8");

      const completedJob = await exportsRepository.update(job.id, {
        status: ExportStatus.COMPLETED,
        rowCount: rows.length,
        fileName,
        fileUrl: `${env.API_BASE_URL}/api/exports/${job.id}/download`,
        completedAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });

      await prisma.trackedEvent.create({
        data: {
          eventType: "CSV_EXPORTED",
          actorId: requestContext.userId,
          actorEmail: requestContext.email,
          entityType: "ExportJob",
          entityId: job.id,
          metadata: {
            exportType: job.exportType,
            rowCount: rows.length
          }
        }
      });

      await auditService.record({
        actorId: requestContext.userId,
        action: "EXPORT_COMPLETED",
        entityType: "ExportJob",
        entityId: job.id,
        metadata: {
          exportType: job.exportType,
          rowCount: rows.length
        }
      });

      return completedJob;
    } catch (error) {
      await exportsRepository.update(job.id, {
        status: ExportStatus.FAILED,
        errorMessage: error instanceof Error ? error.message : "Unknown export failure"
      });

      await prisma.trackedEvent.create({
        data: {
          eventType: "BACKGROUND_JOB_FAILED",
          entityType: "ExportJob",
          entityId: job.id,
          metadata: {
            error: error instanceof Error ? error.message : "Unknown export failure"
          }
        }
      });

      await auditService.record({
        actorId: context?.requestedById ?? job.requestedById,
        action: "EXPORT_FAILED",
        entityType: "ExportJob",
        entityId: job.id,
        metadata: {
          error: error instanceof Error ? error.message : "Unknown export failure"
        }
      });

      throw error;
    }
  }
};

async function estimateExportRows(
  exportType: ExportType,
  filters?: Record<string, unknown>
) {
  const whereDateRange = buildDateFilter(filters, "occurredAt");
  const whereAuditDateRange = buildDateFilter(filters, "createdAt");
  const whereMetricDateRange = buildDateFilter(filters, "recordedAt");

  switch (exportType) {
    case "TRACKED_EVENTS":
      return prisma.trackedEvent.count({ where: whereDateRange });
    case "AUDIT_EVENTS":
      return prisma.auditEvent.count({ where: whereAuditDateRange });
    case "MONITORING_METRICS":
      return prisma.monitoringMetric.count({ where: whereMetricDateRange });
    case "KPI_SUMMARY":
      return 1;
    default:
      return 0;
  }
}

async function buildExportRows(
  exportType: ExportType,
  filtersJson: Prisma.JsonValue | null,
  role: Express.User["role"]
) {
  const filters = (filtersJson as Record<string, unknown> | null) ?? {};

  switch (exportType) {
    case "TRACKED_EVENTS": {
      const items = await prisma.trackedEvent.findMany({
        where: buildDateFilter(filters, "occurredAt"),
        orderBy: { occurredAt: "desc" },
        take: 25_000
      });

      return items.map((item) => ({
        id: item.id,
        eventType: item.eventType,
        actorEmail: item.actorEmail,
        entityType: item.entityType,
        entityId: item.entityId,
        occurredAt: item.occurredAt.toISOString()
      }));
    }

    case "AUDIT_EVENTS": {
      const items = await prisma.auditEvent.findMany({
        where: buildDateFilter(filters, "createdAt"),
        include: {
          actor: {
            select: {
              email: true
            }
          }
        },
        orderBy: { createdAt: "desc" },
        take: 25_000
      });

      return items.map((item) => ({
        id: item.id,
        action: item.action,
        actorEmail: item.actor?.email,
        entityType: item.entityType,
        entityId: item.entityId,
        createdAt: item.createdAt.toISOString()
      }));
    }

    case "MONITORING_METRICS": {
      const items = await prisma.monitoringMetric.findMany({
        where: buildDateFilter(filters, "recordedAt"),
        orderBy: { recordedAt: "desc" },
        take: 25_000
      });

      return items.map((item) => ({
        id: item.id,
        metricType: item.metricType,
        name: item.name,
        value: item.value,
        unit: item.unit,
        recordedAt: item.recordedAt.toISOString()
      }));
    }

    case "KPI_SUMMARY": {
      const startDate = String(filters.startDate ?? new Date(Date.now() - 29 * 86_400_000).toISOString().slice(0, 10));
      const endDate = String(filters.endDate ?? new Date().toISOString().slice(0, 10));
      const summary = await dashboardService.getKpiSummary({
        role,
        startDate,
        endDate
      });

      return [
        {
          startDate,
          endDate,
          ...summary
        }
      ];
    }

    default:
      return [];
  }
}

function buildDateFilter(
  filters: Record<string, unknown> | undefined,
  field: "occurredAt" | "createdAt" | "recordedAt"
) {
  const safeFilters = filters ?? {};
  const startDate =
    typeof safeFilters.startDate === "string" ? new Date(safeFilters.startDate) : null;
  const endDate = typeof safeFilters.endDate === "string" ? new Date(safeFilters.endDate) : null;

  if (!startDate || !endDate || Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return {};
  }

  return {
    [field]: {
      gte: startDate,
      lte: endDate
    }
  };
}

async function resolveRequestContext(userId: string, role?: Express.User["role"]) {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new AppError(ERROR_CODES.NOT_FOUND, "Export requester not found", 404);
  }

  return {
    userId: user.id,
    email: user.email,
    role: role ?? user.role
  };
}

function resolveExportStorageDir() {
  return path.resolve(process.cwd(), env.EXPORT_STORAGE_DIR);
}

function resolveExportFilePath(fileName: string) {
  return path.join(resolveExportStorageDir(), fileName);
}
