import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import { RequireAuth } from "../auth/RequireAuth";
import { RequireRole } from "../auth/RequireRole";
import { LoginPage } from "../auth/LoginPage";
import { AppLayout } from "../layout/AppLayout";
import { LoadingState } from "../components/LoadingState";

const AuditDashboardPage = lazy(() => import("../features/audit/pages/AuditDashboardPage").then((module) => ({ default: module.AuditDashboardPage })));
const OperationsDashboardPage = lazy(() => import("../features/dashboard/pages/OperationsDashboardPage").then((module) => ({ default: module.OperationsDashboardPage })));
const EngineeringDashboardPage = lazy(() => import("../features/dashboard/pages/EngineeringDashboardPage").then((module) => ({ default: module.EngineeringDashboardPage })));
const ExecutiveDashboardPage = lazy(() => import("../features/dashboard/pages/ExecutiveDashboardPage").then((module) => ({ default: module.ExecutiveDashboardPage })));
const ProductDashboardPage = lazy(() => import("../features/dashboard/pages/ProductDashboardPage").then((module) => ({ default: module.ProductDashboardPage })));
const EventLogPage = lazy(() => import("../features/events/pages/EventLogPage").then((module) => ({ default: module.EventLogPage })));
const EventDetailPage = lazy(() => import("../features/events/pages/EventDetailPage").then((module) => ({ default: module.EventDetailPage })));
const MonitoringDashboardPage = lazy(() => import("../features/monitoring/pages/MonitoringDashboardPage").then((module) => ({ default: module.MonitoringDashboardPage })));
const ExportCenterPage = lazy(() => import("../features/exports/pages/ExportCenterPage").then((module) => ({ default: module.ExportCenterPage })));
const DashboardConfigPage = lazy(() => import("../features/dashboardConfigs/pages/DashboardConfigPage").then((module) => ({ default: module.DashboardConfigPage })));

function withSuspense(element: React.ReactNode) {
  return <Suspense fallback={<LoadingState label="Loading page..." />}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/", element: withSuspense(<OperationsDashboardPage />) },
          { path: "/product", element: withSuspense(<ProductDashboardPage />) },
          { path: "/engineering", element: withSuspense(<EngineeringDashboardPage />) },
          { path: "/executive", element: withSuspense(<ExecutiveDashboardPage />) },
          { path: "/exports", element: withSuspense(<ExportCenterPage />) },
          {
            element: <RequireRole roles={["SYSTEM_ADMIN", "OPS_MANAGER", "PRODUCT_MANAGER"]} />,
            children: [
              { path: "/events", element: withSuspense(<EventLogPage />) },
              { path: "/events/:id", element: withSuspense(<EventDetailPage />) }
            ]
          },
          {
            element: <RequireRole roles={["SYSTEM_ADMIN", "AUDIT_VIEWER"]} />,
            children: [{ path: "/audit", element: withSuspense(<AuditDashboardPage />) }]
          },
          {
            element: <RequireRole roles={["SYSTEM_ADMIN", "ENGINEERING_ADMIN"]} />,
            children: [
              { path: "/monitoring", element: withSuspense(<MonitoringDashboardPage />) }
            ]
          },
          {
            element: <RequireRole roles={["SYSTEM_ADMIN", "OPS_MANAGER", "PRODUCT_MANAGER", "ENGINEERING_ADMIN", "AUDIT_VIEWER"]} />,
            children: [{ path: "/dashboard-configs", element: withSuspense(<DashboardConfigPage />) }]
          }
        ]
      }
    ]
  }
]);
