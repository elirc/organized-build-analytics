import { useMutation } from "@tanstack/react-query";

import { logout } from "../api/auth.api";
import { useAuthStore } from "../auth/auth.store";
import { Button } from "../components/ui/button";

export function Header() {
  const user = useAuthStore((state) => state.user);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const clearSession = useAuthStore((state) => state.clearSession);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      if (refreshToken) {
        await logout({ refreshToken });
      }
    },
    onSettled: () => {
      clearSession();
    }
  });

  return (
    <header className="flex items-center justify-between rounded-3xl border border-[var(--border)] bg-[var(--surface)] px-6 py-4">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Internal analytics platform</p>
        <h1 className="mt-1 text-2xl font-semibold">Operations and admin dashboards</h1>
      </div>
      <div className="flex items-center gap-4 text-right text-sm">
        <div>
          <p className="font-medium">{user?.firstName} {user?.lastName}</p>
          <p className="text-[var(--muted)]">{user?.role}</p>
        </div>
        <Button
          className="bg-[var(--accent)] text-[var(--foreground)]"
          onClick={() => logoutMutation.mutate()}
        >
          Sign out
        </Button>
      </div>
    </header>
  );
}
