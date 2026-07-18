import type { PropsWithChildren } from "react";

import { Card } from "../../../components/ui/card";

export function ChartCard({ title, description, children }: PropsWithChildren<{ title: string; description: string }>) {
  return (
    <Card>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-[var(--muted)]">{description}</p>
      </div>
      {children}
    </Card>
  );
}
