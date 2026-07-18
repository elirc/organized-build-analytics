import { NavLink } from "react-router-dom";

import { useAuthStore } from "../auth/auth.store";
import { canConfigureDashboards, canViewAudit, canViewEvents, canViewMonitoring } from "../lib/permissions";

const baseLinks = [
  { to: "/", label: "Operations" },
  { to: "/product", label: "Product" },
  { to: "/engineering", label: "Engineering" },
  { to: "/executive", label: "Executive" },
  { to: "/exports", label: "Exports" }
];

export function Sidebar() {
  const role = useAuthStore((state) => state.user?.role);

  if (!role) {
    return null;
  }

  const links = [
    ...baseLinks,
    ...(canViewEvents(role) ? [{ to: "/events", label: "Events" }] : []),
    ...(canViewAudit(role) ? [{ to: "/audit", label: "Audit" }] : []),
    ...(canViewMonitoring(role) ? [{ to: "/monitoring", label: "Monitoring" }] : []),
    ...(canConfigureDashboards(role) ? [{ to: "/dashboard-configs", label: "Configs" }] : [])
  ];

  return (
    <aside className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="mb-6 rounded-3xl bg-[var(--primary-soft)] p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--primary)]">Role-aware</p>
        <h2 className="mt-2 text-lg font-semibold text-[var(--primary)]">Navigation</h2>
      </div>
      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              [
                "block rounded-2xl px-4 py-3 text-sm font-medium transition",
                isActive ? "bg-[var(--primary)] text-white" : "text-[var(--foreground)] hover:bg-[var(--surface-2)]"
              ].join(" ")
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
