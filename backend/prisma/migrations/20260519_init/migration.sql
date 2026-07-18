-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SYSTEM_ADMIN', 'OPS_MANAGER', 'PRODUCT_MANAGER', 'ENGINEERING_ADMIN', 'AUDIT_VIEWER', 'EXECUTIVE_VIEWER', 'READ_ONLY');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('USER_SIGNED_UP', 'USER_LOGGED_IN', 'USER_LOGIN_FAILED', 'FEATURE_USED', 'RECORD_CREATED', 'RECORD_UPDATED', 'RECORD_DELETED', 'CSV_EXPORTED', 'API_ERROR', 'BACKGROUND_JOB_FAILED', 'ADMIN_ACTION');

-- CreateEnum
CREATE TYPE "MetricType" AS ENUM ('COUNT', 'SUM', 'AVERAGE', 'RATE', 'PERCENTAGE', 'DURATION');

-- CreateEnum
CREATE TYPE "MonitoringMetricType" AS ENUM ('API_LATENCY', 'ERROR_RATE', 'JOB_FAILURE_RATE', 'QUEUE_DEPTH', 'DB_QUERY_TIME', 'CACHE_HIT_RATE');

-- CreateEnum
CREATE TYPE "ExportType" AS ENUM ('TRACKED_EVENTS', 'AUDIT_EVENTS', 'KPI_SUMMARY', 'MONITORING_METRICS');

-- CreateEnum
CREATE TYPE "ExportStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'EXPIRED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackedEvent" (
    "id" TEXT NOT NULL,
    "eventType" "EventType" NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "actorId" TEXT,
    "actorEmail" TEXT,
    "sessionId" TEXT,
    "requestId" TEXT,
    "metadata" JSONB,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrackedEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonitoringMetric" (
    "id" TEXT NOT NULL,
    "metricType" "MonitoringMetricType" NOT NULL,
    "name" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT,
    "tags" JSONB,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MonitoringMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MetricSnapshot" (
    "id" TEXT NOT NULL,
    "metricKey" TEXT NOT NULL,
    "metricType" "MetricType" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "dimensions" JSONB,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MetricSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DashboardConfig" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "role" "Role" NOT NULL,
    "layoutJson" JSONB NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DashboardConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExportJob" (
    "id" TEXT NOT NULL,
    "requestedById" TEXT NOT NULL,
    "exportType" "ExportType" NOT NULL,
    "status" "ExportStatus" NOT NULL DEFAULT 'PENDING',
    "filtersJson" JSONB,
    "fileName" TEXT,
    "fileUrl" TEXT,
    "rowCount" INTEGER,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "ExportJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "TrackedEvent_eventType_idx" ON "TrackedEvent"("eventType");

-- CreateIndex
CREATE INDEX "TrackedEvent_actorId_idx" ON "TrackedEvent"("actorId");

-- CreateIndex
CREATE INDEX "TrackedEvent_entityType_entityId_idx" ON "TrackedEvent"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "TrackedEvent_occurredAt_idx" ON "TrackedEvent"("occurredAt");

-- CreateIndex
CREATE INDEX "AuditEvent_actorId_idx" ON "AuditEvent"("actorId");

-- CreateIndex
CREATE INDEX "AuditEvent_action_idx" ON "AuditEvent"("action");

-- CreateIndex
CREATE INDEX "AuditEvent_entityType_entityId_idx" ON "AuditEvent"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditEvent_createdAt_idx" ON "AuditEvent"("createdAt");

-- CreateIndex
CREATE INDEX "MonitoringMetric_metricType_idx" ON "MonitoringMetric"("metricType");

-- CreateIndex
CREATE INDEX "MonitoringMetric_name_idx" ON "MonitoringMetric"("name");

-- CreateIndex
CREATE INDEX "MonitoringMetric_recordedAt_idx" ON "MonitoringMetric"("recordedAt");

-- CreateIndex
CREATE INDEX "MetricSnapshot_metricKey_idx" ON "MetricSnapshot"("metricKey");

-- CreateIndex
CREATE INDEX "MetricSnapshot_periodStart_periodEnd_idx" ON "MetricSnapshot"("periodStart", "periodEnd");

-- CreateIndex
CREATE INDEX "DashboardConfig_role_idx" ON "DashboardConfig"("role");

-- CreateIndex
CREATE INDEX "ExportJob_requestedById_idx" ON "ExportJob"("requestedById");

-- CreateIndex
CREATE INDEX "ExportJob_status_idx" ON "ExportJob"("status");

-- CreateIndex
CREATE INDEX "ExportJob_exportType_idx" ON "ExportJob"("exportType");

-- CreateIndex
CREATE INDEX "ExportJob_createdAt_idx" ON "ExportJob"("createdAt");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- AddForeignKey
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExportJob" ADD CONSTRAINT "ExportJob_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

