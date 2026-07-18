import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore, type Role } from "./auth.store";

export function RequireRole({ roles }: { roles: Role[] }) {
  const role = useAuthStore((state) => state.user?.role);

  if (!role || !roles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
