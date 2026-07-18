import type { HTMLAttributes } from "react";

import { cn } from "./cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_20px_60px_rgba(31,27,22,0.06)]",
        className
      )}
      {...props}
    />
  );
}
