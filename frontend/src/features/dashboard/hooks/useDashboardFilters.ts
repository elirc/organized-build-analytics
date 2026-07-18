import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { getDefaultDateRange } from "../../../lib/formatDate";

export function useDashboardFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaults = getDefaultDateRange();

  const filters = useMemo(
    () => ({
      startDate: searchParams.get("startDate") ?? defaults.startDate,
      endDate: searchParams.get("endDate") ?? defaults.endDate,
      interval: searchParams.get("interval") ?? "day",
      eventType: searchParams.get("eventType") ?? ""
    }),
    [defaults.endDate, defaults.startDate, searchParams]
  );

  function updateFilters(nextFilters: Partial<Record<keyof typeof filters, string>>) {
    const next = new URLSearchParams(searchParams);

    Object.entries(nextFilters).forEach(([key, value]) => {
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
    });

    setSearchParams(next);
  }

  return { filters, updateFilters };
}
